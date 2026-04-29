// backend/controllers/telegramAuthController.js
//
// Принимает данные от Telegram Login Widget, проверяет HMAC-подпись
// токеном бота, создаёт пользователя в Supabase (если новый) и
// возвращает access_token + профиль — точно так же, как login().
//
// ENV нужны:
//   TELEGRAM_BOT_TOKEN     — токен бота (тот же, что в @BotFather)
//   TELEGRAM_AUTH_SECRET   — любой длинный секрет (для синтетического пароля)
//
// Маршрут (см. auth.js):  POST /api/auth/telegram

const crypto = require("crypto");
const { supabaseClient, supabaseAdmin } = require("../config/supabase");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const AUTH_SECRET =
  process.env.TELEGRAM_AUTH_SECRET ||
  "CHANGE-ME-to-a-long-random-string-please";
const MAX_AUTH_AGE_SECONDS = 60 * 60; // данные виджета валидны 1 час

// Поля, по которым Telegram считает hash.
// Любое ДРУГОЕ поле в payload сломает проверку — поэтому фильтруем строго.
const TG_SIGNED_FIELDS = [
  "auth_date",
  "first_name",
  "id",
  "last_name",
  "photo_url",
  "username",
];

/* ────────────────────────────────────────────────────────────
   1. Проверка подписи Telegram
   docs: https://core.telegram.org/widgets/login#checking-authorization
   ──────────────────────────────────────────────────────────── */
function isTelegramPayloadValid(payload) {
  if (!BOT_TOKEN) {
    console.error("[telegram] TELEGRAM_BOT_TOKEN is not set in env");
    return false;
  }
  if (!payload || typeof payload !== "object") return false;

  const { hash } = payload;
  if (!hash) {
    console.warn("[telegram] payload has no hash");
    return false;
  }

  // Строго белый список — игнорируем всё лишнее (source, __miniapp, и т.д.)
  const fields = {};
  for (const k of TG_SIGNED_FIELDS) {
    const v = payload[k];
    if (v !== undefined && v !== null && v !== "") {
      fields[k] = v;
    }
  }

  // data_check_string: все поля КРОМЕ hash, отсортированы по ключу,
  // вида "key=value", соединены '\n'
  const dataCheckString = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const computed = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // Дебаг (без секретов): видно, что считает бэк vs что прислал Telegram
  if (process.env.LOG_LEVEL === "debug") {
    console.log("[telegram] data_check_string:\n" + dataCheckString);
    console.log("[telegram] computed hash:", computed);
    console.log("[telegram] received hash:", hash);
    console.log(
      "[telegram] bot_id from token:",
      String(BOT_TOKEN).split(":")[0]
    );
  }

  // timing-safe compare
  if (computed.length !== String(hash).length) {
    console.warn("[telegram] hash length mismatch");
    return false;
  }
  if (
    !crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(String(hash)))
  ) {
    console.warn("[telegram] hash mismatch");
    return false;
  }

  // Защита от replay: auth_date не старше часа
  const authDate = Number(fields.auth_date);
  if (!Number.isFinite(authDate)) {
    console.warn("[telegram] invalid auth_date");
    return false;
  }
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > MAX_AUTH_AGE_SECONDS) {
    console.warn(
      `[telegram] auth_date too old (${now - authDate}s ago, limit ${MAX_AUTH_AGE_SECONDS}s)`
    );
    return false;
  }

  return true;
}

/* ────────────────────────────────────────────────────────────
   2. Стабильный пароль для Supabase из Telegram ID
   У юзера нет email/пароля — мы выводим их детерминированно
   из его telegram_id + серверного секрета. Это безопасно,
   потому что без AUTH_SECRET воссоздать пароль невозможно.
   ──────────────────────────────────────────────────────────── */
function syntheticEmail(telegramId) {
  return `tg_${telegramId}@telegram.oxbridge.uz`;
}

function syntheticPassword(telegramId) {
  return crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(`telegram:${telegramId}`)
    .digest("hex");
}

/* ────────────────────────────────────────────────────────────
   3. Контроллер
   ──────────────────────────────────────────────────────────── */
const telegramLogin = async (req, res) => {
  try {
    const tg = req.body;

    if (!isTelegramPayloadValid(tg)) {
      return res.status(401).json({
        success: false,
        error: "Подпись Telegram невалидна или просрочена",
      });
    }

    const telegramId = tg.id;
    const fullName = [tg.first_name, tg.last_name].filter(Boolean).join(" ");
    const email = syntheticEmail(telegramId);
    const password = syntheticPassword(telegramId);

    // 1) Пробуем войти — если юзер уже создавался, всё работает сразу.
    let { data: signIn, error: signInError } =
      await supabaseClient.auth.signInWithPassword({ email, password });

    // 2) Не получилось → создаём через admin и логинимся снова.
    if (signInError || !signIn?.session) {
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // не требуем подтверждение почты
        user_metadata: {
          full_name: fullName || tg.username || `tg_${telegramId}`,
          display_name: fullName || tg.username || null,
          username: tg.username || null,
          telegram_id: telegramId,
          photo_url: tg.photo_url || null,
          provider: "telegram",
          role: "student",
        },
      });

      // если упало НЕ из-за того, что юзер уже есть — это реальная ошибка
      if (createError && !/already.*registered|exists/i.test(createError.message)) {
        console.error("Supabase createUser error:", createError);
        return res.status(500).json({
          success: false,
          error: createError.message,
        });
      }

      const retry = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      signIn = retry.data;
      signInError = retry.error;

      if (signInError || !signIn?.session) {
        console.error("Sign-in after create failed:", signInError);
        return res.status(500).json({
          success: false,
          error: signInError?.message || "Не удалось войти",
        });
      }
    }

    const user = signIn.user;
    const session = signIn.session;

    return res.status(200).json({
      success: true,
      // фронт ждёт `token` — отдаём + дублируем как access_token
      token: session.access_token,
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: session.expires_in,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || fullName,
        username: tg.username || user.user_metadata?.username || null,
        photo_url: tg.photo_url || user.user_metadata?.photo_url || null,
        telegram_id: telegramId,
        role: user.user_metadata?.role || "student",
        provider: "telegram",
      },
    });
  } catch (err) {
    console.error("Telegram auth error:", err);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

module.exports = { telegramLogin };
