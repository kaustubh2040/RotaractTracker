
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import type { User, Activity, MemberStats } from '../types';
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
    addActivity: (activity: Omit<Activity, 'id' | 'status' | 'userName'>) => Promise<void>;
    updateActivityStatus: (activityId: string, status: ActivityStatus) => Promise<void>;
    updateMember: (userId: string, name: string, password?: string) => Promise<void>;
    addMember: (name: string, password: string) => Promise<void>;
    deleteMember: (userId: string) => Promise<void>;
    memberStats: MemberStats[];
    loading: boolean;
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
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initial Fetch
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            if (isSupabaseConfigured && supabase) {
                try {
                    const { data: userData } = await supabase.from('users').select('*');
                    const { data: activityData } = await supabase.from('activities').select('*');
                    
                    if (userData && userData.length > 0) {
                        setUsers(userData);
                    } else {
                        // Seed Supabase if empty
                        await supabase.from('users').insert(USERS);
                        setUsers(USERS);
                    }

                    if (activityData && activityData.length > 0) {
                        // Map snake_case from DB back to camelCase for the app
                        const mappedActivities: Activity[] = activityData.map((row: any) => ({
                            id: row.id,
                            userId: row.user_id,
                            userName: row.user_name,
                            type: row.type,
                            description: row.description,
                            date: row.date,
                            points: row.points,
                            status: row.status as ActivityStatus
                        }));
                        setActivities(mappedActivities);
                    } else {
                        // Seed activities if empty
                        const dbActivities = INITIAL_ACTIVITIES.map(a => ({
                            id: a.id,
                            user_id: a.userId,
                            user_name: a.userName,
                            type: a.type,
                            description: a.description,
                            date: a.date,
                            points: a.points,
                            status: a.status
                        }));
                        await supabase.from('activities').insert(dbActivities);
                        setActivities(INITIAL_ACTIVITIES);
                    }
                } catch (e) {
                    console.error("Supabase fetch failed, using local", e);
                    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
                    const savedActivities = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
                    setUsers(savedUsers ? JSON.parse(savedUsers) : USERS);
                    setActivities(savedActivities ? JSON.parse(savedActivities) : INITIAL_ACTIVITIES);
                }
            } else {
                // LocalStorage Fallback if no Supabase configured
                const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
                const savedActivities = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
                setUsers(savedUsers ? JSON.parse(savedUsers) : USERS);
                setActivities(savedActivities ? JSON.parse(savedActivities) : INITIAL_ACTIVITIES);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    // Local Storage persistence as secondary backup
    useEffect(() => {
        if (users.length > 0) localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (activities.length > 0) localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
    }, [activities]);

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

    const addActivity = async (activity: Omit<Activity, 'id' | 'status' | 'userName'>) => {
        const user = users.find(u => u.id === activity.userId);
        if (!user) return;

        const newActivity: Activity = {
            ...activity,
            id: `act${Date.now()}`,
            status: ActivityStatus.PENDING,
            userName: user.name,
        };

        if (isSupabaseConfigured && supabase) {
            // Map to snake_case for Supabase
            await supabase.from('activities').insert([{
                id: newActivity.id,
                user_id: newActivity.userId,
                user_name: newActivity.userName,
                type: newActivity.type,
                description: newActivity.description,
                date: newActivity.date,
                points: newActivity.points,
                status: newActivity.status
            }]);
        }
        setActivities(prev => [...prev, newActivity]);
    };

    const updateActivityStatus = async (activityId: string, status: ActivityStatus) => {
        if (isSupabaseConfigured && supabase) {
            await supabase.from('activities').update({ status }).eq('id', activityId);
        }
        setActivities(prev => prev.map(act => act.id === activityId ? { ...act, status } : act));
    };
    
    const updateMember = async (userId: string, name: string, password?: string) => {
        const updates: Partial<User> = { name };
        if (password) updates.password = password;

        if (isSupabaseConfigured && supabase) {
            await supabase.from('users').update(updates).eq('id', userId);
            // Also update names in activities table for consistency in Supabase
            await supabase.from('activities').update({ user_name: name }).eq('user_id', userId);
        }

        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
        setActivities(prev => prev.map(a => a.userId === userId ? { ...a, userName: name } : a));
        
        if (currentUser && currentUser.id === userId) {
            setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
        }
    };
    
    const addMember = async (name: string, password: string) => {
        const newUser: User = { id: `user${Date.now()}`, name, password, role: 'member' };
        if (isSupabaseConfigured && supabase) {
            await supabase.from('users').insert([newUser]);
        }
        setUsers(prev => [...prev, newUser]);
    };

    const deleteMember = async (userId: string) => {
        if (userId === 'admin' || userId === currentUser?.id) return;
        
        if (isSupabaseConfigured && supabase) {
            await supabase.from('users').delete().eq('id', userId);
            await supabase.from('activities').delete().eq('user_id', userId);
        }
        
        setUsers(prev => prev.filter(u => u.id !== userId));
        setActivities(prev => prev.filter(a => a.userId !== userId));
    };

    const memberStats = useMemo<MemberStats[]>(() => {
        const approvedActivities = activities.filter(a => a.status === ActivityStatus.APPROVED);
        const stats: MemberStats[] = members.map(member => {
            const memberActivities = approvedActivities.filter(a => a.userId === member.id);
            const totalPoints = memberActivities.reduce((sum, act) => sum + act.points, 0);
            return {
                userId: member.id,
                name: member.name,
                totalPoints,
                activities: memberActivities,
                zone: 'red',
            };
        });

        const maxPoints = Math.max(...stats.map(s => s.totalPoints), 0);
        stats.forEach(m => {
            if (maxPoints > 0) {
                const p = (m.totalPoints / maxPoints) * 100;
                m.zone = p >= 70 ? 'green' : (p >= 30 ? 'yellow' : 'red');
            }
        });

        return stats.sort((a, b) => b.totalPoints - a.totalPoints);
    }, [activities, members]);

    return (
        <ClubDataContext.Provider value={{
            currentUser, login, logout, users, members, activities,
            addActivity, updateActivityStatus, updateMember, addMember, 
            deleteMember, memberStats, loading
        }}>
            {children}
        </ClubDataContext.Provider>
    );
};
