
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import type { User, Activity, MemberStats, Announcement, Notification } from '../types';
import { ActivityStatus } from '../types';
import { USERS, INITIAL_ACTIVITIES, ACTIVITY_POINTS } from '../constants';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface ClubDataContextType {
    currentUser: User | null;
    login: (userId: string, password: string) => boolean;
    logout: () => void;
    users: User[];
    members: User[];
    activities: Activity[];
    announcements: Announcement[];
    notifications: Notification[];
    addActivity: (activity: Omit<Activity, 'id' | 'status' | 'userName' | 'submittedAt'>) => Promise<void>;
    updateActivityStatus: (activityId: string, status: ActivityStatus) => Promise<void>;
    updateMember: (userId: string, name: string, password?: string) => Promise<void>;
    addMember: (name: string, password: string) => Promise<void>;
    deleteMember: (userId: string) => Promise<void>;
    addAnnouncement: (text: string) => Promise<void>;
    sendNotification: (userId: string, text: string) => Promise<void>;
    memberStats: MemberStats[];
    loading: boolean;
    dbStatus: 'connected' | 'local' | 'error';
    dbErrorMessage?: string;
}

export const ClubDataContext = createContext<ClubDataContextType>({} as ClubDataContextType);

export const useClubData = () => {
    return useContext(ClubDataContext);
};

const STORAGE_KEY_USERS = 'rotaract_tracker_users';
const STORAGE_KEY_ACTIVITIES = 'rotaract_tracker_activities';

export const ClubDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [dbStatus, setDbStatus] = useState<'connected' | 'local' | 'error'>('local');
    const [dbErrorMessage, setDbErrorMessage] = useState<string>();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            
            if (isSupabaseConfigured && supabase) {
                try {
                    const { data: userData } = await supabase.from('users').select('*');
                    if (userData && userData.length > 0) {
                        setUsers(userData);
                    } else {
                        await supabase.from('users').upsert(USERS);
                        setUsers(USERS);
                    }

                    const { data: activityData } = await supabase.from('activities').select('*');
                    if (activityData) {
                        setActivities(activityData.map((row: any) => ({
                            id: row.id,
                            userId: row.user_id,
                            userName: row.user_name,
                            type: row.type,
                            description: row.description,
                            date: row.date,
                            submittedAt: row.submitted_at || row.date,
                            points: row.points,
                            status: row.status as ActivityStatus
                        })));
                    }

                    const { data: annData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
                    if (annData) setAnnouncements(annData.map(a => ({ id: a.id, text: a.text, author: a.author, createdAt: a.created_at })));

                    const { data: notData } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
                    if (notData) setNotifications(notData.map(n => ({ id: n.id, userId: n.user_id, text: n.text, createdAt: n.created_at, read: n.read })));

                    setDbStatus('connected');
                } catch (e: any) {
                    setDbStatus('error');
                    setDbErrorMessage(e.message);
                }
            } else {
                setDbStatus('local');
                const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
                const savedActivities = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
                setUsers(savedUsers ? JSON.parse(savedUsers) : USERS);
                setActivities(savedActivities ? JSON.parse(savedActivities) : INITIAL_ACTIVITIES);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    const members = useMemo(() => users.filter(u => u.role === 'member'), [users]);

    const login = (userId: string, password: string): boolean => {
        const user = users.find(u => u.id === userId);
        if (user && user.password === password) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const logout = () => setCurrentUser(null);

    const addActivity = async (activity: Omit<Activity, 'id' | 'status' | 'userName' | 'submittedAt'>) => {
        const user = users.find(u => u.id === activity.userId);
        if (!user) return;

        const newActivity: Activity = {
            ...activity,
            id: `act${Date.now()}`,
            status: ActivityStatus.PENDING,
            userName: user.name,
            submittedAt: new Date().toISOString().split('T')[0],
        };

        if (dbStatus === 'connected' && supabase) {
            await supabase.from('activities').insert([{
                id: newActivity.id,
                user_id: newActivity.userId,
                user_name: newActivity.userName,
                type: newActivity.type,
                description: newActivity.description,
                date: newActivity.date,
                submitted_at: newActivity.submittedAt,
                points: newActivity.points,
                status: newActivity.status
            }]);
        }
        setActivities(prev => [...prev, newActivity]);
    };

    const updateActivityStatus = async (activityId: string, status: ActivityStatus) => {
        const act = activities.find(a => a.id === activityId);
        if (!act) return;

        if (dbStatus === 'connected' && supabase) {
            await supabase.from('activities').update({ status }).eq('id', activityId);
            if (status === ActivityStatus.APPROVED) {
                await sendNotification(act.userId, `Your ${act.type} was approved! (+${act.points} pts)`);
            }
        }
        setActivities(prev => prev.map(a => a.id === activityId ? { ...a, status } : a));
    };

    const addAnnouncement = async (text: string) => {
        const newAnn: Announcement = { id: `ann${Date.now()}`, text, author: currentUser?.name || 'Admin', createdAt: new Date().toISOString() };
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('announcements').insert([{ id: newAnn.id, text: newAnn.text, author: newAnn.author, created_at: newAnn.createdAt }]);
        }
        setAnnouncements(prev => [newAnn, ...prev]);
    };

    const sendNotification = async (userId: string, text: string) => {
        const newNot: Notification = { id: `not${Date.now()}`, userId, text, createdAt: new Date().toISOString(), read: false };
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('notifications').insert([{ id: newNot.id, user_id: newNot.userId, text: newNot.text, created_at: newNot.createdAt, read: false }]);
        }
        setNotifications(prev => [newNot, ...prev]);
    };

    const updateMember = async (userId: string, name: string, password?: string) => {
        const updates: Partial<User> = { name };
        if (password) updates.password = password;
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('users').update(updates).eq('id', userId);
        }
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    };

    const addMember = async (name: string, password: string) => {
        const newUser: User = { id: `user${Date.now()}`, name, password, role: 'member' };
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('users').insert([newUser]);
        }
        setUsers(prev => [...prev, newUser]);
    };

    const deleteMember = async (userId: string) => {
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('users').delete().eq('id', userId);
        }
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const memberStats = useMemo<MemberStats[]>(() => {
        const approvedActivities = activities.filter(a => a.status === ActivityStatus.APPROVED);
        const stats: MemberStats[] = members.map(member => {
            const mActs = approvedActivities.filter(a => a.userId === member.id);
            const totalPoints = mActs.reduce((sum, act) => sum + act.points, 0);
            return { userId: member.id, name: member.name, totalPoints, activities: mActs, zone: 'red' as const };
        });

        const sorted = stats.sort((a, b) => b.totalPoints - a.totalPoints);
        const count = sorted.length;
        if (count > 0) {
            sorted.forEach((m, idx) => {
                const percentile = (idx + 1) / count;
                if (m.totalPoints === 0) m.zone = 'red';
                else if (percentile <= 0.3) m.zone = 'green';
                else if (percentile <= 0.7) m.zone = 'orange';
                else m.zone = 'red';
            });
        }
        return sorted;
    }, [activities, members]);

    return (
        <ClubDataContext.Provider value={{
            currentUser, login, logout, users, members, activities, announcements, notifications,
            addActivity, updateActivityStatus, updateMember, addMember, deleteMember,
            addAnnouncement, sendNotification, memberStats, loading, dbStatus, dbErrorMessage
        }}>
            {children}
        </ClubDataContext.Provider>
    );
};
