
import React, { useState } from 'react';
import PendingApprovals from './PendingApprovals';
import Leaderboard from './Leaderboard';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ActivityType } from '../types';
import MemberManagement from './MemberManagement';

const AdminDashboard: React.FC = () => {
    const { memberStats, activities, addAnnouncement, sendNotification, members, dbStatus, settings, updateSettings } = useClubData();
    const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'members' | 'broadcast' | 'settings'>('overview');
    const [msg, setMsg] = useState('');
    const [targetUser, setTargetUser] = useState('');
    const [targetMsg, setTargetMsg] = useState('');
    const [newLogoUrl, setNewLogoUrl] = useState(settings.clubLogoUrl);

    const chartData = Object.values(ActivityType).map(type => ({
        name: type,
        count: activities.filter(a => a.type === type).length,
    }));

    const navItems = [
        { id: 'overview', label: 'Dashboard', icon: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
        { id: 'approvals', label: 'Approvals', icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { id: 'members', label: 'Member List', icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 000 5.292" /> },
        { id: 'broadcast', label: 'Broadcast', icon: <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /> },
        { id: 'settings', label: 'Settings', icon: <><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></> },
    ];

    const handleSaveLogo = async () => {
        await updateSettings({ clubLogoUrl: newLogoUrl });
        alert('Club branding updated!');
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)]">
            <aside className="w-full md:w-64 bg-gray-800/50 rounded-2xl p-4 mb-6 md:mb-0 md:mr-6 border border-gray-700 h-fit">
                <p className="text-[10px] font-black uppercase text-teal-400 tracking-[0.2em] mb-4 px-2">Presidential Panel</p>
                <nav className="space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                                activeTab === item.id ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">{item.icon}</svg>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 space-y-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 uppercase">Members</h3>
                                <p className="text-4xl font-black text-teal-400 mt-2">{memberStats.length}</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 uppercase">Waitlist</h3>
                                <p className="text-4xl font-black text-orange-400 mt-2">{activities.filter(a => a.status === 'Pending').length}</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 uppercase">System Status</h3>
                                <p className="text-lg font-black text-white mt-4 uppercase flex items-center">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${dbStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {dbStatus === 'connected' ? 'Secure Cloud' : 'Local Backup'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <Card title="Activity Analytics">
                                    <div style={{ height: 350 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={chartData}>
                                                <XAxis dataKey="name" axisLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                                                <YAxis axisLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                                                <Bar dataKey="count" fill="#2dd4bf" radius={[4, 4, 0, 0]} barSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </div>
                            <div>
                                <Leaderboard />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'approvals' && <PendingApprovals />}
                {activeTab === 'members' && <MemberManagement />}
                {activeTab === 'broadcast' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Club-wide Broadcast">
                            <textarea
                                value={msg}
                                onChange={e => setMsg(e.target.value)}
                                className="w-full h-32 p-4 bg-gray-700 border border-gray-600 rounded-xl text-white outline-none focus:ring-1 focus:ring-teal-500"
                                placeholder="Type a message for all members..."
                            />
                            <button onClick={() => { if(msg) { addAnnouncement(msg); setMsg(''); alert('Broadcasted!'); }}} className="mt-4 w-full py-3 bg-teal-600 rounded-xl font-bold">Post Announcement</button>
                        </Card>
                        <Card title="Private Member Alert">
                            <select value={targetUser} onChange={e => setTargetUser(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl mb-4 text-white">
                                <option value="">Select Member...</option>
                                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <input value={targetMsg} onChange={e => setTargetMsg(e.target.value)} placeholder="Message..." className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl mb-4 text-white" />
                            <button onClick={() => { if(targetUser && targetMsg) { sendNotification(targetUser, targetMsg); setTargetMsg(''); alert('Alert sent!'); }}} className="w-full py-3 bg-gray-700 text-teal-400 border border-teal-500/30 rounded-xl font-bold">Send Direct Alert</button>
                        </Card>
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl animate-fadeIn">
                        <Card title="Application Branding">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-widest mb-2">Club Logo URL</label>
                                    <div className="flex space-x-2">
                                        <input 
                                            type="text" 
                                            value={newLogoUrl} 
                                            onChange={e => setNewLogoUrl(e.target.value)}
                                            placeholder="https://example.com/logo.png"
                                            className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-xl text-white outline-none focus:ring-1 focus:ring-teal-500"
                                        />
                                        <button 
                                            onClick={handleSaveLogo}
                                            className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all"
                                        >
                                            Save
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2 italic">Tip: Use a transparent PNG logo for the best look.</p>
                                </div>

                                {newLogoUrl && (
                                    <div className="pt-6 border-t border-gray-700/50">
                                        <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-3">Live Preview</label>
                                        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700 border-dashed flex items-center justify-center">
                                            <img src={newLogoUrl} alt="Logo Preview" className="max-h-32 object-contain" onError={() => alert('Invalid image URL provided.')}/>
                                        </div>
                                    </div>
                                )}
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
