
import React, { useState } from 'react';
import PendingApprovals from './PendingApprovals';
import Leaderboard from './Leaderboard';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ActivityType } from '../types';
import MemberManagement from './MemberManagement';

const AdminDashboard: React.FC = () => {
    const { 
        memberStats, activities, addAnnouncement, sendNotification, members, dbStatus, 
        settings, updateSettings, publicEvents, addPublicEvent, deletePublicEvent,
        aboutContent, updateAboutContent, feedbacks, replyToFeedback
    } = useClubData();
    
    const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'members' | 'messaging' | 'feedback' | 'events' | 'about' | 'settings'>('overview');
    const [msg, setMsg] = useState('');
    const [targetUser, setTargetUser] = useState('');
    const [targetMsg, setTargetMsg] = useState('');
    const [replyText, setReplyText] = useState<Record<string, string>>({});
    
    const [evtTitle, setEvtTitle] = useState('');
    const [evtDesc, setEvtDesc] = useState('');
    const [evtImg, setEvtImg] = useState('');
    const [evtDate, setEvtDate] = useState('');
    const [evtUpcoming, setEvtUpcoming] = useState(false);

    const [editAbout, setEditAbout] = useState(aboutContent);
    const [newLogoUrl, setNewLogoUrl] = useState(settings.clubLogoUrl);

    const chartData = Object.values(ActivityType).map(type => ({
        name: type,
        count: activities.filter(a => a.type === type).length,
    }));

    const navItems = [
        { id: 'overview', label: 'Overview', icon: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
        { id: 'approvals', label: 'Review Logs', icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { id: 'events', label: 'Public Events', icon: <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
        { id: 'feedback', label: 'User Feedback', icon: <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /> },
        { id: 'about', label: 'Edit About', icon: <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { id: 'members', label: 'User Hub', icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 000 5.292" /> },
        { id: 'messaging', label: 'Communications', icon: <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /> },
        { id: 'settings', label: 'Global Setup', icon: <><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></> },
    ];

    const handleReply = (id: string) => {
        if (!replyText[id]) return;
        replyToFeedback(id, replyText[id]);
        setReplyText(prev => ({ ...prev, [id]: '' }));
        alert('Reply sent!');
    };

    // Fix: Added handleCreateEvent to resolve type mismatch on line 192 (original file)
    const handleCreateEvent = async () => {
        if (!evtTitle || !evtDate) {
            alert('Please provide at least a title and date.');
            return;
        }
        await addPublicEvent({
            title: evtTitle,
            description: evtDesc,
            imageUrl: evtImg,
            date: evtDate,
            isUpcoming: evtUpcoming
        });
        setEvtTitle('');
        setEvtDesc('');
        setEvtImg('');
        setEvtDate('');
        setEvtUpcoming(false);
        alert('Event published!');
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)]">
            <aside className="w-full md:w-64 bg-gray-800/50 rounded-2xl p-4 mb-6 md:mb-0 md:mr-8 border border-gray-700 h-fit">
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
                {activeTab === 'feedback' && (
                    <div className="space-y-6 animate-fadeIn">
                        <Card title="User Feedbacks & Queries">
                            {feedbacks.length === 0 ? (
                                <p className="text-center py-12 text-gray-500 italic">No feedback received yet.</p>
                            ) : (
                                <div className="space-y-6">
                                    {feedbacks.map(fb => (
                                        <div key={fb.id} className="p-6 bg-gray-900/50 rounded-2xl border border-gray-700">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-white font-black uppercase text-sm">{fb.subject}</h4>
                                                    <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">From: {fb.userName} &bull; {new Date(fb.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                {fb.reply && <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[8px] font-black uppercase rounded border border-green-500/20">Replied</span>}
                                            </div>
                                            <p className="text-gray-300 text-sm italic mb-6">"{fb.message}"</p>
                                            
                                            {fb.reply ? (
                                                <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-xl">
                                                    <p className="text-[9px] font-black uppercase text-teal-500 mb-1 tracking-widest">President's Response:</p>
                                                    <p className="text-sm text-gray-400">{fb.reply}</p>
                                                </div>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <input 
                                                        value={replyText[fb.id] || ''} 
                                                        onChange={e => setReplyText(prev => ({ ...prev, [fb.id]: e.target.value }))}
                                                        placeholder="Write a reply..."
                                                        className="flex-1 p-2 bg-gray-700 rounded-lg text-sm text-white"
                                                    />
                                                    <button 
                                                        onClick={() => handleReply(fb.id)}
                                                        className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs"
                                                    >
                                                        Reply
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                )}
                
                {/* Previous tabs logic... */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card title="Impact Score" className="border-l-4 border-teal-500">
                                <p className="text-4xl font-black text-white">{memberStats.reduce((s,m) => s+m.totalPoints, 0)}</p>
                                <p className="text-[10px] uppercase font-bold text-teal-400 mt-2">Combined Member Points</p>
                            </Card>
                            <Card title="Engagement" className="border-l-4 border-orange-500">
                                <p className="text-4xl font-black text-white">{activities.filter(a => a.status === 'Pending').length}</p>
                                <p className="text-[10px] uppercase font-bold text-orange-400 mt-2">Logs Awaiting Review</p>
                            </Card>
                            <Card title="Status" className="border-l-4 border-blue-500">
                                <p className="text-xl font-black text-white uppercase">{dbStatus === 'connected' ? 'Synced' : 'Local'}</p>
                                <p className="text-[10px] uppercase font-bold text-blue-400 mt-2">Database Connection</p>
                            </Card>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <Card title="Distribution History">
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
                {activeTab === 'messaging' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Announcements">
                            <textarea value={msg} onChange={e => setMsg(e.target.value)} className="w-full h-32 p-4 bg-gray-700 rounded-xl text-white outline-none" placeholder="All-member notification..." />
                            <button onClick={() => { if(msg) { addAnnouncement(msg); setMsg(''); alert('Broadcasted!'); }}} className="mt-4 w-full py-3 bg-teal-600 rounded-xl font-bold">Broadcast</button>
                        </Card>
                        <Card title="Individual Alert">
                            <select value={targetUser} onChange={e => setTargetUser(e.target.value)} className="w-full p-3 bg-gray-700 rounded-xl mb-4 text-white">
                                <option value="">Select Member...</option>
                                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <input value={targetMsg} onChange={e => setTargetMsg(e.target.value)} placeholder="Alert message..." className="w-full p-3 bg-gray-700 rounded-xl mb-4 text-white" />
                            <button onClick={() => { if(targetUser && targetMsg) { sendNotification(targetUser, targetMsg); setTargetMsg(''); alert('Sent!'); }}} className="w-full py-3 bg-gray-700 text-teal-400 border border-teal-500/30 rounded-xl font-bold">Notify Member</button>
                        </Card>
                    </div>
                )}
                {activeTab === 'events' && (
                    <div className="space-y-6 animate-fadeIn">
                        <Card title="Manage Public Events">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={evtTitle} onChange={e => setEvtTitle(e.target.value)} placeholder="Event Title" className="p-3 bg-gray-700 rounded-xl border border-gray-600 text-white" />
                                <input value={evtDate} onChange={e => setEvtDate(e.target.value)} type="date" className="p-3 bg-gray-700 rounded-xl border border-gray-600 text-white" />
                                <input value={evtImg} onChange={e => setEvtImg(e.target.value)} placeholder="Image URL" className="p-3 bg-gray-700 rounded-xl border border-gray-600 text-white" />
                                <div className="flex items-center space-x-3 bg-gray-700 p-3 rounded-xl border border-gray-600">
                                    <input type="checkbox" checked={evtUpcoming} onChange={e => setEvtUpcoming(e.target.checked)} className="h-5 w-5 bg-gray-900 border-gray-600 rounded" />
                                    <span className="text-sm text-gray-300">Upcoming</span>
                                </div>
                                <textarea value={evtDesc} onChange={e => setEvtDesc(e.target.value)} placeholder="Short Description" className="md:col-span-2 p-3 bg-gray-700 rounded-xl border border-gray-600 text-white h-24" />
                            </div>
                            <button onClick={handleCreateEvent} className="mt-4 w-full py-3 bg-teal-600 rounded-xl font-bold">Publish Event</button>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
