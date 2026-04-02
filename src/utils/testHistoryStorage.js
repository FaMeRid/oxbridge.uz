/** Старый общий ключ (до разделения по аккаунтам) */
const LEGACY_KEY = "test_history";

/**
 * Ключ истории тестов: отдельно для каждого email; без входа — общий гостевой bucket.
 */
export function getTestHistoryStorageKey(user) {
  const email = user?.email?.trim().toLowerCase();
  if (email) return `test_history::${encodeURIComponent(email)}`;
  return "test_history::__guest__";
}

export function loadTestHistory(user) {
  const key = getTestHistoryStorageKey(user);
  try {
    let data = JSON.parse(localStorage.getItem(key)) || [];
    if (!Array.isArray(data)) data = [];

    if (data.length === 0) {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
      if (Array.isArray(legacy) && legacy.length > 0) {
        localStorage.setItem(key, JSON.stringify(legacy));
        localStorage.removeItem(LEGACY_KEY);
        return legacy;
      }
    }

    return data;
  } catch {
    return [];
  }
}

export function saveTestHistory(user, history) {
  localStorage.setItem(getTestHistoryStorageKey(user), JSON.stringify(history));
  window.dispatchEvent(
    new CustomEvent("oxbridge-test-history-updated", {
      detail: { email: user?.email?.trim().toLowerCase() ?? null },
    })
  );
}

export function clearTestHistory(user) {
  localStorage.removeItem(getTestHistoryStorageKey(user));
}
