// src/pages/Admin.jsx
import React, { useEffect, useMemo, useState } from "react";
import "@/styles/globals.css";
import "@/styles/admin.css";
import { useClassroomStore } from "@/features/classroom/ClassroomStore";

const STORAGE_KEY = "oxbridge_tests";
const ADMIN_PASS  = "admin2026";
const SKILLS      = ["Listening", "Reading", "Writing", "Speaking"];

/* ── helpers ── */
function generateCode(testId, part) {
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `L${testId}P${part + 1}-${rand}`;
}
function loadTests() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveTests(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}
function fmtDate(s) {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" }) +
    " " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

/* ── Поиск токена в разных местах (zustand/localStorage/Supabase SDK) ── */
function getAuthToken() {
  for (const key of ["token", "access_token", "authToken", "jwt", "supabase_token"]) {
    const v = localStorage.getItem(key);
    if (v && v.length > 20 && !v.startsWith("{")) return v;
  }
  for (const key of ["auth-storage", "authStore", "auth", "user-storage"]) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const v = JSON.parse(raw);
      const t = v?.state?.token || v?.state?.accessToken || v?.token || v?.accessToken;
      if (t) return t;
    } catch {}
  }
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (key.startsWith("sb-") || key.includes("supabase")) {
      try {
        const v = JSON.parse(localStorage.getItem(key));
        const t = v?.access_token || v?.currentSession?.access_token || v?.[0];
        if (t) return t;
      } catch {}
    }
  }
  return null;
}

async function adminFetch(url, opts = {}) {
  const token = getAuthToken();
  if (!token) throw new Error("Токен не найден. Войди в аккаунт заново.");

  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return res.status === 204 ? null : res.json();
}

