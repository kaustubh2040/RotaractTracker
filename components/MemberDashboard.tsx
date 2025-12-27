
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
    const myRank = memberStats.findIndex(m => m.userId === currentUser.id) + 1;
    const myActivities = activities.filter(a => a.userId === currentUser.id).sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    const myNotifications = notifications.filter(n => n.userId === currentUser.id);

    const navItems = [
        { id: 'home', label: 'Dashboard', icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
        { id: 'report', label: 'Report Activity', icon: <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { id: 'history', label: 'My Submissions', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
        { id: 'stats', label: 'Standings', icon: <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)]">
            {/* Sidebar Nav */}
            <aside className="w-full md:w-64 bg-gray-800/50 rounded-2xl p-4 mb-6 md:mb-0 md:mr-6 border border-gray-700 h-fit">
                <nav className="space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                                activeTab === item.id ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">{item.icon}</svg>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Content Area */}
            <div className="flex-1 space-y-6">
                {activeTab === 'home' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
                        <div className="space-y-6">
                            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex justify-between items-center">
                                <div>
                                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Impact</h3>
                                    <p className="text-4xl font-black text-white mt-1">{myStats?.totalPoints ?? 0} <span className="text-sm font-normal text-gray-500">Pts</span></p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Rank</h3>
                                    <p className="text-3xl font-black text-teal-400 mt-1">#{myRank}</p>
                                </div>
                            </div>

                            <Card title="Latest Announcements">
                                {announcements.length > 0 ? (
                                    <div className="space-y-4">
                                        {announcements.slice(0, 3).map(ann => (
                                            <div key={ann.id} className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-xl">
                                                <p className="text-sm text-gray-200 leading-relaxed italic">"{ann.text}"</p>
                                                <div className="mt-2 text-[10px] flex justify-between text-gray-500 font-bold uppercase">
                                                    <span>Presidential Broadcast</span>
                                                    <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-center py-4 text-gray-500 italic">No new club announcements.</p>}
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card title="Alerts & Notifications">
                                <div className="space-y-3">
                                    {myNotifications.length > 0 ? myNotifications.slice(0, 5).map(not => (
                                        <div key={not.id} className="p-3 bg-gray-700/30 rounded-lg flex items-start space-x-3">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-300">{not.text}</p>
                                                <span className="text-[10px] text-gray-500 font-bold">{new Date(not.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    )) : <p className="text-center py-4 text-gray-500 italic">No recent alerts.</p>}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'report' && <div className="animate-fadeIn max-w-2xl mx-auto"><ActivityForm /></div>}

                {activeTab === 'history' && (
                    <Card title="My Reported Activities" className="animate-fadeIn">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] uppercase font-black text-gray-500 border-b border-gray-700">
                                    <tr>
                                        <th className="pb-3">Type</th>
                                        <th className="pb-3">Event Date</th>
                                        <th className="pb-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {myActivities.map(act => (
                                        <tr key={act.id} className="group hover:bg-gray-700/20">
                                            <td className="py-4">
                                                <p className="text-sm font-bold text-white">{act.type}</p>
                                                <p className="text-[10px] text-gray-500 italic truncate max-w-xs">{act.description}</p>
                                            </td>
                                            <td className="py-4 text-xs text-gray-400">{new Date(act.date).toLocaleDateString()}</td>
                                            <td className="py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                                                    act.status === ActivityStatus.APPROVED ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    act.status === ActivityStatus.PENDING ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>{act.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {myActivities.length === 0 && <p className="text-center py-12 text-gray-500 italic">No activity history.</p>}
                        </div>
                    </Card>
                )}

                {activeTab === 'stats' && <div className="animate-fadeIn"><Leaderboard /></div>}
            </div>
            
            <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 text-center text-xs text-gray-500 z-40 hidden md:block">
                &copy; 2025 &bull; Built by <span className="text-teal-400 font-semibold">Kaustubh Patil</span> &bull; All rights reserved
            </footer>
        </div>
    );
};

export default MemberDashboard;
