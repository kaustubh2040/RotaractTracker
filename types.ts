export enum ActivityType {
  EVENT_ATTENDANCE = 'Event Attendance',
  MEETING_ATTENDANCE = 'Meeting Attendance',
  ACTIVITY_PARTICIPATION = 'Activity Participation',
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
  date: string;
  points: number;
  status: ActivityStatus;
}

export interface MemberStats {
    userId: string;
    name: string;
    totalPoints: number;
    activities: Activity[];
    zone: 'green' | 'yellow' | 'red';
}