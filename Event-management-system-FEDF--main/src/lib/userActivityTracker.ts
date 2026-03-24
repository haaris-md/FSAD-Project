import { getAll, type EventItem } from "./eventsStore";
import { getAllUsers, type LocalUser } from "./localAuth";

export interface UserActivity {
  userId: string;
  userEmail: string;
  userName: string;
  role: string;
  department?: string;
  studentId?: string;
  
  // Event Statistics
  eventsCreated: number;
  eventsParticipated: number;
  eventsVolunteered: number;
  eventsCompleted: number;
  
  // Detailed Lists
  createdEvents: Array<{
    id: string;
    title: string;
    date: string;
    status: string;
    attendees: number;
  }>;
  
  participatedEvents: Array<{
    id: string;
    title: string;
    date: string;
    registrationType: "individual" | "team";
    teamName?: string;
    status: string;
    present?: boolean;
    certificateIssued?: boolean;
  }>;
  
  volunteeredEvents: Array<{
    id: string;
    title: string;
    date: string;
    role: string;
  }>;
}

export function getUserActivity(userId: string): UserActivity | null {
  const users = getAllUsers();
  const user = Object.values(users).find(u => u.id === userId);
  if (!user) return null;
  
  const events = getAll();
  
  // Events created by user
  const createdEvents = events
    .filter(e => e.organizer_id === userId)
    .map(e => ({
      id: e.id,
      title: e.title,
      date: e.event_date,
      status: e.status,
      attendees: e.attendees.length,
    }));
  
  // Events user participated in
  const participatedEvents: UserActivity["participatedEvents"] = [];
  events.forEach(event => {
    const registration = event.attendees.find(a => a.user_id === userId);
    if (registration) {
      participatedEvents.push({
        id: event.id,
        title: event.title,
        date: event.event_date,
        registrationType: registration.type,
        teamName: registration.team_name,
        status: registration.status,
        present: registration.present,
        certificateIssued: registration.certificateIssued,
      });
    }
  });
  
  // Events volunteered (placeholder - can be extended)
  const volunteeredEvents: UserActivity["volunteeredEvents"] = [];
  
  // Calculate statistics
  const eventsCompleted = participatedEvents.filter(e => e.present).length;
  
  return {
    userId: user.id,
    userEmail: user.email,
    userName: user.full_name || user.email,
    role: user.role || "student",
    department: user.department,
    studentId: user.student_id,
    
    eventsCreated: createdEvents.length,
    eventsParticipated: participatedEvents.length,
    eventsVolunteered: volunteeredEvents.length,
    eventsCompleted,
    
    createdEvents,
    participatedEvents,
    volunteeredEvents,
  };
}

export function getAllUsersActivity(): UserActivity[] {
  const users = getAllUsers();
  const activities: UserActivity[] = [];
  
  Object.values(users).forEach(user => {
    const activity = getUserActivity(user.id);
    if (activity) {
      activities.push(activity);
    }
  });
  
  return activities;
}

export function getUserEventStats(userId: string) {
  const activity = getUserActivity(userId);
  if (!activity) return null;
  
  return {
    totalEvents: activity.eventsCreated + activity.eventsParticipated,
    created: activity.eventsCreated,
    participated: activity.eventsParticipated,
    completed: activity.eventsCompleted,
    volunteered: activity.eventsVolunteered,
    completionRate: activity.eventsParticipated > 0 
      ? Math.round((activity.eventsCompleted / activity.eventsParticipated) * 100) 
      : 0,
  };
}

export function getDepartmentEventStats(department: string) {
  const events = getAll();
  const users = getAllUsers();
  
  const departmentUsers = Object.values(users).filter(u => u.department === department);
  const departmentUserIds = departmentUsers.map(u => u.id);
  
  const eventsCreated = events.filter(e => departmentUserIds.includes(e.organizer_id));
  const totalAttendees = eventsCreated.reduce((sum, e) => sum + e.attendees.length, 0);
  
  return {
    department,
    totalUsers: departmentUsers.length,
    eventsCreated: eventsCreated.length,
    totalAttendees,
    averageAttendeesPerEvent: eventsCreated.length > 0 
      ? Math.round(totalAttendees / eventsCreated.length) 
      : 0,
  };
}

export function getEventParticipants(eventId: string) {
  const events = getAll();
  const event = events.find(e => e.id === eventId);
  if (!event) return [];
  
  const users = getAllUsers();
  
  return event.attendees.map(attendee => {
    const user = Object.values(users).find(u => u.id === attendee.user_id);
    return {
      registrationId: attendee.id,
      userId: attendee.user_id,
      userName: user?.full_name || user?.email || "Unknown",
      userEmail: user?.email || "Unknown",
      department: attendee.department || user?.department,
      studentId: user?.student_id,
      type: attendee.type,
      teamName: attendee.team_name,
      members: attendee.members,
      status: attendee.status,
      registeredAt: attendee.registered_at,
      present: attendee.present,
      certificateIssued: attendee.certificateIssued,
    };
  });
}
