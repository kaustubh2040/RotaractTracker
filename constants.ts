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
  [ActivityType.EVENT_ATTENDANCE]: 10,
  [ActivityType.MEETING_ATTENDANCE]: 15,
  [ActivityType.ACTIVITY_PARTICIPATION]: 25,
  [ActivityType.EVENT_HOSTING]: 50,
};

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'act1', userId: 'user1', userName: 'Alice Johnson', type: ActivityType.EVENT_HOSTING, description: 'Hosted the Annual Charity Bake Sale', date: '2023-10-05', points: 50, status: ActivityStatus.APPROVED },
  { id: 'act2', userId: 'user2', userName: 'Bob Williams', type: ActivityType.ACTIVITY_PARTICIPATION, description: 'Volunteered at the community cleanup drive', date: '2023-10-06', points: 25, status: ActivityStatus.APPROVED },
  { id: 'act3', userId: 'user3', userName: 'Charlie Brown', type: ActivityType.MEETING_ATTENDANCE, description: 'Attended October monthly meeting', date: '2023-10-02', points: 15, status: ActivityStatus.APPROVED },
  { id: 'act4', userId: 'user1', userName: 'Alice Johnson', type: ActivityType.MEETING_ATTENDANCE, description: 'Attended October monthly meeting', date: '2023-10-02', points: 15, status: ActivityStatus.APPROVED },
  { id: 'act5', userId: 'user4', userName: 'Diana Miller', type: ActivityType.EVENT_ATTENDANCE, description: 'Attended the guest speaker seminar', date: '2023-09-28', points: 10, status: ActivityStatus.APPROVED },
  { id: 'act6', userId: 'user5', userName: 'Ethan Davis', type: ActivityType.EVENT_HOSTING, description: 'Organized the inter-club quiz night', date: '2023-09-25', points: 50, status: ActivityStatus.APPROVED },
  { id: 'act7', userId: 'user6', userName: 'Fiona Garcia', type: ActivityType.MEETING_ATTENDANCE, description: 'Attended September planning meeting.', date: '2023-09-15', points: 15, status: ActivityStatus.APPROVED },
  { id: 'act8', userId: 'user2', userName: 'Bob Williams', type: ActivityType.EVENT_ATTENDANCE, description: 'Attended the club anniversary dinner', date: '2023-10-10', points: 10, status: ActivityStatus.APPROVED },
  { id: 'act9', userId: 'user8', userName: 'Hannah Wilson', type: ActivityType.ACTIVITY_PARTICIPATION, description: 'Participated in the tree plantation drive.', date: '2023-10-12', points: 25, status: ActivityStatus.PENDING },
  { id: 'act10', userId: 'user9', userName: 'Ian Martinez', type: ActivityType.EVENT_ATTENDANCE, description: 'Attended the district conference.', date: '2023-10-15', points: 10, status: ActivityStatus.PENDING },
];