import React, { createContext, useState, useContext, useMemo, useEffect, useCallback } from 'react';
import type { User, Activity, MemberStats, Announcement, Notification, AppSettings, PublicEvent, AboutContent, Feedback, EventRegistration, FlagshipEvent, SubEvent, SupportTicket } from '../types';
import { ActivityStatus } from '../types';
import { USERS, INITIAL_ACTIVITIES, BOD_POSITIONS } from '../constants';
import { supabase, isSupabaseConfigured, uploadFile } from '../services/supabase';

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
    registrations: EventRegistration[];
    flagshipEvents: FlagshipEvent[];
    subEvents: SubEvent[];
    supportTickets: SupportTicket[];
    currentPage: 'home' | 'login' | 'dashboard' | 'about' | 'leaderboard' | 'bod-all' | 'contact' | 'flagship' | 'help';
    setCurrentPage: (page: 'home' | 'login' | 'dashboard' | 'about' | 'leaderboard' | 'bod-all' | 'contact' | 'flagship' | 'help') => void;
    updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
    updateAboutContent: (content: AboutContent) => Promise<void>;
    addPublicEvent: (event: Omit<PublicEvent, 'id'>) => Promise<void>;
    updatePublicEvent: (id: string, updates: Partial<PublicEvent>) => Promise<void>;
    deletePublicEvent: (id: string) => Promise<void>;
    addActivity: (activity: Omit<Activity, 'id' | 'status' | 'userName' | 'submittedAt'>) => Promise<void>;
    updateActivityStatus: (activityId: string, status: ActivityStatus) => Promise<void>;
    updateMember: (userId: string, updates: Partial<User>) => Promise<void>;
    addMember: (name: string, password: string) => Promise<void>;
    deleteMember: (userId: string) => Promise<void>;
    addAnnouncement: (text: string) => Promise<void>;
    sendNotification: (userId: string, text: string) => Promise<void>;
    addFeedback: (subject: string, message: string) => Promise<void>;
    replyToFeedback: (feedbackId: string, reply: string) => Promise<void>;
    addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => Promise<void>;
    updateSupportTicketStatus: (ticketId: string, status: 'New' | 'In Progress' | 'Resolved') => Promise<void>;
    registerVisitor: (reg: Omit<EventRegistration, 'id' | 'createdAt'>) => Promise<void>;
    uploadImage: (file: File, folder: 'events' | 'profiles' | 'logos' | 'flagship') => Promise<string | null>;
    addFlagshipEvent: (event: Omit<FlagshipEvent, 'id' | 'createdAt'>) => Promise<void>;
    updateFlagshipEvent: (id: string, updates: Partial<FlagshipEvent>) => Promise<void>;
    deleteFlagshipEvent: (id: string) => Promise<void>;
    addSubEvent: (subEvent: Omit<SubEvent, 'id' | 'createdAt'>) => Promise<void>;
    updateSubEvent: (id: string, updates: Partial<SubEvent>) => Promise<void>;
    deleteSubEvent: (id: string) => Promise<void>;
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
    const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
    const [flagshipEvents, setFlagshipEvents] = useState<FlagshipEvent[]>([]);
    const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
    const [settings, setSettings] = useState<AppSettings>({ clubLogoUrl: '', appName: 'ACTRA', appSubtitle: 'BY ROTARACT CLUB OF RSCOE', aboutGroupImageUrl: '' });
    const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentPage, _setCurrentPage] = useState<'home' | 'login' | 'dashboard' | 'about' | 'leaderboard' | 'bod-all' | 'contact' | 'flagship' | 'help'>('home');
    const [loading, setLoading] = useState(true);
    const [dbStatus, setDbStatus] = useState<'connected' | 'local' | 'error'>('local');

    const setCurrentPage = useCallback((page: 'home' | 'login' | 'dashboard' | 'about' | 'leaderboard' | 'bod-all' | 'contact' | 'flagship' | 'help') => {
        _setCurrentPage(page);
        if (window.history.state?.page !== page) {
            window.history.pushState({ page }, "", "");
        }
    }, []);

    useEffect(() => {
        if (!window.history.state) {
            window.history.replaceState({ page: 'home' }, "", "");
        }
        const handlePopState = (event: PopStateEvent) => {
            if (event.state && event.state.page) {
                _setCurrentPage(event.state.page);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
            
            if (isSupabaseConfigured && supabase) {
                try {
                    const { data: userData } = await supabase.from('users').select('*');
                    if (userData) setUsers(userData.map(u => ({ ...u, id: u.id.toString(), positions: u.positions || [], photoUrl: u.photo_url || '' })));

                    const { data: activityData } = await supabase.from('activities').select('*');
                    if (activityData) setActivities(activityData.map((row: any) => ({
                        id: row.id, userId: row.user_id, userName: row.user_name, type: row.type,
                        description: row.description, date: row.date, submittedAt: row.submitted_at || row.date,
                        points: row.points, status: row.status as ActivityStatus
                    })));

                    const { data: annData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
                    if (annData) setAnnouncements(annData.map(a => ({ id: a.id, text: a.text, author: a.author, createdAt: a.created_at })));

                    const { data: fbData } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
                    if (fbData) setFeedbacks(fbData.map(f => ({
                        id: f.id, userId: f.user_id, userName: f.user_name, subject: f.subject,
                        message: f.message, reply: f.reply, createdAt: f.created_at
                    })));

                    const { data: notData } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
                    if (notData) setNotifications(notData.map(n => ({
                        id: n.id, userId: n.user_id, text: n.text, createdAt: n.created_at, read: n.read
                    })));

                    const { data: eventData } = await supabase.from('public_events').select('*').order('date', { ascending: false });
                    if (eventData) setPublicEvents(eventData.map(e => ({
                        id: e.id, title: e.title, description: e.description, imageUrl: e.image_url, 
                        date: e.date, venue: e.venue, category: e.category || 'General', 
                        hostClub: e.host_club || 'Rotaract club of RSCOE', registrationEnabled: e.registration_enabled, isUpcoming: e.is_upcoming
                    })));

                    const { data: regData } = await supabase.from('event_registrations').select('*');
                    if (regData) setRegistrations(regData.map(r => ({
                        id: r.id, eventId: r.event_id, eventTitle: r.event_title, eventDate: r.event_date, 
                        name: r.name, email: r.email, phone: r.phone, createdAt: r.created_at
                    })));

                    const { data: fsData } = await supabase.from('flagship_events').select('*');
                    if (fsData) setFlagshipEvents(fsData.map(f => ({
                        id: f.id, name: f.name, flyerUrl: f.flyer_url, description: f.description, 
                        dateRange: f.date_range, isActive: f.is_active, createdAt: f.created_at
                    })));

                    const { data: subData } = await supabase.from('subevents').select('*');
                    if (subData) setSubEvents(subData.map(s => ({
                        id: s.id, flagshipEventId: s.flagship_event_id, name: s.name, flyerUrl: s.flyer_url,
                        description: s.description, date: s.date, registrationFee: s.registration_fee,
                        googleFormUrl: s.google_form_url, rulebookUrl: s.rulebook_url, createdAt: s.created_at
                    })));

                    const { data: settingsData } = await supabase.from('settings').select('*');
                    if (settingsData) {
                        const sMap: Record<string, any> = {};
                        settingsData.forEach(row => sMap[row.key] = row.value);
                        setSettings(prev => ({
                            ...prev,
                            appName: sMap.app_name || prev.appName,
                            appSubtitle: sMap.app_subtitle || prev.appSubtitle,
                            clubLogoUrl: sMap.club_logo_url || prev.clubLogoUrl,
                            aboutGroupImageUrl: sMap.about_group_image_url || prev.aboutGroupImageUrl
                        }));
                        if (sMap.about_content) try { setAboutContent(JSON.parse(sMap.about_content)); } catch (e) {}
                    }

                    try {
                        const { data: ticketData } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
                        if (ticketData) {
                            setSupportTickets(ticketData.map(t => ({
                                id: t.id,
                                name: t.name,
                                email: t.email,
                                subject: t.subject,
                                message: t.message,
                                status: t.status as 'New' | 'In Progress' | 'Resolved',
                                createdAt: t.created_at
                            })));
                        }
                    } catch (ticketError) {
                        console.warn("Support tickets table not loaded yet, or not accessible:", ticketError);
                        const localTickets = localStorage.getItem('actra_support_tickets_fallback');
                        if (localTickets) {
                            try { setSupportTickets(JSON.parse(localTickets)); } catch (_) {}
                        }
                    }

                    setDbStatus('connected');
                    if (savedSession) {
                        const parsed = JSON.parse(savedSession);
                        const user = (userData || []).find((u: any) => u.id.toString() === parsed.id.toString());
                        if (user) setCurrentUser({ ...user, id: user.id.toString(), positions: user.positions || [], photoUrl: user.photo_url || '' });
                    }
                } catch (e) {
                    setDbStatus('error');
                }
            }
            setLoading(false);
        };
        init();
    }, [setCurrentPage]);

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
                let dbKey = '';
                if (key === 'clubLogoUrl') dbKey = 'club_logo_url';
                else if (key === 'appName') dbKey = 'app_name';
                else if (key === 'appSubtitle') dbKey = 'app_subtitle';
                else if (key === 'aboutGroupImageUrl') dbKey = 'about_group_image_url';
                if (dbKey) await supabase.from('settings').upsert({ key: dbKey, value });
            }
        }
    };

    const updateAboutContent = async (content: AboutContent) => {
        setAboutContent(content);
        if (dbStatus === 'connected' && supabase) await supabase.from('settings').upsert({ key: 'about_content', value: JSON.stringify(content) });
    };

    const uploadImage = async (file: File, folder: 'events' | 'profiles' | 'logos' | 'flagship'): Promise<string | null> => {
        return await uploadFile(file, folder);
    };

    const addFlagshipEvent = async (event: Omit<FlagshipEvent, 'id' | 'createdAt'>) => {
        if (dbStatus === 'connected' && supabase) {
            const { data } = await supabase.from('flagship_events').insert([{
                name: event.name, flyer_url: event.flyerUrl, description: event.description,
                date_range: event.dateRange, is_active: event.isActive
            }]).select();
            if (data) setFlagshipEvents(prev => [...prev, { ...event, id: data[0].id, createdAt: data[0].created_at }]);
        }
    };

    const updateFlagshipEvent = async (id: string, updates: Partial<FlagshipEvent>) => {
        if (dbStatus === 'connected' && supabase) {
            const dbUpdates: any = {};
            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.flyerUrl !== undefined) dbUpdates.flyer_url = updates.flyerUrl;
            if (updates.description !== undefined) dbUpdates.description = updates.description;
            if (updates.dateRange !== undefined) dbUpdates.date_range = updates.dateRange;
            if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
            await supabase.from('flagship_events').update(dbUpdates).eq('id', id);
        }
        setFlagshipEvents(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const deleteFlagshipEvent = async (id: string) => {
        if (dbStatus === 'connected' && supabase) await supabase.from('flagship_events').delete().eq('id', id);
        setFlagshipEvents(prev => prev.filter(f => f.id !== id));
    };

    const addSubEvent = async (subEvent: Omit<SubEvent, 'id' | 'createdAt'>) => {
        if (dbStatus === 'connected' && supabase) {
            const { data } = await supabase.from('subevents').insert([{
                flagship_event_id: subEvent.flagshipEventId, name: subEvent.name, flyer_url: subEvent.flyerUrl,
                description: subEvent.description, date: subEvent.date, registration_fee: subEvent.registrationFee,
                google_form_url: subEvent.googleFormUrl, rulebook_url: subEvent.rulebookUrl
            }]).select();
            if (data) setSubEvents(prev => [...prev, { ...subEvent, id: data[0].id, createdAt: data[0].created_at }]);
        }
    };

    const updateSubEvent = async (id: string, updates: Partial<SubEvent>) => {
        if (dbStatus === 'connected' && supabase) {
            const dbUpdates: any = {};
            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.flyerUrl !== undefined) dbUpdates.flyer_url = updates.flyerUrl;
            if (updates.description !== undefined) dbUpdates.description = updates.description;
            if (updates.date !== undefined) dbUpdates.date = updates.date;
            if (updates.registrationFee !== undefined) dbUpdates.registration_fee = updates.registrationFee;
            if (updates.googleFormUrl !== undefined) dbUpdates.google_form_url = updates.googleFormUrl;
            if (updates.rulebookUrl !== undefined) dbUpdates.rulebook_url = updates.rulebookUrl;
            await supabase.from('subevents').update(dbUpdates).eq('id', id);
        }
        setSubEvents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const deleteSubEvent = async (id: string) => {
        if (dbStatus === 'connected' && supabase) await supabase.from('subevents').delete().eq('id', id);
        setSubEvents(prev => prev.filter(s => s.id !== id));
    };

    const addPublicEvent = async (event: Omit<PublicEvent, 'id'>) => {
        const newEvent = { ...event, id: `evt${Date.now()}` };
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('public_events').insert([{
                id: newEvent.id, title: newEvent.title, description: newEvent.description, 
                image_url: newEvent.imageUrl, date: newEvent.date, venue: newEvent.venue, category: newEvent.category, host_club: newEvent.hostClub, registration_enabled: newEvent.registrationEnabled, is_upcoming: newEvent.isUpcoming
            }]);
        }
        setPublicEvents(prev => [newEvent, ...prev]);
    };

    const deletePublicEvent = async (id: string) => {
        if (dbStatus === 'connected' && supabase) await supabase.from('public_events').delete().eq('id', id);
        setPublicEvents(prev => prev.filter(e => e.id !== id));
    };

    const updatePublicEvent = async (id: string, updates: Partial<PublicEvent>) => {
        if (dbStatus === 'connected' && supabase) {
            const dbUpdates: any = {
                title: updates.title, description: updates.description, image_url: updates.imageUrl,
                date: updates.date, venue: updates.venue, category: updates.category,
                host_club: updates.hostClub, registration_enabled: updates.registrationEnabled, is_upcoming: updates.isUpcoming
            };
            Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);
            await supabase.from('public_events').update(dbUpdates).eq('id', id);
        }
        setPublicEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
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
            await sendNotification(act.userId, `Log ${status}: ${act.type}.`);
        }
        setActivities(prev => prev.map(a => a.id === activityId ? { ...a, status } : a));
    };

    const updateMember = async (userId: string, updates: Partial<User>) => {
        if (dbStatus === 'connected' && supabase) {
            const dbUpdates: any = {};
            if (updates.name) dbUpdates.name = updates.name;
            if (updates.password) dbUpdates.password = updates.password;
            if (updates.positions) dbUpdates.positions = updates.positions;
            if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl;
            await supabase.from('users').update(dbUpdates).eq('id', userId);
        }
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    };

    const addMember = async (name: string, password: string) => {
        const newUser: User = { id: `user${Date.now()}`, name, role: 'member', password, positions: [], photoUrl: '' };
        if (dbStatus === 'connected' && supabase) {
            await supabase.from('users').insert([{ id: newUser.id, name: newUser.name, role: newUser.role, password: newUser.password, positions: newUser.positions, photo_url: newUser.photoUrl }]);
        }
        setUsers(prev => [...prev, newUser]);
    };

    const deleteMember = async (userId: string) => {
        if (dbStatus === 'connected' && supabase) await supabase.from('users').delete().eq('id', userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const addAnnouncement = async (text: string) => {
        const newAnn: Announcement = { id: `ann${Date.now()}`, text, author: currentUser?.name || 'Admin', createdAt: new Date().toISOString() };
        if (dbStatus === 'connected' && supabase) await supabase.from('announcements').insert([{ id: newAnn.id, text: newAnn.text, author: newAnn.author, created_at: newAnn.createdAt }]);
        setAnnouncements(prev => [newAnn, ...prev]);
    };

    const sendNotification = async (userId: string, text: string) => {
        const newNot: Notification = { id: `not${Date.now()}`, userId, text, createdAt: new Date().toISOString(), read: false };
        if (dbStatus === 'connected' && supabase) await supabase.from('notifications').insert([{ id: newNot.id, user_id: newNot.userId, text: newNot.text, created_at: newNot.createdAt, read: false }]);
        setNotifications(prev => [newNot, ...prev]);
    };

    const addFeedback = async (subject: string, message: string) => {
        if (!currentUser) return;
        const newFb: Feedback = { id: `fb${Date.now()}`, userId: currentUser.id, userName: currentUser.name, subject, message, createdAt: new Date().toISOString() };
        if (dbStatus === 'connected' && supabase) await supabase.from('feedbacks').insert([{ id: newFb.id, user_id: newFb.userId, user_name: newFb.userName, subject: newFb.subject, message: newFb.message, created_at: newFb.createdAt }]);
        setFeedbacks(prev => [newFb, ...prev]);
    };

    const replyToFeedback = async (feedbackId: string, reply: string) => {
        if (dbStatus === 'connected' && supabase) await supabase.from('feedbacks').update({ reply }).eq('id', feedbackId);
        setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, reply } : f));
    };

    const addSupportTicket = async (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
        const newTicket: SupportTicket = {
            id: `sup${Date.now()}`,
            name: ticket.name,
            email: ticket.email,
            subject: ticket.subject,
            message: ticket.message,
            status: 'New',
            createdAt: new Date().toISOString()
        };
        
        if (dbStatus === 'connected' && supabase) {
            try {
                await supabase.from('support_tickets').insert([{
                    id: newTicket.id,
                    name: newTicket.name,
                    email: newTicket.email,
                    subject: newTicket.subject,
                    message: newTicket.message,
                    status: newTicket.status,
                    created_at: newTicket.createdAt
                }]);
            } catch (err) {
                console.error("Failed to insert into supabase support_tickets:", err);
            }
        }
        
        setSupportTickets(prev => {
            const updated = [newTicket, ...prev];
            localStorage.setItem('actra_support_tickets_fallback', JSON.stringify(updated));
            return updated;
        });
    };

    const updateSupportTicketStatus = async (ticketId: string, status: 'New' | 'In Progress' | 'Resolved') => {
        if (dbStatus === 'connected' && supabase) {
            try {
                await supabase.from('support_tickets').update({ status }).eq('id', ticketId);
            } catch (err) {
                console.error("Failed to update status in supabase support_tickets:", err);
            }
        }
        
        setSupportTickets(prev => {
            const updated = prev.map(t => t.id === ticketId ? { ...t, status } : t);
            localStorage.setItem('actra_support_tickets_fallback', JSON.stringify(updated));
            return updated;
        });
    };

    const registerVisitor = async (reg: Omit<EventRegistration, 'id' | 'createdAt'>) => {
        const newReg = { ...reg, id: `reg${Date.now()}`, createdAt: new Date().toISOString() };
        if (dbStatus === 'connected' && supabase) await supabase.from('event_registrations').insert([{ id: newReg.id, event_id: newReg.eventId, event_title: newReg.eventTitle, event_date: newReg.eventDate, name: newReg.name, email: newReg.email, phone: newReg.phone, created_at: newReg.createdAt }]);
        setRegistrations(prev => [...prev, newReg]);
    };

    const memberStats = useMemo<MemberStats[]>(() => {
        const members = users.filter(u => u.role === 'member');
        const approved = activities.filter(a => a.status === ActivityStatus.APPROVED);
        return members.map(m => {
            const mActs = approved.filter(a => a.userId === m.id);
            return { userId: m.id, name: m.name, totalPoints: mActs.reduce((s, a) => s + a.points, 0), activities: mActs };
        }).sort((a,b) => b.totalPoints - a.totalPoints);
    }, [activities, users]);

    return (
        <ClubDataContext.Provider value={{
            currentUser, login, logout, users, members: users.filter(u => u.role === 'member'), activities, 
            announcements, notifications, feedbacks, settings, aboutContent, publicEvents, registrations, flagshipEvents, subEvents, supportTickets, currentPage, setCurrentPage,
            updateSettings, updateAboutContent, addPublicEvent, updatePublicEvent, deletePublicEvent,
            addActivity, updateActivityStatus, updateMember, addMember, deleteMember,
            addAnnouncement, sendNotification, addFeedback, replyToFeedback, addSupportTicket, updateSupportTicketStatus, registerVisitor, uploadImage,
            addFlagshipEvent, updateFlagshipEvent, deleteFlagshipEvent, addSubEvent, updateSubEvent, deleteSubEvent,
            memberStats, loading, dbStatus
        }}>
            {children}
        </ClubDataContext.Provider>
    );
};