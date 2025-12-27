
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
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  type: ActivityType;
  description: string;
  date: string; // The date the activity happened
  submittedAt: string; // The date the report was submitted
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

export interface MemberStats {
    userId: string;
    name: string;
    totalPoints: number;
    activities: Activity[];
    zone: 'green' | 'orange' | 'red';
}
