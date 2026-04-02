// src/features/classroom/ClassroomStore.js
import { create } from "zustand";

const STORAGE_KEY = "oxbridge_sessions";

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export const useClassroomStore = create((set, get) => ({
  sessions: loadSessions(),

  createSession: (session) => {
    const updated = [...get().sessions, session];
    saveSessions(updated);
    set({ sessions: updated });
    return session;
  },

  deleteSession: (code) => {
    const updated = get().sessions.filter((s) => s.code !== code);
    saveSessions(updated);
    set({ sessions: updated });
  },

  getSessionByCode: (code) => {
    return get().sessions.find(
      (s) => s.code.toUpperCase() === code.toUpperCase()
    );
  },

  clearSessions: () => {
    saveSessions([]);
    set({ sessions: [] });
  },
}));
