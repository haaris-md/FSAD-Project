import * as events from "@/lib/eventsStore";

function has(key: string) {
  try {
    const raw = localStorage.getItem(key);
    return !!(raw && JSON.parse(raw) && (Array.isArray(JSON.parse(raw)) ? JSON.parse(raw).length : Object.keys(JSON.parse(raw)).length));
  } catch {
    return false;
  }
}

export function seedOnce() {
  console.log("[SEED] Starting seed check...");
  
  if (!has("cc_clubs")) {
    console.log("[SEED] Seeding clubs...");
    const clubs = [
      { id: crypto.randomUUID(), name: "Tech Innovators", description: "Hackathons, workshops, and projects.", category: "tech", member_count: 42, president_name: "Alex Kumar" },
      { id: crypto.randomUUID(), name: "Cultural Crew", description: "Dance, music, and arts events.", category: "cultural", member_count: 58, president_name: "Priya Sharma" },
      { id: crypto.randomUUID(), name: "Sports Society", description: "Tournaments and fitness activities.", category: "sports", member_count: 35, president_name: "Rahul Verma" },
    ];
    localStorage.setItem("cc_clubs", JSON.stringify(clubs));
    console.log("[SEED] Clubs seeded:", clubs.length);
  } else {
    console.log("[SEED] Clubs already exist");
  }

  if (!has("cc_events_v2")) {
    console.log("[SEED] Seeding events...");
    const base = new Date();
    const sample = [
      {
        title: "AI Hackathon",
        description: "24-hour build sprint on AI problems.",
        category: "tech",
        location: "Innovation Lab",
        event_date: new Date(base.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "upcoming" as const,
        max_attendees: 100,
        organizer_id: "seed",
        organizer_name: "Tech Innovators",
        poster_data_url: undefined,
        department: "CSE",
        club: "Tech Innovators",
        approvalStatus: "approved" as const,
      },
      {
        title: "Cultural Night",
        description: "Music and dance performances.",
        category: "cultural",
        location: "Main Auditorium",
        event_date: new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "upcoming" as const,
        max_attendees: 300,
        organizer_id: "seed",
        organizer_name: "Cultural Crew",
        poster_data_url: undefined,
        department: "AI&DS",
        club: "Cultural Crew",
        approvalStatus: "approved" as const,
      },
      {
        title: "Cricket Tournament",
        description: "Inter-department cricket league.",
        category: "sports",
        location: "Ground A",
        event_date: new Date(base.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: "upcoming" as const,
        max_attendees: 50,
        organizer_id: "seed",
        organizer_name: "Sports Society",
        poster_data_url: undefined,
        department: "ECE",
        club: "Sports Society",
        approvalStatus: "approved" as const,
      },
    ];
    sample.forEach(e => events.create(e));
    console.log("[SEED] Events seeded:", sample.length);
  } else {
    console.log("[SEED] Events already exist");
  }

  if (!has("cc_lostfound")) {
    const items = [
      { id: crypto.randomUUID(), title: "Lost Wallet", description: "Brown leather wallet.", category: "accessories", location: "Cafeteria", status: "lost", contact_info: "contact@campus.test", created_at: new Date().toISOString(), poster_name: "John" },
      { id: crypto.randomUUID(), title: "Found USB Drive", description: "32GB black SanDisk.", category: "electronics", location: "Library", status: "found", contact_info: "helpdesk@campus.test", created_at: new Date().toISOString(), poster_name: "Helpdesk" },
    ];
    localStorage.setItem("cc_lostfound", JSON.stringify(items));
  }

  if (!has("cc_feedback")) {
    localStorage.setItem("cc_feedback", JSON.stringify({}));
  }
}
