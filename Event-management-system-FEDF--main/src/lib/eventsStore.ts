export type RegistrationStatus = "registered" | "waitlisted" | "confirmed";

export type EventItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  event_date: string; // ISO
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  max_attendees?: number;
  organizer_id: string;
  organizer_name?: string;
  poster_data_url?: string; // base64 preview
  department?: string | null;
  club?: string | null;
  approvalStatus?: "pending" | "approved" | "rejected";
  isFeatured?: boolean; // Show in featured/upcoming section
  attendees: Array<{
    id: string;
    user_id: string;
    type: "individual" | "team";
    team_name?: string;
    members?: number;
    status: RegistrationStatus;
    registered_at: string;
    present?: boolean;
    certificateIssued?: boolean;
    department?: string | null;
  }>;
};

const KEY = "cc_events_v2";

function load(): EventItem[] {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as EventItem[]) : [];
}

function save(items: EventItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getAll(): EventItem[] {
  return load();
}

export function create(ev: Omit<EventItem, "id" | "attendees">): EventItem {
  const items = load();
  const item: EventItem = { ...ev, id: crypto.randomUUID(), attendees: [], approvalStatus: ev.approvalStatus || "pending" };
  items.push(item);
  save(items);
  return item;
}

export function update(id: string, patch: Partial<EventItem>): EventItem | null {
  const items = load();
  const idx = items.findIndex(e => e.id === id);
  if (idx < 0) return null;
  items[idx] = { ...items[idx], ...patch };
  save(items);
  return items[idx];
}

export function remove(id: string) {
  const items = load().filter(e => e.id !== id);
  save(items);
}

export function getUserEvents(userId: string): EventItem[] {
  return load().filter(e => e.organizer_id === userId);
}

function calcStatus(e: EventItem): RegistrationStatus {
  if (typeof e.max_attendees === "number" && e.attendees.length >= e.max_attendees) return "waitlisted";
  return "registered";
}

export function registerIndividual(eventId: string, userId: string, department?: string | null) {
  const items = load();
  const idx = items.findIndex(e => e.id === eventId);
  if (idx < 0) return null;
  const e = items[idx];
  const existing = e.attendees.find(a => a.user_id === userId);
  if (existing) return existing;
  const reg = {
    id: crypto.randomUUID(),
    user_id: userId,
    type: "individual" as const,
    status: calcStatus(e),
    registered_at: new Date().toISOString(),
    department: department || null,
  };
  e.attendees.push(reg as any);
  save(items);
  return reg;
}

export function registerTeam(eventId: string, userId: string, team_name: string, members: number, department?: string | null) {
  const items = load();
  const idx = items.findIndex(e => e.id === eventId);
  if (idx < 0) return null;
  const e = items[idx];
  const reg = {
    id: crypto.randomUUID(),
    user_id: userId,
    type: "team" as const,
    team_name,
    members,
    status: calcStatus(e),
    registered_at: new Date().toISOString(),
    department: department || null,
  };
  e.attendees.push(reg as any);
  save(items);
  return reg;
}

export function registrationStatusForUser(e: EventItem, userId: string): RegistrationStatus | null {
  const r = e.attendees.find(a => a.user_id === userId);
  return r ? r.status : null;
}

export function search(items: EventItem[], q: string, category: string | null, onlyUpcoming: boolean): EventItem[] {
  let res = items;
  if (q.trim()) {
    const s = q.toLowerCase();
    res = res.filter(x => `${x.title} ${x.description} ${x.location}`.toLowerCase().includes(s));
  }
  if (category) res = res.filter(x => x.category === category);
  if (onlyUpcoming) res = res.filter(x => new Date(x.event_date) >= new Date());
  return res;
}

export function paginate<T>(arr: T[], page: number, pageSize: number): { data: T[]; total: number; pages: number } {
  const total = arr.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  return { data: arr.slice(start, start + pageSize), total, pages };
}

export function upcoming(items: EventItem[]): EventItem[] {
  const now = new Date();
  return [...items]
    .filter(e => e.isFeatured === true && new Date(e.event_date) >= now && e.approvalStatus === "approved")
    .sort((a,b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 10);
}

// Approval workflow
export function approveEvent(id: string) {
  const items = load();
  const idx = items.findIndex(e => e.id === id);
  if (idx < 0) return;
  items[idx].approvalStatus = "approved";
  save(items);
}

export function rejectEvent(id: string) {
  const items = load();
  const idx = items.findIndex(e => e.id === id);
  if (idx < 0) return;
  items[idx].approvalStatus = "rejected";
  save(items);
}

// QR payload for registration
export function registrationQrData(eventId: string, regId: string) {
  return JSON.stringify({ t: "attend", eid: eventId, rid: regId });
}

// Mark attendance by QR payload or reg id
export function markAttendanceByRegId(regId: string) {
  const items = load();
  let updated = false;
  for (const e of items) {
    const r = e.attendees.find(a => a.id === regId);
    if (r) {
      r.present = true;
      updated = true;
      break;
    }
  }
  if (updated) save(items);
}

export function markAttendanceFromQrPayload(payload: string) {
  try {
    const data = JSON.parse(payload);
    if (data && data.rid) markAttendanceByRegId(String(data.rid));
  } catch {}
}

// Department stats
export function departmentStats(eventId: string): Array<{ department: string; count: number; present: number }> {
  const e = load().find(x => x.id === eventId);
  if (!e) return [];
  const map = new Map<string, { count: number; present: number }>();
  for (const a of e.attendees) {
    const key = (a.department || "Unknown");
    const cur = map.get(key) || { count: 0, present: 0 };
    cur.count += 1;
    if (a.present) cur.present += 1;
    map.set(key, cur);
  }
  return Array.from(map.entries()).map(([department, v]) => ({ department, count: v.count, present: v.present }));
}

export function markCertificateIssued(regId: string) {
  const items = load();
  for (const e of items) {
    const r = e.attendees.find(a => a.id === regId);
    if (r) {
      r.certificateIssued = true;
      break;
    }
  }
  save(items);
}
