import { INITIAL_COMPLAINTS, INITIAL_USERS } from '../constants/campusData';

const KEYS = {
  USERS: 'voxora_users_v1',
  COMPLAINTS: 'voxora_complaints_v1',
  SESSION: 'voxora_session_v1',
  REMEMBER_EMAIL: 'voxora_remember_email_v1',
};

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Handle storage quota limits gracefully
  }
}

export const storageService = {
  getUsers() {
    const existing = safeRead(KEYS.USERS, null);
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      safeWrite(KEYS.USERS, INITIAL_USERS);
      return INITIAL_USERS;
    }
    return existing;
  },

  saveUsers(users) {
    safeWrite(KEYS.USERS, users);
  },

  getComplaints() {
    const existing = safeRead(KEYS.COMPLAINTS, null);
    if (!existing || !Array.isArray(existing)) {
      safeWrite(KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
      return INITIAL_COMPLAINTS;
    }
    return existing;
  },

  saveComplaints(complaints) {
    safeWrite(KEYS.COMPLAINTS, complaints);
  },

  getSession() {
    return safeRead(KEYS.SESSION, null);
  },

  saveSession(sessionUser) {
    if (!sessionUser) {
      localStorage.removeItem(KEYS.SESSION);
      return;
    }
    safeWrite(KEYS.SESSION, sessionUser);
  },

  getRememberedEmail() {
    return safeRead(KEYS.REMEMBER_EMAIL, '');
  },

  saveRememberedEmail(email) {
    if (!email) {
      localStorage.removeItem(KEYS.REMEMBER_EMAIL);
      return;
    }
    safeWrite(KEYS.REMEMBER_EMAIL, email);
  },

  resetDemoData() {
    safeWrite(KEYS.USERS, INITIAL_USERS);
    safeWrite(KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
  },
};
