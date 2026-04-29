// src/features/auth/useTelegramLogin.js
//
// Универсальный хук авторизации через Telegram.
// Сам определяет контекст:
//   • Открыто как Mini App из Telegram → берём данные из WebApp API
//   • Открыто в обычном браузере → открываем попап Login Widget
//
// Использование:
//   const triggerTelegramLogin = useTelegramLogin({
//     botId: import.meta.env.VITE_TELEGRAM_BOT_ID,
//     onAuth: async (user) => { await telegramLogin(user); },
//     onError: (msg) => setLocalError(msg),
//   });
//   <button onClick={triggerTelegramLogin}>Continue with Telegram</button>

import { useEffect } from "react";

const SCRIPT_URL = "https://telegram.org/js/telegram-widget.js?22";

// Поля, которые Telegram Login Widget подписывает в HMAC.
// На бэк ОБЯЗАТЕЛЬНО отправлять только их + hash — иначе подпись не сойдётся.
const TG_SIGNED_FIELDS = [
  "auth_date",
  "first_name",
  "id",
  "last_name",
  "photo_url",
  "username",
];

function pickSignedFields(user) {
  const out = {};
  for (const k of TG_SIGNED_FIELDS) {
    const v = user[k];
    if (v !== undefined && v !== null && v !== "") {
      out[k] = v;
    }
  }
  if (user.hash) out.hash = user.hash;
  return out;
}

function loadTelegramScript() {
  return new Promise((resolve, reject) => {
    if (window.Telegram?.Login) return resolve();

    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Telegram widget"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Telegram widget"));
    document.head.appendChild(script);
  });
}

export function useTelegramLogin({ botId, onAuth, onError }) {
  // Подгружаем скрипт виджета один раз при монтировании
  useEffect(() => {
    loadTelegramScript().catch((e) => onError?.(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return async () => {
    try {
      /* ── 1. Mini App контекст (сайт открыт ВНУТРИ Telegram) ── */
      const tg = window.Telegram?.WebApp;
      const tgUser = tg?.initDataUnsafe?.user;

      if (tgUser && tg?.initData) {
        tg.ready();
        tg.expand();
        // Mini App использует другую схему валидации (через initData),
        // не Login Widget hash. Передаём отдельный флаг — бэк решит, как валидировать.
        return onAuth({
          __miniapp: true,
          initData: tg.initData,
          id: tgUser.id,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
          username: tgUser.username,
          photo_url: tgUser.photo_url,
        });
      }

      /* ── 2. Обычный браузер → попап Login Widget ── */
      if (!botId) {
        return onError?.(
          "VITE_TELEGRAM_BOT_ID is not set. Add it to .env"
        );
      }

      await loadTelegramScript();

      if (!window.Telegram?.Login) {
        return onError?.("Telegram widget unavailable");
      }

      window.Telegram.Login.auth(
        { bot_id: String(botId), request_access: "write" },
        (user) => {
          if (!user) {
            return onError?.("Telegram login cancelled");
          }
          // ВАЖНО: на бэк отправляем ТОЛЬКО поля, которые Telegram подписал.
          // Любое лишнее поле сломает HMAC-проверку на сервере.
          onAuth(pickSignedFields(user));
        }
      );
    } catch (e) {
      onError?.(e.message || "Telegram login failed");
    }
  };
}
