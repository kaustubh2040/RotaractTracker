
import type { User, Activity } from './types';
import { ActivityType, ActivityStatus } from './types';

export const USERS: User[] = [
  { id: 'admin', name: 'Dr. Evelyn Reed', role: 'admin', password: '123', positions: ['President'] },
  { id: 'user1', name: 'Alice Johnson', role: 'member', password: '123', positions: ['Secretary'] },
  { id: 'user2', name: 'Bob Williams', role: 'member', password: '123', positions: ['Vice President'] },
];

export const BOD_POSITIONS = [
  "President",
  "Secretary",
  "Joint Secretary",
  "Vice President",
  "Treasurer",
  "Finance Director",
  "Sergeant-At-Arms",
  "Immediate Past President",
  "Club Mentor",
  "Club Learning Facilitator",
  "Club Service Director",
  "Joint Club Service Director",
  "Professional Development Director",
  "Joint Professional Development Director",
  "Community Service Director",
  "Joint Community Service Director",
  "International Service Director",
  "Joint International Service Director",
  "World Rotaract Week Chairperson",
  "Public Relations Officer",
  "Public Image Director",
  "Joint Public Relations Officer",
  "Rotary Rotaract Relationship Officer",
  "Diversity, Equity & Inclusivity Representative",
  "Professional Assistance Officer",
  "Membership Development Director",
  "Sports Head",
  "Editor",
  "Joint Editor"
];

export const ACTIVITY_POINTS: Record<ActivityType, number> = {
  [ActivityType.EVENT_ATTENDANCE]: 15,
  [ActivityType.MEETING_ATTENDANCE]: 15,
  [ActivityType.EVENT_HOSTING]: 20,
};

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'act1', userId: 'user1', userName: 'Alice Johnson', type: ActivityType.EVENT_HOSTING, description: 'Hosted the Annual Charity Bake Sale', date: '2023-10-05', submittedAt: '2023-10-06', points: 20, status: ActivityStatus.APPROVED },
  { id: 'act2', userId: 'user2', userName: 'Bob Williams', type: ActivityType.EVENT_ATTENDANCE, description: 'Volunteered at the community cleanup drive', date: '2023-10-06', submittedAt: '2023-10-06', points: 15, status: ActivityStatus.APPROVED },
];
