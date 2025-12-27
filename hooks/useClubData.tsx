
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import type { User, Activity, MemberStats, Announcement, Notification, AppSettings, PublicEvent, AboutContent, Feedback } from '../types';
import { ActivityStatus } from '../types';
import { USERS, INITIAL_ACTIVITIES } from '../constants';
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
    feedbacks: Feedback[];
    settings: AppSettings;
    aboutContent: AboutContent;
    publicEvents: PublicEvent[];
    currentPage: 'home' | 'login' | 'dashboard' | 'about' | 'leaderboard';
    setCurrentPage: (page: 'home' | 'login' | 'dashboard' | 'about' | 'leaderboard') => void;
    updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
    updateAboutContent: (content: AboutContent) => Promise<void>;
    addPublicEvent: (event: Omit<PublicEvent, 'id'>) => Promise<void>;
    deletePublicEvent: (id: string) => Promise<void>;
    addActivity: (activity: Omit<Activity, 'id' | 'status' | 'userName' | 'submittedAt'>) => Promise<void>;
    updateActivityStatus: (activityId: string, status: ActivityStatus) => Promise<void>;
    updateMember: (userId: string, name: string, password?: string) => Promise<void>;
    addMember: (name: string, password: string) => Promise<void>;
    deleteMember: (userId: string) => Promise<void>;
    addAnnouncement: (text: string) => Promise<void>;
    sendNotification: (userId: string, text: string) => Promise<void>;
    addFeedback: (subject: string, message: string) => Promise<void>;
    replyToFeedback: (feedbackId: string, reply: string) => Promise<void>;
    memberStats: MemberStats[];
    loading: boolean;
    dbStatus: 'connected' | 'local' | 'error';
}

export const ClubDataContext = createContext<ClubDataContextType>({} as ClubDataContextType);

export const useClubData = () => useContext(ClubDataContext);

const STORAGE_SESSION_KEY = 'actra_user_session';

const DEFAULT_ABOUT: AboutContent = {
    intro: 'The Rotaract Club of RSCOE is a community of young leaders dedicated to service and professional development.',
    vision: 'To be a beacon of positive change in our local and global community.',
    mission: 'To provide opportunities for young people to address the physical and social needs of their communities while promoting international understanding and peace.',
    values: 'Fellowship, Service, Leadership, Integrity.'
};

