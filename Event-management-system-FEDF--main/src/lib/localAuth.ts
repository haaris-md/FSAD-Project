export type LocalUser = {
  id: string;
  email: string;
  password: string;
  full_name?: string;
  department?: string;
  student_id?: string;
  role?: "student" | "faculty" | "admin";
};

export type LocalSession = {
  id: string;
  email: string;
  full_name?: string;
  student_id?: string;
  role?: "student" | "faculty" | "admin";
  department?: string;
};

// switch to backend when environment variable is set
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === "true";

import { authApi } from "@/lib/api";


const USERS_KEY = "cc_users";
const SESSION_KEY = "cc_session";

function loadUsers(): Record<string, LocalUser> {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as Record<string, LocalUser>) : {};
}

function saveUsers(users: Record<string, LocalUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(session: LocalSession | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("cc-auth-change"));
}

export function getSession(): LocalSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as LocalSession) : null;
}

export function register(params: {
  email: string;
  password: string;
  full_name?: string;
  department?: string;
  student_id?: string;
  role?: "student" | "faculty" | "admin";
}): { error?: string; user?: LocalUser } {
  const users = loadUsers();
  const email = params.email.toLowerCase().trim();
  if (users[email]) return { error: "User already exists" };
  const user: LocalUser = {
    id: crypto.randomUUID(),
    email,
    password: params.password,
    full_name: params.full_name,
    department: params.department,
    student_id: params.student_id,
    role: params.role || "student",
  };
  users[email] = user;
  saveUsers(users);
  saveSession({ id: user.id, email: user.email, full_name: user.full_name, student_id: user.student_id, role: user.role, department: user.department });
  return { user };
}

export function login(params: { email: string; password: string }): { error?: string; user?: LocalUser } {
  const users = loadUsers();
  const email = params.email.toLowerCase().trim();
  const user = users[email];
  if (!user || user.password !== params.password) return { error: "Invalid credentials" };
  saveSession({ id: user.id, email: user.email, full_name: user.full_name, student_id: user.student_id, role: user.role, department: user.department });
  return { user };
}

export function logout() {
  saveSession(null);
}

export function mockGoogleSignup(): { error?: string; user?: LocalUser } {
  const email = `user${Math.floor(Math.random() * 10000)}@gmail.com`;
  const users = loadUsers();
  if (users[email]) return { error: "Mock Google user already exists" };
  const user: LocalUser = {
    id: crypto.randomUUID(),
    email,
    password: crypto.randomUUID(),
    full_name: "Google User",
    role: "student",
  };
  users[email] = user;
  saveUsers(users);
  saveSession({ id: user.id, email: user.email, full_name: user.full_name, student_id: user.student_id, role: user.role, department: user.department });
  return { user };
}

export function loginWithStudentId(params: { student_id: string; password: string }): { error?: string; user?: LocalUser } {
  const users = loadUsers();
  const user = Object.values(users).find(u => (u.student_id || "").toLowerCase() === params.student_id.toLowerCase());
  if (!user || user.password !== params.password) return { error: "Invalid credentials" };
  saveSession({ id: user.id, email: user.email, full_name: user.full_name, student_id: user.student_id, role: user.role, department: user.department });
  return { user };
}

export function getUserByEmail(email: string): LocalUser | undefined {
  const users = loadUsers();
  return users[email.toLowerCase().trim()];
}

// Clear all users from local storage
export function clearAllUsers(): void {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("cc-auth-change"));
}

// Get all users (for debugging)
export function getAllUsers(): Record<string, LocalUser> {
  return loadUsers();
}

// -------------------- profile & password helpers --------------------

export function updateProfile(params: {
  id: string;
  email?: string;
  full_name?: string;
  department?: string;
  student_id?: string;
}) {
  const users = loadUsers();
  const existing = Object.values(users).find(u => u.id === params.id);
  if (!existing) return { error: "User not found" };

  // if email is changing, ensure new email isn't already taken
  if (params.email && params.email.toLowerCase() !== existing.email) {
    const newEmail = params.email.toLowerCase().trim();
    if (users[newEmail]) {
      return { error: "Email already in use" };
    }
    // delete old key after copying
    delete users[existing.email];
    existing.email = newEmail;
    users[newEmail] = existing;
  }

  if (params.full_name !== undefined) existing.full_name = params.full_name;
  if (params.department !== undefined) existing.department = params.department;
  if (params.student_id !== undefined) existing.student_id = params.student_id;

  saveUsers(users);
  // update session if current user
  const session = getSession();
  if (session && session.id === existing.id) {
    saveSession({
      ...session,
      email: existing.email,
      full_name: existing.full_name,
      student_id: existing.student_id,
      department: existing.department,
    });
  }
  return { user: existing };
}

export function changePassword(params: { email: string; oldPassword: string; newPassword: string }) {
  const users = loadUsers();
  const email = params.email.toLowerCase().trim();
  const user = users[email];
  if (!user || user.password !== params.oldPassword) return { error: "Invalid credentials" };
  user.password = params.newPassword;
  saveUsers(users);
  return { success: true };
}

// simple token-based reset simulation (no email sending)
const RESET_KEY = "cc_reset_tokens";

type ResetToken = {
  email: string;
  expires: number;
};

function loadResetTokens(): Record<string, ResetToken> {
  const raw = localStorage.getItem(RESET_KEY);
  return raw ? (JSON.parse(raw) as Record<string, ResetToken>) : {};
}

function saveResetTokens(tokens: Record<string, ResetToken>) {
  localStorage.setItem(RESET_KEY, JSON.stringify(tokens));
}

export function requestPasswordReset(email: string) {
  const users = loadUsers();
  const key = email.toLowerCase().trim();
  if (!users[key]) return { error: "No user with that email" };
  const tokens = loadResetTokens();
  const token = crypto.randomUUID();
  tokens[token] = { email: key, expires: Date.now() + 1000 * 60 * 60 }; // 1h expiry
  saveResetTokens(tokens);
  return { token };
}

export function resetPassword(token: string, newPassword: string) {
  const tokens = loadResetTokens();
  const rec = tokens[token];
  if (!rec || rec.expires < Date.now()) {
    return { error: "Invalid or expired token" };
  }
  const users = loadUsers();
  const user = users[rec.email];
  if (!user) return { error: "User no longer exists" };
  user.password = newPassword;
  saveUsers(users);
  delete tokens[token];
  saveResetTokens(tokens);
  return { success: true };
}

