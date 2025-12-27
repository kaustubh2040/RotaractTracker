
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import type { User, Activity, MemberStats } from '../types';
import { ActivityStatus } from '../types';
import { USERS, INITIAL_ACTIVITIES } from '../constants';

interface ClubDataContextType {
    currentUser: User | null;
    login: (userId: string, password: string) => boolean;
    logout: () => void;
    users: User[];
    members: User[];
    activities: Activity[];
    addActivity: (activity: Omit<Activity, 'id' | 'status' | 'userName'>) => void;
    updateActivityStatus: (activityId: string, status: ActivityStatus) => void;
    updateMember: (userId: string, name: string, password?: string) => void;
    addMember: (name: string, password: string) => void;
    deleteMember: (userId: string) => void;
    memberStats: MemberStats[];
}

export const ClubDataContext = createContext<ClubDataContextType>({} as ClubDataContextType);

export const useClubData = () => {
    return useContext(ClubDataContext);
};

// Storage Keys
const STORAGE_KEY_USERS = 'rotaract_tracker_users';
const STORAGE_KEY_ACTIVITIES = 'rotaract_tracker_activities';

export const ClubDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Lazy initialization from LocalStorage
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_USERS);
        return saved ? JSON.parse(saved) : USERS;
    });

    const [activities, setActivities] = useState<Activity[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
        return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    });

    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Persist data whenever it changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
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

    const logout = () => {
        setCurrentUser(null);
    };

    const addActivity = (activity: Omit<Activity, 'id' | 'status' | 'userName'>) => {
        const user = users.find(u => u.id === activity.userId);
        if (!user) return;

        const newActivity: Activity = {
            ...activity,
            id: `act${Date.now()}`,
            status: ActivityStatus.PENDING,
            userName: user.name,
        };
        setActivities(prev => [...prev, newActivity]);
    };

    const updateActivityStatus = (activityId: string, status: ActivityStatus) => {
        setActivities(prev =>
            prev.map(act =>
                act.id === activityId ? { ...act, status } : act
            )
        );
    };
    
    const updateMember = (userId: string, name: string, password?: string) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === userId) {
                const updatedUser: User = { ...user, name };
                if (password) {
                    updatedUser.password = password;
                }
                
                if (currentUser && currentUser.id === userId) {
                    setCurrentUser(updatedUser);
                }

                return updatedUser;
            }
            return user;
        }));

        setActivities(prevActivities => prevActivities.map(activity => {
            if (activity.userId === userId) {
                return { ...activity, userName: name };
            }
            return activity;
        }));
    };
    
    const addMember = (name: string, password: string) => {
        const newUser: User = {
            id: `user${Date.now()}`,
            name,
            password,
            role: 'member',
        };
        setUsers(prev => [...prev, newUser]);
    };

    const deleteMember = (userId: string) => {
        if (userId === 'admin' || userId === currentUser?.id) {
            return;
        }
        setUsers(prev => prev.filter(user => user.id !== userId));
        setActivities(prev => prev.filter(activity => activity.userId !== userId));
    };

    const memberStats = useMemo<MemberStats[]>(() => {
        const approvedActivities = activities.filter(a => a.status === ActivityStatus.APPROVED);
        
        const stats = members.map(member => {
            const memberActivities = approvedActivities.filter(a => a.userId === member.id);
            const totalPoints = memberActivities.reduce((sum, act) => sum + act.points, 0);
            return {
                userId: member.id,
                name: member.name,
                totalPoints,
                activities: memberActivities,
                zone: 'red' as 'red' | 'yellow' | 'green',
            };
        });

        const maxPoints = Math.max(...stats.map(s => s.totalPoints), 0);

        stats.forEach(member => {
            if (maxPoints > 0) {
                const percentage = (member.totalPoints / maxPoints) * 100;
                if (percentage >= 70) {
                    member.zone = 'green';
                } else if (percentage >= 30) {
                    member.zone = 'yellow';
                } else {
                    member.zone = 'red';
                }
            } else {
                 member.zone = 'red';
            }
        });

        return stats.sort((a, b) => b.totalPoints - a.totalPoints);
    }, [activities, members]);

    const value = {
        currentUser,
        login,
        logout,
        users,
        members,
        activities,
        addActivity,
        updateActivityStatus,
        updateMember,
        addMember,
        deleteMember,
        memberStats,
    };

    return (
        <ClubDataContext.Provider value={value}>
            {children}
        </ClubDataContext.Provider>
    );
};
