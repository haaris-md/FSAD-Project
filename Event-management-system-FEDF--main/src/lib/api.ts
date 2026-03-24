const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(BASE_URL + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export const authApi = {
  register: (data: any) => request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: any) => request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  forgot: (data: any) => request("/api/auth/forgot", { method: "POST", body: JSON.stringify(data) }),
  reset: (data: any) => request("/api/auth/reset", { method: "POST", body: JSON.stringify(data) }),
};

export const eventsApi = {
  list: () => request("/api/events"),
  create: (data: any) => request("/api/events", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/api/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/api/events/${id}`, { method: "DELETE" }),
  register: (id: string) => request(`/api/events/${id}/register`, { method: "POST" }),
};
