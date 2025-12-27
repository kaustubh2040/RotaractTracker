import React from 'react';
import PendingApprovals from './PendingApprovals';
import Leaderboard from './Leaderboard';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ActivityType } from '../types';
import MemberManagement from './MemberManagement';

const AdminDashboard: React.FC = () => {
    const { memberStats, activities } = useClubData();
    
    const chartData = Object.values(ActivityType).map(type => ({
        name: type,
        count: activities.filter(a => a.type === type).length,
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-400">Total Members</h3>
                    <p className="text-5xl font-bold text-teal-400">{memberStats.length}</p>
                </div>
                <div className="md:col-span-1 bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-400">Pending Approvals</h3>
                    <p className="text-5xl font-bold text-orange-400">{activities.filter(a => a.status === 'Pending').length}</p>
                </div>
                 <div className="md:col-span-1 bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-400">Total Activities</h3>
                    <p className="text-5xl font-bold text-green-400">{activities.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PendingApprovals />
                </div>
                <div className="lg:col-span-1">
                    <Leaderboard />
                </div>
            </div>
            
            <Card title="Activity Distribution">
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                            <YAxis allowDecimals={false} tick={{fill: '#9ca3af'}} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Legend wrapperStyle={{color: '#d1d5db'}} />
                            <Bar dataKey="count" fill="#2dd4bf" name="Number of Activities" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <MemberManagement />
        </div>
    );
};

export default AdminDashboard;
