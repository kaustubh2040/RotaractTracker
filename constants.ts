
import type { User, Activity } from './types';
import { ActivityType, ActivityStatus } from './types';

export const USERS: User[] = [
  { id: 'admin', name: 'Dr. Evelyn Reed', role: 'admin', password: '123' },
  { id: 'user1', name: 'Alice Johnson', role: 'member', password: '123' },
  { id: 'user2', name: 'Bob Williams', role: 'member', password: '123' },
  { id: 'user3', name: 'Charlie Brown', role: 'member', password: '123' },
  { id: 'user4', name: 'Diana Miller', role: 'member', password: '123' },
  { id: 'user5', name: 'Ethan Davis', role: 'member', password: '123' },
  { id: 'user6', name: 'Fiona Garcia', role: 'member', password: '123' },
  { id: 'user7', name: 'George Rodriguez', role: 'member', password: '123' },
  { id: 'user8', name: 'Hannah Wilson', role: 'member', password: '123' },
  { id: 'user9', name: 'Ian Martinez', role: 'member', password: '123' },
  { id: 'user10', name: 'Jane Anderson', role: 'member', password: '123' },
];

export const ACTIVITY_POINTS: Record<ActivityType, number> = {
  [ActivityType.EVENT_ATTENDANCE]: 15,
  [ActivityType.MEETING_ATTENDANCE]: 15,
  [ActivityType.EVENT_HOSTING]: 20,
};

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'act1', userId: 'user1', userName: 'Alice Johnson', type: ActivityType.EVENT_HOSTING, description: 'Hosted the Annual Charity Bake Sale', date: '2023-10-05', submittedAt: '2023-10-06', points: 20, status: ActivityStatus.APPROVED },
  { id: 'act2', userId: 'user2', userName: 'Bob Williams', type: ActivityType.EVENT_ATTENDANCE, description: 'Volunteered at the community cleanup drive', date: '2023-10-06', submittedAt: '2023-10-06', points: 15, status: ActivityStatus.APPROVED },
  { id: 'act3', userId: 'user3', userName: 'Charlie Brown', type: ActivityType.MEETING_ATTENDANCE, description: 'Attended October monthly meeting', date: '2023-10-02', submittedAt: '2023-10-03', points: 15, status: ActivityStatus.APPROVED },
];
