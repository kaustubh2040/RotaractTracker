export enum ActivityType {
  EVENT_ATTENDANCE = 'Event Attendance',
  MEETING_ATTENDANCE = 'Meeting Attendance',
  EVENT_HOSTING = 'Event Hosting',
}

export enum ActivityStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'member';
  password: string;
  positions?: string[]; // Max 2
  photoUrl?: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  type: ActivityType;
  description: string;
  date: string; 
  submittedAt: string; 
  points: number;
  status: ActivityStatus;
}

export interface Announcement {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  reply?: string;
  createdAt: string;
}

export interface AppSettings {
  clubLogoUrl: string;
  appName: string;
  appSubtitle: string;
  aboutGroupImageUrl?: string;
}

export interface AboutContent {
  intro: string;
  vision: string;
  mission: string;
  values: string;
}

export interface PublicEvent {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    venue: string;
    category: string;
    hostClub: string;
    registrationEnabled: boolean;
    isUpcoming: boolean;
}

export interface EventRegistration {
    id: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
}

export interface MemberStats {
    userId: string;
    name: string;
    totalPoints: number;
    activities: Activity[];
}