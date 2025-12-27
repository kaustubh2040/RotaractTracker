
import React from 'react';
import PendingApprovals from './PendingApprovals';
import Leaderboard from './Leaderboard';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ActivityType } from '../types';
import MemberManagement from './MemberManagement';

const AdminDashboard: React.FC = () => {
    const { memberStats, activities, dbStatus, dbErrorMessage } = useClubData();
    
    const chartData = Object.values(ActivityType).map(type => ({
        name: type,
        count: activities.filter(a => a.type === type).length,
    }));

    return (
        <div className="space-y-6">
            {/* Database Status Indicator */}
            <div className="flex justify-end">
                {dbStatus === 'connected' ? (
                    <div className="flex items-center bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-xs text-green-400 font-medium italic">Cloud Database Connected</span>
                    </div>
                ) : dbStatus === 'error' ? (
                    <div className="flex flex-col items-end">
                        <div className="flex items-center bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-rose-500 rounded-full mr-2 animate-pulse"></span>
                            <span className="text-xs text-rose-400 font-medium italic">Sync Error: Using Local Storage</span>
                        </div>
                        {dbErrorMessage && <span className="text-[10px] text-rose-500 mt-1 max-w-xs text-right">{dbErrorMessage}</span>}
                    </div>
                ) : (
                    <div className="flex items-center bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                        <span className="text-xs text-yellow-400 font-medium italic">Local Storage Only (No Cloud Setup)</span>
                    </div>
                )}
            </div>

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
