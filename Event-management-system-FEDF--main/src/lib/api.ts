const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

type ApiPayload = Record<string, unknown>;

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const text = await res.text();
    try { return JSON.parse(text) as T; } catch { return text as unknown as T; }
}

export const authApi = {
  register: (data: ApiPayload) => request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: ApiPayload) => request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  forgot: (data: ApiPayload) => request("/api/auth/forgot", { method: "POST", body: JSON.stringify(data) }),
  reset: (data: ApiPayload) => request("/api/auth/reset", { method: "POST", body: JSON.stringify(data) }),
};

export const eventsApi = {
  list: () => request("/api/events"),
  create: (data: ApiPayload) => request("/api/events", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: ApiPayload) => request(`/api/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  register: (id: string) => request(`/api/events/${id}/register`, { method: "POST" }),
};
