import React from 'react';
import ActivityForm from './ActivityForm';
import Leaderboard from './Leaderboard';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';
import { ActivityStatus } from '../types';

const MyStats: React.FC = () => {
    const { currentUser, activities, memberStats } = useClubData();
    if (!currentUser) return null;

    const myStats = memberStats.find(m => m.userId === currentUser.id);
    const myActivities = activities.filter(a => a.userId === currentUser.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const zoneColorClasses = {
        green: 'bg-green-500/20 text-green-300',
        yellow: 'bg-yellow-400/20 text-yellow-300',
        red: 'bg-red-500/20 text-red-300'
    };

    const statusColorClasses = {
        [ActivityStatus.APPROVED]: 'bg-green-500/20 text-green-300',
        [ActivityStatus.PENDING]: 'bg-yellow-400/20 text-yellow-300',
        [ActivityStatus.REJECTED]: 'bg-red-500/20 text-red-300',
    };

    return (
        <Card title="My Engagement">
            <div className="flex justify-between items-center mb-6 p-4 rounded-lg bg-gray-700/50">
                <div>
                    <p className="text-sm text-gray-400">Total Points</p>
                    <p className="text-3xl font-bold text-teal-400">{myStats?.totalPoints ?? 0}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Current Zone</p>
                    <p className={`text-lg font-bold capitalize px-3 py-1 rounded-full ${zoneColorClasses[myStats?.zone ?? 'red']}`}>{myStats?.zone ?? 'Red'}</p>
                </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-100 mb-2">My Recent Activities</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {myActivities.length > 0 ? myActivities.map(act => (
                    <div key={act.id} className="p-3 bg-gray-700/60 rounded-md flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-100">{act.type}</p>
                            <p className="text-sm text-gray-400">{act.description}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColorClasses[act.status]}`}>
                            {act.status}
                        </span>
                    </div>
                )) : <p>You haven't submitted any activities yet.</p>}
            </div>
        </Card>
    )
}

const MemberDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <ActivityForm />
                <MyStats />
            </div>
            <div className="lg:col-span-1">
                <Leaderboard />
            </div>
        </div>
    );
};

export default MemberDashboard;