/* ══════════════════════════════════════════
   PASSWORD GATE
══════════════════════════════════════════ */
function PasswordGate({ onUnlock }) {
  const [pass, setPass] = useState("");
  const [err, setErr]   = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) onUnlock();
    else { setErr(true); setPass(""); setTimeout(() => setErr(false), 2000); }
  };

  return (
    <div className="admin-gate">
      <div className="admin-gate-box">
        <span className="admin-gate-icon">🛡️</span>
        <h2>Admin Panel</h2>
        <p>Enter password to continue</p>
        <form onSubmit={submit}>
          <input
            type="password"
            className={`form-input${err ? " input-error" : ""}`}
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoFocus
          />
          {err && <p className="gate-error">Wrong password ❌</p>}
          <button className="btn-primary" style={{ width: "100%", marginTop: 16 }}>Unlock</button>
        </form>
        <p className="gate-hint">Admin access only</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   STATS ROW
══════════════════════════════════════════ */
function StatsRow({ tests, users }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const newToday = users.filter((u) => new Date(u.created_at) >= today).length;
  const newWeek  = users.filter((u) => new Date(u.created_at) >= weekAgo).length;

  return (
    <div className="admin-stats-row">
      <div className="admin-stat-card total">
        <span className="admin-stat-icon">👥</span>
        <div className="admin-stat-num">{users.length}</div>
        <div className="admin-stat-label">Total Users</div>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-icon">✨</span>
        <div className="admin-stat-num">{newToday}</div>
        <div className="admin-stat-label">New Today</div>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-icon">📅</span>
        <div className="admin-stat-num">{newWeek}</div>
        <div className="admin-stat-label">This Week</div>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-icon">📋</span>
        <div className="admin-stat-num">{tests.length}</div>
        <div className="admin-stat-label">Total Tests</div>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-icon">🎧</span>
        <div className="admin-stat-num">{tests.filter(t => t.skill === "Listening").length}</div>
        <div className="admin-stat-label">Listening</div>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-icon">📖</span>
        <div className="admin-stat-num">{tests.filter(t => t.skill === "Reading").length}</div>
        <div className="admin-stat-label">Reading</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   USERS PANEL
══════════════════════════════════════════ */
function UsersPanel({ users, setUsers, loading, error, reload }) {
  const [query, setQuery]       = useState("");
  const [roleFilter, setRole]   = useState("all");
  const [statusFilter, setStat] = useState("all");
  const [selected, setSelected] = useState(null);

  const visible = useMemo(() => {
    let r = users;
    if (roleFilter !== "all")   r = r.filter((u) => (u.role || "user") === roleFilter);
    if (statusFilter === "banned") r = r.filter((u) => u.banned);
    if (statusFilter === "active") r = r.filter((u) => !u.banned);
    const q = query.trim().toLowerCase();
    if (q) {
      r = r.filter((u) => [u.name, u.first_name, u.last_name, u.username,
        u.telegram_username, u.email, u.phone, String(u.telegram_id), String(u.id)]
        .filter(Boolean).join(" ").toLowerCase().includes(q));
    }
    return r;
  }, [users, query, roleFilter, statusFilter]);

  const remove = async (u) => {
    if (!window.confirm(`Удалить ${u.name || u.username || u.id}?`)) return;
    try {
      await adminFetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
      setUsers((arr) => arr.filter((x) => x.id !== u.id));
      setSelected(null);
    } catch (e) { alert("Ошибка удаления: " + e.message); }
  };

  const patch = async (u, body) => {
    try {
      if ("role" in body) {
        const updated = await adminFetch(`/api/admin/users/${u.id}/role`, {
          method: "PATCH",
          body: JSON.stringify({ role: body.role }),
        });
        setUsers((arr) => arr.map((x) => x.id === u.id ? { ...x, ...updated } : x));
        setSelected((s) => s?.id === u.id ? { ...s, ...updated } : s);
      } else if ("banned" in body) {
        alert("Функция блокировки пока не настроена на бэкенде.");
      }
    } catch (e) {
      alert("Ошибка обновления: " + e.message);
    }
  };

  const exportCSV = () => {
    const rows = [["ID","Name","Username","Telegram ID","Email","Phone","Role","Banned","Created"]];
    visible.forEach((u) => rows.push([u.id, u.name||"", u.username||u.telegram_username||"",
      u.telegram_id||"", u.email||"", u.phone||"", u.role||"user", u.banned?"yes":"no",
      u.created_at||""].map((v) => `"${String(v).replace(/"/g,'""')}"`)));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url, download: `users_${new Date().toISOString().slice(0,10)}.csv`,
    });
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="admin-form" style={{ padding: "20px 22px" }}>
        <div className="admin-users-toolbar">
          <input
            className="form-input admin-users-search"
            placeholder="🔍 Поиск по имени, username, telegram, email, телефону..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="form-select admin-users-select"
            value={roleFilter} onChange={(e) => setRole(e.target.value)}>
            <option value="all">Все роли</option>
            <option value="student">Студенты</option>
            <option value="teacher">Учителя</option>
            <option value="admin">Админы</option>
          </select>
          <select className="form-select admin-users-select"
            value={statusFilter} onChange={(e) => setStat(e.target.value)}>
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="banned">Заблокированные</option>
          </select>
          <button className="btn-primary" onClick={reload} disabled={loading}>
            {loading ? "..." : "↻ Обновить"}
          </button>
          <button className="admin-danger-btn" onClick={exportCSV}
            style={{ color: "#0d7c59", borderColor: "rgba(13,124,89,0.3)" }}>
            ⬇ CSV
          </button>
        </div>
      </div>

      {error && <div className="admin-success" style={{
        background: "#fff5f5", color: "#dc2626", borderColor: "rgba(239,68,68,0.3)"
      }}>{error}</div>}

      {/* Table */}
      {loading ? (
        <div className="admin-empty"><p>Загрузка...</p></div>
      ) : visible.length === 0 ? (
        <div className="admin-empty">
          <p style={{ fontSize: "2rem", marginBottom: 12 }}>👤</p>
          <p style={{ color: "var(--text3)", fontWeight: 600 }}>
            {users.length === 0 ? "Регистраций пока нет" : "Никого не найдено"}
          </p>
        </div>
      ) : (
        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Пользователь</th>
                <th>Контакты</th>
                <th>Telegram</th>
                <th>Роль</th>
                <th>Зарегистрирован</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u, i) => {
                const initial = (u.name || u.first_name || u.full_name || u.username || "?").charAt(0).toUpperCase();
                return (
                  <tr key={u.id} className={u.banned ? "row-banned" : ""}>
                    <td className="cell-id">{i + 1}</td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{initial}</div>
                        <div>
                          <div className="user-name-cell">
                            {u.full_name || u.name || `${u.first_name||""} ${u.last_name||""}`.trim() || u.username || "—"}
                          </div>
                          <div className="user-id-cell">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        {u.email && <span>📧 {u.email}</span>}
                        {u.phone && <span>📱 {u.phone}</span>}
                        {!u.email && !u.phone && <span style={{ color: "var(--text3)" }}>—</span>}
                      </div>
                    </td>
                    <td>
                      {u.telegram_id ? (
                        <a href={u.telegram_username ? `https://t.me/${u.telegram_username}` : "#"}
                          target="_blank" rel="noreferrer" className="tg-chip">
                          {u.telegram_username ? `@${u.telegram_username}` : `id:${u.telegram_id}`}
                        </a>
                      ) : <span style={{ color: "var(--text3)" }}>—</span>}
                    </td>
                    <td>
                      <span className={`role-badge ${u.role === "admin" ? "role-admin" : "role-user"}`}>
                        {(u.role || "student").toUpperCase()}
                      </span>
                      {u.banned && <span className="ban-badge">BANNED</span>}
                    </td>
                    <td className="date-cell">{fmtDate(u.created_at)}</td>
                    <td>
                      <div className="action-cell">
                        <button className="action-btn" onClick={() => setSelected(u)} title="Подробнее">👁</button>
                        <button className="action-btn"
                          onClick={() => patch(u, { role: u.role === "admin" ? "student" : "admin" })}
                          title="Сменить роль">⚙</button>
                        <button className="action-btn action-danger" onClick={() => remove(u)} title="Удалить">✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* User detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            <div className="user-detail-head">
              <div className="user-detail-avatar">
                {(selected.full_name || selected.name || selected.first_name || selected.username || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="modal-title" style={{ textAlign: "left", marginBottom: 4 }}>
                  {selected.full_name || selected.name || `${selected.first_name||""} ${selected.last_name||""}`.trim() || selected.username || "—"}
                </h2>
                <div style={{ color: "var(--text3)", fontSize: "0.85rem" }}>
                  {selected.role === "admin" ? "Администратор" : (selected.role || "Студент")} · ID {selected.id}
                </div>
              </div>
            </div>

            <div className="user-detail-grid">
              <DetailRow label="Telegram ID" value={selected.telegram_id} />
              <DetailRow label="Telegram @" value={selected.telegram_username ? `@${selected.telegram_username}` : null} />
              <DetailRow label="Email" value={selected.email} />
              <DetailRow label="Телефон" value={selected.phone} />
              <DetailRow label="Класс" value={selected.class} />
              <DetailRow label="Регистрация" value={fmtDate(selected.created_at)} />
              <DetailRow label="Обновлён" value={fmtDate(selected.updated_at)} />
              <DetailRow label="Роль" value={selected.role || "student"} />
            </div>

            <div className="modal-actions" style={{ marginTop: 24 }}>
              <button className="btn-secondary"
                onClick={() => patch(selected, { role: selected.role === "admin" ? "student" : "admin" })}>
                ⚙ Сделать {selected.role === "admin" ? "студентом" : "админом"}
              </button>
              <button className="admin-danger-btn" onClick={() => remove(selected)}>🗑️ Удалить аккаунт</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <div className="detail-label">{label}</div>
      <div className="detail-value">{value || <span style={{ color: "var(--text3)" }}>—</span>}</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN ADMIN
══════════════════════════════════════════ */
export default function Admin() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("admin_unlocked") === "true"
  );

  const [tab, setTab] = useState("users");

  /* Tests (localStorage) */
  const [tests,   setTests]   = useState(loadTests);
  const [filter,  setFilter]  = useState("All");
  const [success, setSuccess] = useState("");

  const [newTest, setNewTest] = useState({ name: "", skill: "Listening", parts: 1 });
  const [sessionConfig, setSessionConfig] = useState({ testId: "", part: 1 });
  const createSession = useClassroomStore((s) => s.createSession);

  /* Users (backend) */
  const [users, setUsers]         = useState([]);
  const [usersLoading, setULoad]  = useState(false);
  const [usersError, setUErr]     = useState("");

  const reloadUsers = async () => {
    setULoad(true); setUErr("");
    try {
      const data = await adminFetch("/api/admin/users");
      setUsers(Array.isArray(data) ? data : (data.users || []));
    } catch (e) {
      setUErr("Не удалось загрузить пользователей: " + e.message);
    }
    setULoad(false);
  };

  useEffect(() => { if (unlocked) reloadUsers(); }, [unlocked]);

  const unlock = () => {
    sessionStorage.setItem("admin_unlocked", "true");
    setUnlocked(true);
  };

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };

  const addTest = () => {
    if (!newTest.name.trim()) return alert("Enter test name");
    const test = { id: Date.now(), name: newTest.name.trim(), skill: newTest.skill, parts: newTest.parts };
    const updated = [...tests, test];
    setTests(updated); saveTests(updated);
    setNewTest({ name: "", skill: "Listening", parts: 1 });
    flash("✅ Test created!");
  };

  const deleteTest = (id) => {
    if (!window.confirm("Delete this test?")) return;
    const updated = tests.filter((t) => t.id !== id);
    setTests(updated); saveTests(updated);
  };

  const handleUploadJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!json.name || !json.parts) return alert("❌ Invalid test format (need name + parts)");
        const imported = { ...json, id: Date.now() };
        const updated = [...tests, imported];
        setTests(updated); saveTests(updated);
        flash("✅ Test uploaded!");
      } catch { alert("❌ Invalid JSON file"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleCreateSession = () => {
    const test = tests.find((t) => t.id == sessionConfig.testId);
    if (!test) return alert("Select a test first");
    const partIndex = sessionConfig.part - 1;
    const session = {
      id: Date.now(), type: test.skill.toLowerCase(),
      testId: test.id, part: sessionConfig.part,
      code: generateCode(test.id, partIndex), students: [],
    };
    createSession(session);
    flash(`🎓 Session created! Code: ${session.code}`);
    alert(`Session Code: ${session.code}`);
  };

  const handleReset = () => {
    if (!window.confirm("Delete ALL tests? This cannot be undone.")) return;
    setTests([]); saveTests([]);
    flash("Tests cleared.");
  };

  const visible = filter === "All" ? tests : tests.filter((t) => t.skill === filter);

  if (!unlocked) return <PasswordGate onUnlock={unlock} />;

  return (
    <div className="admin-page">
      {/* TOPBAR */}
      <div className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Oxbridge · Admin</p>
          <h1 className="admin-title">Admin Dashboard 🛡️</h1>
        </div>
        {tab === "tests" && (
          <button className="admin-danger-btn" onClick={handleReset}>🗑️ Clear All Tests</button>
        )}
      </div>

      {/* STATS */}
      <StatsRow tests={tests} users={users} />

      {/* TABS */}
      <div className="admin-tabs">
        {[
          ["users", `👥 Users (${users.length})`],
          ["tests", `📚 Tests (${tests.length})`],
          ["sessions", `🎓 Sessions`],
        ].map(([k, label]) => (
          <button key={k} className={`admin-tab${tab === k ? " active" : ""}`} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>

      {success && <div className="admin-success">{success}</div>}

      {/* USERS TAB */}
      {tab === "users" && (
        <UsersPanel
          users={users} setUsers={setUsers}
          loading={usersLoading} error={usersError}
          reload={reloadUsers}
        />
      )}

      {/* TESTS TAB */}
      {tab === "tests" && (
        <>
          <div className="admin-form">
            <p className="admin-form-title">➕ Create New Test</p>
            <div className="admin-form-row">
              <div className="admin-field">
                <label>Test name</label>
                <input className="form-input" placeholder="e.g. Cambridge 20 Test 1"
                  value={newTest.name}
                  onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addTest()}/>
              </div>
              <div className="admin-field">
                <label>Skill</label>
                <select className="form-select" value={newTest.skill}
                  onChange={(e) => setNewTest({ ...newTest, skill: e.target.value })}>
                  {SKILLS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="admin-field" style={{ maxWidth: 120 }}>
                <label>Parts</label>
                <input type="number" className="form-input" min="1" max="4"
                  value={newTest.parts}
                  onChange={(e) => setNewTest({ ...newTest, parts: Number(e.target.value) })}/>
              </div>
              <div className="admin-field" style={{ justifyContent: "flex-end" }}>
                <label style={{ opacity: 0 }}>Go</label>
                <button className="btn-primary" onClick={addTest}>➕ Create</button>
              </div>
            </div>
          </div>

          <div className="admin-form">
            <p className="admin-form-title">📂 Upload JSON Test</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: 14 }}>
              Upload a test in the standard format: <code style={{ background: "var(--bg2)", padding: "2px 8px", borderRadius: 6 }}>{"{ id, name, skill, parts: [...] }"}</code>
            </p>
            <input type="file" accept=".json" className="form-input"
              style={{ cursor: "pointer" }} onChange={handleUploadJSON}/>
          </div>

          <div className="admin-toolbar">
            <p className="admin-list-header">{visible.length} test{visible.length !== 1 ? "s" : ""}</p>
            <div className="admin-filter-tabs">
              {["All", ...SKILLS].map((f) => (
                <button key={f} className={`admin-filter-tab${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="admin-empty">
              <p style={{ fontSize: "2rem", marginBottom: 12 }}>📭</p>
              <p style={{ color: "var(--text3)", fontWeight: 600 }}>No tests yet. Create one above.</p>
            </div>
          ) : (
            <div className="admin-tests-grid">
              {visible.map((t) => (
                <div key={t.id} className="admin-test-card">
                  <div className="admin-test-card-top">
                    <span className="admin-test-skill-badge">{t.skill}</span>
                    <button className="admin-delete-btn" onClick={() => deleteTest(t.id)} title="Delete">✕</button>
                  </div>
                  <div className="admin-test-name">{t.name}</div>
                  <div className="admin-test-meta">
                    <span>📄 {t.parts} part{t.parts !== 1 ? "s" : ""}</span>
                    <span style={{ color: "var(--crimson)", fontWeight: 700 }}>🆓 Free</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* SESSIONS TAB */}
      {tab === "sessions" && (
        <div className="admin-form" style={{ marginTop: 0 }}>
          <p className="admin-form-title">🎓 Create Teacher Session</p>
          <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: 16 }}>
            Generate a code that students can use at <strong>/jointest</strong> to start a specific test.
          </p>
          <div className="admin-form-row">
            <div className="admin-field">
              <label>Select test</label>
              <select className="form-select" value={sessionConfig.testId}
                onChange={(e) => setSessionConfig({ ...sessionConfig, testId: e.target.value })}>
                <option value="">— choose test —</option>
                {tests.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.skill})</option>
                ))}
              </select>
            </div>
            <div className="admin-field" style={{ maxWidth: 120 }}>
              <label>Part</label>
              <input type="number" className="form-input" min="1" max="4"
                value={sessionConfig.part}
                onChange={(e) => setSessionConfig({ ...sessionConfig, part: Number(e.target.value) })}/>
            </div>
            <div className="admin-field" style={{ justifyContent: "flex-end" }}>
              <label style={{ opacity: 0 }}>Go</label>
              <button className="btn-primary" onClick={handleCreateSession}>🎓 Generate Code</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}