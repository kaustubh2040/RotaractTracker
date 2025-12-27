
import React, { useState } from 'react';
import PendingApprovals from './PendingApprovals';
import Leaderboard from './Leaderboard';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ActivityType } from '../types';
import MemberManagement from './MemberManagement';

const AdminDashboard: React.FC = () => {
    const { memberStats, activities, dbStatus, dbErrorMessage, addAnnouncement, sendNotification, members } = useClubData();
    const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'members' | 'comms'>('overview');
    const [announcementText, setAnnouncementText] = useState('');
    const [notifyUserId, setNotifyUserId] = useState('');
    const [notifyText, setNotifyText] = useState('');

    const chartData = Object.values(ActivityType).map(type => ({
        name: type,
        count: activities.filter(a => a.type === type).length,
    }));

    const navItems = [
        { id: 'overview', label: 'Dashboard', icon: <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
        { id: 'approvals', label: 'Approvals', icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { id: 'members', label: 'Members', icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 000 5.292" /> },
        { id: 'comms', label: 'Broadcast', icon: <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /> },
    ];

    const handlePublishAnnouncement = async () => {
        if (!announcementText.trim()) return;
        await addAnnouncement(announcementText);
        setAnnouncementText('');
        alert('Announcement published successfully!');
    };

    const handleSendNotification = async () => {
        if (!notifyUserId || !notifyText.trim()) return;
        await sendNotification(notifyUserId, notifyText);
        setNotifyText('');
        alert('Notification sent!');
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)]">
            {/* Admin Side Nav */}
            <aside className="w-full md:w-64 bg-gray-800/50 rounded-2xl p-4 mb-6 md:mb-0 md:mr-6 border border-gray-700 h-fit">
                <div className="px-4 py-2 mb-4">
                    <p className="text-[10px] font-black uppercase text-teal-400 tracking-[0.2em]">Presidential Control</p>
                </div>
                <nav className="space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                                activeTab === item.id 
                                ? 'bg-teal-600 text-white shadow-lg' 
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
                
                {/* Status Indicator */}
                <div className="mt-8 pt-6 border-t border-gray-700 px-4">
                    <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{dbStatus === 'connected' ? 'DB Active' : 'Offline Mode'}</span>
                    </div>
                </div>
            </aside>

            {/* Main Admin Content */}
            <div className="flex-1 space-y-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl group hover:border-teal-500/30 transition-all">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Members</h3>
                                <p className="text-4xl font-black text-teal-400 mt-2">{memberStats.length}</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl group hover:border-orange-500/30 transition-all">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending Review</h3>
                                <p className="text-4xl font-black text-orange-400 mt-2">{activities.filter(a => a.status === 'Pending').length}</p>
                            </div>
                             <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl group hover:border-green-500/30 transition-all">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Logs</h3>
                                <p className="text-4xl font-black text-green-400 mt-2">{activities.length}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <Card title="Impact Distribution">
                                    <div style={{ width: '100%', height: 350 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                                                <Tooltip cursor={{fill: 'rgba(45, 212, 191, 0.05)'}} contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }} />
                                                <Bar dataKey="count" fill="#2dd4bf" radius={[4, 4, 0, 0]} barSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </div>
                            <div className="lg:col-span-1">
                                <Leaderboard />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'approvals' && <div className="animate-fadeIn"><PendingApprovals /></div>}
                {activeTab === 'members' && <div className="animate-fadeIn"><MemberManagement /></div>}
                
                {activeTab === 'comms' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
                        <Card title="Club-wide Announcement">
                            <p className="text-xs text-gray-500 mb-4">This message will appear on every member's dashboard.</p>
                            <textarea
                                value={announcementText}
                                onChange={(e) => setAnnouncementText(e.target.value)}
                                className="w-full h-32 p-4 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                                placeholder="Type your announcement here..."
                            />
                            <button
                                onClick={handlePublishAnnouncement}
                                className="mt-4 w-full py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transition-all shadow-lg shadow-teal-900/20"
                            >
                                Publish Memo
                            </button>
                        </Card>

                        <Card title="Direct Notifications">
                            <p className="text-xs text-gray-500 mb-4">Send a private alert to a specific member.</p>
                            <div className="space-y-4">
                                <select
                                    value={notifyUserId}
                                    onChange={(e) => setNotifyUserId(e.target.value)}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-xl outline-none"
                                >
                                    <option value="">Select Member...</option>
                                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                                <input
                                    type="text"
                                    value={notifyText}
                                    onChange={(e) => setNotifyText(e.target.value)}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-xl outline-none"
                                    placeholder="Message text..."
                                />
                                <button
                                    onClick={handleSendNotification}
                                    className="w-full py-3 bg-gray-700 text-teal-400 border border-teal-500/30 font-bold rounded-xl hover:bg-teal-500/10 transition-all"
                                >
                                    Send Alert
                                </button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
            
            <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 text-center text-xs text-gray-500 z-40 hidden md:block">
                &copy; 2025 &bull; Built by <span className="text-teal-400 font-semibold">Kaustubh Patil</span> &bull; All rights reserved
            </footer>
        </div>
    );
};

export default AdminDashboard;
