
import React, { useState } from 'react';
import PendingApprovals from './PendingApprovals';
import Leaderboard from './Leaderboard';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ActivityType, PublicEvent } from '../types';
import MemberManagement from './MemberManagement';

const AdminDashboard: React.FC = () => {
    const { 
        memberStats, activities, addAnnouncement, sendNotification, members, dbStatus, 
        publicEvents, addPublicEvent, updatePublicEvent, deletePublicEvent, feedbacks, replyToFeedback, registrations,
        settings, updateSettings, aboutContent, updateAboutContent
    } = useClubData();
    
    const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'members' | 'communications' | 'feedback' | 'events' | 'registrations' | 'settings'>('overview');
    const [msg, setMsg] = useState('');
    const [targetUser, setTargetUser] = useState('');
    const [targetMsg, setTargetMsg] = useState('');
    const [replyText, setReplyText] = useState<Record<string, string>>({});
    
    // Settings States
    const [tempSettings, setTempSettings] = useState(settings);
    const [tempAbout, setTempAbout] = useState(aboutContent);

    // Event Form State
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [evtTitle, setEvtTitle] = useState('');
    const [evtDesc, setEvtDesc] = useState('');
    const [evtImg, setEvtImg] = useState('');
    const [evtDate, setEvtDate] = useState('');
    const [evtVenue, setEvtVenue] = useState('');
    const [evtCategory, setEvtCategory] = useState('General');
    const [evtHostClub, setEvtHostClub] = useState('Rotaract RSCOE');
    const [evtRegEnabled, setEvtRegEnabled] = useState(true);
    const [evtUpcoming, setEvtUpcoming] = useState(false);

    // Auto-filter registrations (5 days after event)
    const activeRegistrations = registrations.filter(reg => {
        const eventDate = new Date(reg.eventDate);
        const now = new Date();
        const diffDays = (now.getTime() - eventDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 5;
    });

    const handleEditEvent = (evt: PublicEvent) => {
        setEditingEventId(evt.id);
        setEvtTitle(evt.title);
        setEvtDesc(evt.description);
        setEvtImg(evt.imageUrl);
        setEvtDate(evt.date);
        setEvtVenue(evt.venue);
        setEvtCategory(evt.category);
        setEvtHostClub(evt.hostClub);
        setEvtRegEnabled(evt.registrationEnabled);
        setEvtUpcoming(evt.isUpcoming);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSaveEvent = async () => {
        if (!evtTitle || !evtDate) return alert('Provide title and date.');
        
        const eventData = {
            title: evtTitle,
            description: evtDesc,
            imageUrl: evtImg,
            date: evtDate,
            venue: evtVenue,
            category: evtCategory,
            hostClub: evtHostClub,
            registrationEnabled: evtRegEnabled,
            isUpcoming: evtUpcoming
        };

        if (editingEventId) {
            await updatePublicEvent(editingEventId, eventData);
            setEditingEventId(null);
        } else {
            await addPublicEvent(eventData);
        }

        setEvtTitle(''); setEvtDesc(''); setEvtImg(''); setEvtDate(''); setEvtVenue(''); setEvtCategory('General'); setEvtHostClub('Rotaract RSCOE');
        alert('Event saved successfully!');
    };

    const handleUpdateSettings = async () => {
        await updateSettings(tempSettings);
        await updateAboutContent(tempAbout);
        alert('Application settings updated!');
    };

    const chartData = Object.values(ActivityType).map(type => ({
        name: type,
        count: activities.filter(a => a.type === type).length,
    }));

    const navItems = [
        { id: 'overview', label: 'Overview', icon: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
        { id: 'approvals', label: 'Review Logs', icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { id: 'events', label: 'Manage Events', icon: <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
        { id: 'registrations', label: 'Attendees', icon: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
        { id: 'members', label: 'User Hub', icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 000 5.292" /> },
        { id: 'feedback', label: 'Feedback', icon: <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /> },
        { id: 'communications', label: 'Communcations', icon: <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /> },
        { id: 'settings', label: 'App Settings', icon: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> },
    ];

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
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card title="Impact Score" className="border-l-4 border-teal-500">
                                <p className="text-4xl font-black text-white">{memberStats.reduce((s,m) => s+m.totalPoints, 0)}</p>
                                <p className="text-[10px] uppercase font-bold text-teal-400 mt-2">Combined Member Points</p>
                            </Card>
                            <Card title="Active Signups" className="border-l-4 border-orange-500">
                                <p className="text-4xl font-black text-white">{activeRegistrations.length}</p>
                                <p className="text-[10px] uppercase font-bold text-orange-400 mt-2">Registrations (Recent)</p>
                            </Card>
                            <Card title="Status" className="border-l-4 border-blue-500">
                                <p className="text-xl font-black text-white uppercase">{dbStatus === 'connected' ? 'Synced' : 'Local'}</p>
                                <p className="text-[10px] uppercase font-bold text-blue-400 mt-2">Database Connection</p>
                            </Card>
                        </div>
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
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-6 animate-fadeIn">
                        <Card title="Branding & Visuals">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Application Name</label>
                                    <input 
                                        value={tempSettings.appName} 
                                        onChange={e => setTempSettings({...tempSettings, appName: e.target.value})} 
                                        className="w-full p-3 bg-gray-700 rounded-xl text-white border border-gray-600 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">App Subtitle</label>
                                    <input 
                                        value={tempSettings.appSubtitle} 
                                        onChange={e => setTempSettings({...tempSettings, appSubtitle: e.target.value})} 
                                        className="w-full p-3 bg-gray-700 rounded-xl text-white border border-gray-600 outline-none" 
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Club Logo URL</label>
                                    <input 
                                        value={tempSettings.clubLogoUrl} 
                                        onChange={e => setTempSettings({...tempSettings, clubLogoUrl: e.target.value})} 
                                        className="w-full p-3 bg-gray-700 rounded-xl text-white border border-gray-600 outline-none" 
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card title="About Content">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Introduction</label>
                                    <textarea 
                                        value={tempAbout.intro} 
                                        onChange={e => setTempAbout({...tempAbout, intro: e.target.value})} 
                                        className="w-full p-3 bg-gray-700 rounded-xl text-white border border-gray-600 h-24 outline-none" 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Vision</label>
                                        <textarea 
                                            value={tempAbout.vision} 
                                            onChange={e => setTempAbout({...tempAbout, vision: e.target.value})} 
                                            className="w-full p-3 bg-gray-700 rounded-xl text-white border border-gray-600 h-24 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Mission</label>
                                        <textarea 
                                            value={tempAbout.mission} 
                                            onChange={e => setTempAbout({...tempAbout, mission: e.target.value})} 
                                            className="w-full p-3 bg-gray-700 rounded-xl text-white border border-gray-600 h-24 outline-none" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Core Values</label>
                                    <textarea 
                                        value={tempAbout.values} 
                                        onChange={e => setTempAbout({...tempAbout, values: e.target.value})} 
                                        className="w-full p-3 bg-gray-700 rounded-xl text-white border border-gray-600 h-24 outline-none" 
                                    />
                                </div>
                            </div>
                        </Card>

                        <button 
                            onClick={handleUpdateSettings} 
                            className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-[0.98]"
                        >
                            Save All Preferences
                        </button>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="space-y-6 animate-fadeIn">
                        <Card title={editingEventId ? "Edit Existing Event" : "Publish New Event"}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={evtTitle} onChange={e => setEvtTitle(e.target.value)} placeholder="Event Title" className="p-3 bg-gray-700 rounded-xl text-white border border-gray-600 outline-none" />
                                <input value={evtDate} onChange={e => setEvtDate(e.target.value)} type="date" className="p-3 bg-gray-700 rounded-xl text-white border border-gray-600 outline-none" />
                                <input value={evtVenue} onChange={e => setEvtVenue(e.target.value)} placeholder="Venue" className="p-3 bg-gray-700 rounded-xl text-white border border-gray-600 outline-none" />
                                <input value={evtImg} onChange={e => setEvtImg(e.target.value)} placeholder="Image Link" className="p-3 bg-gray-700 rounded-xl text-white border border-gray-600 outline-none" />
                                <input value={evtCategory} onChange={e => setEvtCategory(e.target.value)} placeholder="Category" className="p-3 bg-gray-700 rounded-xl text-white border border-gray-600 outline-none" />
                                <input value={evtHostClub} onChange={e => setEvtHostClub(e.target.value)} placeholder="Host Club" className="p-3 bg-gray-700 rounded-xl text-white border border-gray-600 outline-none" />
                                
                                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-xl border border-gray-600">
                                    <span className="text-sm text-gray-300">Registration Portal</span>
                                    <input type="checkbox" checked={evtRegEnabled} onChange={e => setEvtRegEnabled(e.target.checked)} className="h-5 w-5 accent-teal-500" />
                                </div>
                                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-xl border border-gray-600">
                                    <span className="text-sm text-gray-300">Show in Upcoming</span>
                                    <input type="checkbox" checked={evtUpcoming} onChange={e => setEvtUpcoming(e.target.checked)} className="h-5 w-5 accent-teal-500" />
                                </div>
                                <textarea value={evtDesc} onChange={e => setEvtDesc(e.target.value)} placeholder="Event Story/Mission..." className="md:col-span-2 p-3 bg-gray-700 rounded-xl text-white border border-gray-600 h-32" />
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <button onClick={handleSaveEvent} className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 rounded-xl font-bold shadow-lg transition-all">{editingEventId ? 'Update Event' : 'Publish to Feed'}</button>
                                {editingEventId && <button onClick={() => { setEditingEventId(null); setEvtTitle(''); }} className="px-6 py-3 bg-gray-700 rounded-xl font-bold">Cancel</button>}
                            </div>
                        </Card>

                        <div className="space-y-4">
                            {publicEvents.map(evt => (
                                <div key={evt.id} className="p-4 bg-gray-800 rounded-2xl border border-gray-700 flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-900 rounded-lg overflow-hidden shadow-inner">
                                            <img src={evt.imageUrl} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{evt.title}</h4>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">{new Date(evt.date).toLocaleDateString()} • {evt.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditEvent(evt)} className="text-teal-400 hover:bg-teal-400/10 p-2 rounded-lg transition-all">Edit</button>
                                        <button onClick={() => deletePublicEvent(evt.id)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition-all">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'registrations' && (
                    <Card title="Visitor Registrations (Active Window)">
                        <div className="space-y-4">
                            {activeRegistrations.length > 0 ? activeRegistrations.map(reg => (
                                <div key={reg.id} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 flex justify-between items-center">
                                    <div>
                                        <h4 className="text-white font-black uppercase text-sm">{reg.name}</h4>
                                        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">{reg.eventTitle} &bull; {new Date(reg.eventDate).toLocaleDateString()}</p>
                                        <div className="mt-2 text-xs text-gray-400">
                                            <p>Email: {reg.email}</p>
                                            <p>Phone: {reg.phone}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-600 font-black uppercase">Registered On</p>
                                        <p className="text-xs text-gray-500">{new Date(reg.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            )) : <p className="text-center py-12 text-gray-600 italic">No registrations found for recent/upcoming events.</p>}
                        </div>
                    </Card>
                )}

                {activeTab === 'approvals' && <PendingApprovals />}
                {activeTab === 'members' && <MemberManagement />}
                {activeTab === 'communications' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
                        <Card title="Global Broadcast">
                            <textarea value={msg} onChange={e => setMsg(e.target.value)} className="w-full h-32 p-4 bg-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-teal-500 border border-gray-600" placeholder="Post club-wide announcement..." />
                            <button onClick={() => { addAnnouncement(msg); setMsg(''); alert('Broadcasted!'); }} className="mt-4 w-full py-3 bg-teal-600 hover:bg-teal-500 rounded-xl font-bold shadow-lg shadow-teal-900/20">Send Broadcast</button>
                        </Card>
                        <Card title="Direct Notify">
                            <select value={targetUser} onChange={e => setTargetUser(e.target.value)} className="w-full p-3 bg-gray-700 rounded-xl mb-4 text-white border border-gray-600 outline-none">
                                <option value="">Target Member...</option>
                                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <input value={targetMsg} onChange={e => setTargetMsg(e.target.value)} placeholder="Alert text..." className="w-full p-3 bg-gray-700 rounded-xl mb-4 text-white border border-gray-600 outline-none" />
                            <button onClick={() => { sendNotification(targetUser, targetMsg); setTargetMsg(''); alert('Alert Sent!'); }} className="w-full py-3 bg-gray-600 text-teal-400 border border-teal-500/30 rounded-xl font-bold transition-all">Send Private Notification</button>
                        </Card>
                    </div>
                )}
                {activeTab === 'feedback' && (
                    <Card title="Feedbacks & Queries">
                        <div className="space-y-4">
                            {feedbacks.map(f => (
                                <div key={f.id} className="p-6 bg-gray-900/50 rounded-2xl border border-gray-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white font-bold">{f.subject}</h4>
                                        <span className="text-[10px] text-teal-500 font-black">{f.userName}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 italic mb-4">"{f.message}"</p>
                                    {!f.reply ? (
                                        <div className="flex space-x-2">
                                            <input 
                                                value={replyText[f.id] || ''} 
                                                onChange={e => setReplyText(prev => ({ ...prev, [f.id]: e.target.value }))}
                                                placeholder="Write reply..." 
                                                className="flex-1 p-2 bg-gray-700 rounded-lg text-xs"
                                            />
                                            <button onClick={() => { replyToFeedback(f.id, replyText[f.id]); alert('Replied!'); }} className="px-3 py-2 bg-teal-600 rounded-lg text-xs font-bold">Reply</button>
                                        </div>
                                    ) : <div className="p-3 bg-teal-500/10 rounded-xl text-xs text-gray-300">Rep: {f.reply}</div>}
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
