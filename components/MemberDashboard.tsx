
import React, { useState } from 'react';
import ActivityForm from './ActivityForm';
import Leaderboard from './Leaderboard';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';
import { ActivityStatus } from '../types';

const MemberDashboard: React.FC = () => {
    const { currentUser, activities, memberStats, announcements, notifications } = useClubData();
    const [activeTab, setActiveTab] = useState<'home' | 'report' | 'history' | 'stats'>('home');

    if (!currentUser) return null;

    const myStats = memberStats.find(m => m.userId === currentUser.id);
    const myActivities = activities.filter(a => a.userId === currentUser.id).sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    const myNotifications = notifications.filter(n => n.userId === currentUser.id);

    const zoneColorClasses = {
        green: 'bg-green-500/20 text-green-300 border-green-500/30',
        orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        red: 'bg-red-500/20 text-red-300 border-red-500/30'
    };

    const statusBadge = (status: ActivityStatus) => {
        const colors = {
            [ActivityStatus.APPROVED]: 'bg-green-500/10 text-green-400 border-green-500/20',
            [ActivityStatus.PENDING]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            [ActivityStatus.REJECTED]: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${colors[status]}`}>{status}</span>;
    };

    const navItems = [
        { id: 'home', label: 'Overview', icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
        { id: 'report', label: 'Log Activity', icon: <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { id: 'history', label: 'My Status', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
        { id: 'stats', label: 'Standings', icon: <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)]">
            {/* Side Navigation */}
            <aside className="w-full md:w-64 bg-gray-800/50 rounded-2xl p-4 mb-6 md:mb-0 md:mr-6 border border-gray-700 h-fit">
                <nav className="space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                                activeTab === item.id 
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' 
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {item.icon}
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 space-y-6">
                {activeTab === 'home' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
                        <div className="space-y-6">
                            {/* Personal Summary Card */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-xl">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Your Impact</h3>
                                        <p className="text-4xl font-black text-white mt-1">{myStats?.totalPoints ?? 0} <span className="text-sm font-normal text-gray-500 uppercase">Points</span></p>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${zoneColorClasses[myStats?.zone ?? 'red']}`}>
                                        {myStats?.zone ?? 'RED'} ZONE
                                    </div>
                                </div>
                            </div>

                            {/* Announcements Section */}
                            <Card title="Club Announcements">
                                <div className="space-y-4">
                                    {announcements.length > 0 ? announcements.map(ann => (
                                        <div key={ann.id} className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-xl">
                                            <p className="text-sm text-gray-200 leading-relaxed italic">"{ann.text}"</p>
                                            <div className="mt-3 flex items-center justify-between opacity-60">
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">President's Memo</span>
                                                <span className="text-[10px]">{new Date(ann.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-gray-500 italic text-center py-4">No recent announcements</p>
                                    )}
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-6">
                             {/* Notifications Section */}
                             <Card title="Alerts & Notifications">
                                <div className="space-y-2">
                                    {myNotifications.length > 0 ? myNotifications.slice(0, 5).map(not => (
                                        <div key={not.id} className="p-3 bg-gray-700/30 rounded-lg flex items-start space-x-3">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-teal-400 shrink-0"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-300">{not.text}</p>
                                                <span className="text-[10px] text-gray-500">{new Date(not.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-gray-500 italic text-center py-4">Everything is quiet</p>
                                    )}
                                </div>
                            </Card>

                            {/* Recent Activity Snapshot */}
                            <Card title="Latest Updates">
                                <div className="space-y-3">
                                    {myActivities.slice(0, 3).map(act => (
                                        <div key={act.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl border border-gray-700/50">
                                            <div>
                                                <p className="text-sm font-bold text-white">{act.type}</p>
                                                <p className="text-[11px] text-gray-400">{new Date(act.date).toLocaleDateString()}</p>
                                            </div>
                                            {statusBadge(act.status)}
                                        </div>
                                    ))}
                                    {myActivities.length === 0 && <p className="text-center py-4 text-gray-500 text-sm">No activity history yet.</p>}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'report' && <div className="animate-fadeIn max-w-2xl mx-auto"><ActivityForm /></div>}

                {activeTab === 'history' && (
                    <Card title="Submission Status History" className="animate-fadeIn">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs uppercase text-gray-500 border-b border-gray-700">
                                    <tr>
                                        <th className="pb-3 font-bold">Activity</th>
                                        <th className="pb-3 font-bold">Event Date</th>
                                        <th className="pb-3 font-bold">Points</th>
                                        <th className="pb-3 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {myActivities.map(act => (
                                        <tr key={act.id} className="group hover:bg-gray-700/20">
                                            <td className="py-4">
                                                <p className="text-sm font-semibold text-white">{act.type}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-xs">{act.description}</p>
                                            </td>
                                            <td className="py-4 text-sm text-gray-400">{new Date(act.date).toLocaleDateString()}</td>
                                            <td className="py-4 text-sm font-bold text-teal-400">+{act.points}</td>
                                            <td className="py-4">{statusBadge(act.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {myActivities.length === 0 && <p className="text-center py-12 text-gray-500 italic">No reports found.</p>}
                        </div>
                    </Card>
                )}

                {activeTab === 'stats' && <div className="animate-fadeIn"><Leaderboard /></div>}
            </div>
            
            {/* Application Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 text-center text-xs text-gray-500 z-40 hidden md:block">
                &copy; 2025 &bull; Built by <span className="text-teal-400 font-semibold">Kaustubh Patil</span> &bull; All rights reserved
            </footer>
        </div>
    );
};

export default MemberDashboard;