export const ClubDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [publicEvents, setPublicEvents] = useState<PublicEvent[]>([]);
    const [settings, setSettings] = useState<AppSettings>({ clubLogoUrl: '', appName: 'Actra', appSubtitle: 'by Rotaract Club of RSCOE' });
    const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'dashboard' | 'about' | 'leaderboard'>('home');
    const [loading, setLoading] = useState(true);
    const [dbStatus, setDbStatus] = useState<'connected' | 'local' | 'error'>('local');

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
            
            if (isSupabaseConfigured && supabase) {
                try {
                    const { data: userData } = await supabase.from('users').select('*');
                    if (userData && userData.length > 0) setUsers(userData);
                    else { await supabase.from('users').upsert(USERS); setUsers(USERS); }

                    const { data: activityData } = await supabase.from('activities').select('*');
                    if (activityData) setActivities(activityData.map((row: any) => ({
                        id: row.id, userId: row.user_id, userName: row.user_name, type: row.type,
                        description: row.description, date: row.date, submittedAt: row.submitted_at || row.date,
                        points: row.points, status: row.status as ActivityStatus
                    })));

                    const { data: annData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
                    if (annData) setAnnouncements(annData.map(a => ({ id: a.id, text: a.text, author: a.author, createdAt: a.created_at })));

                    const { data: notData } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
                    if (notData) setNotifications(notData.map(n => ({ id: n.id, userId: n.user_id, text: n.text, createdAt: n.created_at, read: n.read })));

                    const { data: fbData } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
                    if (fbData) setFeedbacks(fbData.map(f => ({
                        id: f.id, userId: f.user_id, userName: f.user_name, subject: f.subject,
                        message: f.message, reply: f.reply, createdAt: f.created_at
                    })));

                    const { data: settingsData } = await supabase.from('settings').select('*');
                    if (settingsData) {
                        const newSettings = { ...settings };
                        settingsData.forEach(s => {
                            if (s.key === 'club_logo_url') newSettings.clubLogoUrl = s.value;
                            if (s.key === 'app_name') newSettings.appName = s.value;
                            if (s.key === 'app_subtitle') newSettings.appSubtitle = s.value;
                            if (s.key === 'about_content') setAboutContent(JSON.parse(s.value));
                        });
                        setSettings(newSettings);
                    }

                    const { data: eventData } = await supabase.from('public_events').select('*').order('date', { ascending: false });
                    if (eventData) setPublicEvents(eventData.map(e => ({
                        id: e.id, title: e.title, description: e.description, imageUrl: e.image_url, date: e.date, isUpcoming: e.is_upcoming
                    })));

                    setDbStatus('connected');
                    if (savedSession) {
                        const parsed = JSON.parse(savedSession);
                        const user = userData?.find((u: any) => u.id === parsed.id);
                        if (user) { setCurrentUser(user); setCurrentPage('dashboard'); }
                    }
                } catch (e) {
                    setDbStatus('error');
                }
            } else {
                setDbStatus('local');
                setUsers(USERS);
                setActivities(INITIAL_ACTIVITIES);
            }
            setLoading(false);
        };
        init();
    }, []);

    const login = (userId: string, password: string): boolean => {
        const user = users.find(u => u.id === userId);
        if (user && user.password === password) {
            setCurrentUser(user);
            localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({ id: user.id }));
            setCurrentPage('dashboard');
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem(STORAGE_SESSION_KEY);
        setCurrentPage('home');
    };

    const updateSettings = async (newSettings: Partial<AppSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
        if (dbStatus === 'connected' && supabase) {
            for (const [key, value] of Object.entries(newSettings)) {
                let dbKey = key;
                if (key === 'clubLogoUrl') dbKey = 'club_logo_url';
                else if (key === 'appName') dbKey = 'app_name';
                else if (key === 'appSubtitle') dbKey = 'app_subtitle';
                await supabase.from('settings').upsert({ key: dbKey, value });
            }
        }
    };

    const updateAboutContent = async (content: AboutContent) => {
        setAboutContent(content);
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('settings').upsert({ key: 'about_content', value: JSON.stringify(content) });
        }
    };

    const addPublicEvent = async (event: Omit<PublicEvent, 'id'>) => {
        const newEvent = { ...event, id: `evt${Date.now()}` };
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('public_events').insert([{
                id: newEvent.id, title: newEvent.title, description: newEvent.description, 
                image_url: newEvent.imageUrl, date: newEvent.date, is_upcoming: newEvent.isUpcoming
            }]);
        }
        setPublicEvents(prev => [newEvent, ...prev]);
    };

    const deletePublicEvent = async (id: string) => {
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('public_events').delete().eq('id', id);
        }
        setPublicEvents(prev => prev.filter(e => e.id !== id));
    };

    const addActivity = async (activity: Omit<Activity, 'id' | 'status' | 'userName' | 'submittedAt'>) => {
        const user = users.find(u => u.id === activity.userId);
        if (!user) return;
        const newAct: Activity = { ...activity, id: `act${Date.now()}`, status: ActivityStatus.PENDING, userName: user.name, submittedAt: new Date().toISOString() };
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('activities').insert([{
                id: newAct.id, user_id: newAct.userId, user_name: newAct.userName, type: newAct.type,
                description: newAct.description, date: newAct.date, submitted_at: newAct.submittedAt,
                points: newAct.points, status: newAct.status
            }]);
        }
        setActivities(prev => [...prev, newAct]);
    };

    const updateActivityStatus = async (activityId: string, status: ActivityStatus) => {
        const act = activities.find(a => a.id === activityId);
        if (!act) return;
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('activities').update({ status }).eq('id', activityId);
            const msg = status === ActivityStatus.APPROVED 
                ? `Your ${act.type} log was approved! +${act.points} pts added.`
                : `Your ${act.type} log was reviewed and rejected. Contact admin for details.`;
            await sendNotification(act.userId, msg);
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

    const addFeedback = async (subject: string, message: string) => {
        if (!currentUser) return;
        const newFb: Feedback = { id: `fb${Date.now()}`, userId: currentUser.id, userName: currentUser.name, subject, message, createdAt: new Date().toISOString() };
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('feedbacks').insert([{ id: newFb.id, user_id: newFb.userId, user_name: newFb.userName, subject: newFb.subject, message: newFb.message, created_at: newFb.createdAt }]);
        }
        setFeedbacks(prev => [newFb, ...prev]);
    };

    const replyToFeedback = async (feedbackId: string, reply: string) => {
        const fb = feedbacks.find(f => f.id === feedbackId);
        if (!fb) return;
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('feedbacks').update({ reply }).eq('id', feedbackId);
            await sendNotification(fb.userId, `New reply from President regarding your feedback: "${fb.subject}"`);
        }
        setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, reply } : f));
    };

    const updateMember = async (userId: string, name: string, password?: string) => {
        const updates: any = { name };
        if (password) updates.password = password;
        if (dbStatus === 'connected' && supabase) await supabase.from('users').update(updates).eq('id', userId);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    };

    const addMember = async (name: string, password: string) => {
        const newUser: User = { id: `user${Date.now()}`, name, password, role: 'member' };
        if (dbStatus === 'connected' && supabase) await supabase.from('users').insert([newUser]);
        setUsers(prev => [...prev, newUser]);
    };

    const deleteMember = async (userId: string) => {
        if (dbStatus === 'connected' && supabase) await supabase.from('users').delete().eq('id', userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const memberStats = useMemo<MemberStats[]>(() => {
        const members = users.filter(u => u.role === 'member');
        const approved = activities.filter(a => a.status === ActivityStatus.APPROVED);
        const stats: MemberStats[] = members.map(m => {
            const mActs = approved.filter(a => a.userId === m.id);
            const totalPoints = mActs.reduce((s, a) => s + a.points, 0);
            return { userId: m.id, name: m.name, totalPoints, activities: mActs };
        });
        return stats.sort((a,b) => b.totalPoints - a.totalPoints);
    }, [activities, users]);

    return (
        <ClubDataContext.Provider value={{
            currentUser, login, logout, users, members: users.filter(u => u.role === 'member'), activities, 
            announcements, notifications, feedbacks, settings, aboutContent, publicEvents, currentPage, setCurrentPage,
            updateSettings, updateAboutContent, addPublicEvent, deletePublicEvent,
            addActivity, updateActivityStatus, updateMember, addMember, deleteMember,
            addAnnouncement, sendNotification, addFeedback, replyToFeedback, memberStats, loading, dbStatus
        }}>
            {children}
        </ClubDataContext.Provider>
    );
};
