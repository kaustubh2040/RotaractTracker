import React, { createContext, useState, useContext, useMemo } from 'react';
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

export const ClubDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
    const [users, setUsers] = useState<User[]>(USERS);

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
            // Failsafe: prevent admin or self-deletion
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
