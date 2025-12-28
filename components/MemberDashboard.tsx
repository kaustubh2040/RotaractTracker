
import React, { useState } from 'react';
import ActivityForm from './ActivityForm';
import Leaderboard from './Leaderboard';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';
import { ActivityStatus } from '../types';

const MemberDashboard: React.FC = () => {
    const { currentUser, activities, memberStats, announcements, notifications, addFeedback, feedbacks, updateMember } = useClubData();
    const [activeTab, setActiveTab] = useState<'home' | 'report' | 'history' | 'profile' | 'support'>('home');
    
    // Feedback form state
    const [fbSubject, setFbSubject] = useState('');
    const [fbMessage, setFbMessage] = useState('');

    // Profile state
    const [newPass, setNewPass] = useState('');
    const [newPhoto, setNewPhoto] = useState(currentUser?.photoUrl || '');

    if (!currentUser) return null;

    const myStats = memberStats.find(m => m.userId === currentUser.id);
    const myRank = memberStats.findIndex(m => m.userId === currentUser.id) + 1;
    const myActivities = activities.filter(a => a.userId === currentUser.id).sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    const myNotifications = notifications.filter(n => n.userId === currentUser.id);
    const myFeedbacks = feedbacks.filter(f => f.userId === currentUser.id);

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fbSubject || !fbMessage) return;
        await addFeedback(fbSubject, fbMessage);
        setFbSubject(''); setFbMessage('');
        alert('Feedback submitted successfully!');
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const updates: any = { photoUrl: newPhoto };
        if (newPass) updates.password = newPass;
        await updateMember(currentUser.id, updates);
        setNewPass('');
        alert('Profile details updated!');
    };

    const navItems = [
        { id: 'home', label: 'Dashboard', icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
        { id: 'report', label: 'Report Activity', icon: <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { id: 'history', label: 'My Logs', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
        { id: 'profile', label: 'My Identity', icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
        { id: 'support', label: 'Support', icon: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)]">
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

            <div className="flex-1 space-y-6">
                {activeTab === 'home' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
                        <div className="space-y-6">
                            <div className="bg-gray-800 p-8 rounded-[2.5rem] border border-gray-700 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-teal-500/10 to-transparent"></div>
                                <div className="w-20 h-20 rounded-2xl bg-gray-900 border-2 border-teal-500/30 overflow-hidden shadow-xl mb-4 relative z-10">
                                    {currentUser.photoUrl ? <img src={currentUser.photoUrl} className="w-full h-full object-cover" /> : null}
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2">{currentUser.name}</h3>
                                <div className="flex flex-wrap justify-center gap-2 mb-6">
                                    {currentUser.positions?.map(pos => (
                                        <span key={pos} className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                                            {pos}
                                        </span>
                                    ))}
                                    {(!currentUser.positions || currentUser.positions.length === 0) && (
                                        <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic">Club Member</span>
                                    )}
                                </div>
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Impact Rank</p>
                                        <p className="text-3xl font-black text-teal-400">#{myRank}</p>
                                    </div>
                                    <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Pts</p>
                                        <p className="text-3xl font-black text-white">{myStats?.totalPoints ?? 0}</p>
                                    </div>
                                </div>
                            </div>

                            <Card title="Club Broadcasts">
                                {announcements.length > 0 ? (
                                    <div className="space-y-4">
                                        {announcements.slice(0, 3).map(ann => (
                                            <div key={ann.id} className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl">
                                                <p className="text-sm text-gray-200 leading-relaxed italic pr-8">"{ann.text}"</p>
                                                <div className="mt-4 flex justify-between items-center text-[9px] font-black uppercase text-gray-600 tracking-widest">
                                                    <span>Official Notice</span>
                                                    <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-center py-4 text-gray-500 italic">No broadcasts today.</p>}
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card title="Latest Alerts">
                                <div className="space-y-3">
                                    {myNotifications.length > 0 ? myNotifications.slice(0, 5).map(not => (
                                        <div key={not.id} className="p-4 bg-gray-900/50 rounded-2xl flex items-start space-x-4 border border-gray-800">
                                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.6)] shrink-0"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-300 leading-relaxed">{not.text}</p>
                                                <span className="text-[9px] text-gray-600 font-bold mt-2 inline-block uppercase tracking-widest">{new Date(not.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    )) : <p className="text-center py-10 text-gray-600 italic">No recent system alerts.</p>}
                                </div>
                            </Card>
                            <Leaderboard />
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
                        <Card title="Identity Management">
                            <div className="mb-10 p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
                                <p className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-[0.2em] ml-1 text-center">Account Record</p>
                                <div className="text-center space-y-2">
                                    <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{currentUser.name}</h4>
                                    <div className="flex justify-center gap-2">
                                        {currentUser.positions?.map(p => (
                                            <span key={p} className="bg-gray-800 text-teal-400 border border-teal-500/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{p}</span>
                                        ))}
                                    </div>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase mt-6 italic tracking-widest leading-relaxed">Identity Lock: Name and Position are fixed by the Club Secretary. Contact President for official record changes.</p>
                                </div>
                            </div>

                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest ml-1">Photo URL (GitHub Raw)</label>
                                    <input 
                                        type="text" 
                                        value={newPhoto}
                                        onChange={e => setNewPhoto(e.target.value)}
                                        placeholder="https://raw.githubusercontent.com/..." 
                                        className="w-full p-4 bg-gray-700 rounded-xl border border-gray-600 text-white outline-none focus:border-teal-500 transition-all text-sm"
                                    />
                                    <div className="mt-4 p-5 bg-teal-500/5 rounded-2xl border border-teal-500/10">
                                        <h5 className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Guide: Creating a Git Raw Link
                                        </h5>
                                        <ol className="text-[11px] text-gray-500 space-y-2 ml-1">
                                            <li>1. Upload your photo to a public GitHub Repository.</li>
                                            <li>2. Open the file in the browser and click the <span className="text-white font-bold">"Raw"</span> button.</li>
                                            <li>3. Copy the URL from the address bar (it should start with <code className="text-teal-500">raw.githubusercontent.com</code>).</li>
                                            <li>4. Paste it here to update your dashboard avatar.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest ml-1">Update Access Pin (Password)</label>
                                    <input 
                                        type="password" 
                                        value={newPass}
                                        onChange={e => setNewPass(e.target.value)}
                                        placeholder="Leave empty to keep current" 
                                        className="w-full p-4 bg-gray-700 rounded-xl border border-gray-600 text-white outline-none focus:border-teal-500 transition-all text-sm"
                                    />
                                </div>
                                <button type="submit" className="w-full py-5 bg-teal-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-teal-900/40 hover:bg-teal-500 transition-all active:scale-[0.98]">Update Profile Access</button>
                            </form>
                        </Card>
                    </div>
                )}

                {activeTab === 'report' && <div className="animate-fadeIn max-w-2xl mx-auto"><ActivityForm /></div>}
                {activeTab === 'history' && (
                    <Card title="Personal Log History" className="animate-fadeIn">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] uppercase font-black text-gray-500 border-b border-gray-800">
                                    <tr>
                                        <th className="p-4">Submission Detail</th>
                                        <th className="p-4">Event Date</th>
                                        <th className="p-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {myActivities.map(act => (
                                        <tr key={act.id} className="group hover:bg-gray-700/20">
                                            <td className="p-4">
                                                <p className="text-sm font-bold text-white uppercase tracking-tight">{act.type}</p>
                                                <p className="text-[10px] text-gray-500 italic truncate max-w-xs leading-none mt-1">{act.description}</p>
                                            </td>
                                            <td className="p-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">{new Date(act.date).toLocaleDateString()}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                                                    act.status === ActivityStatus.APPROVED ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    act.status === ActivityStatus.PENDING ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>{act.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {myActivities.length === 0 && <p className="text-center py-16 text-gray-600 italic">No submission history found.</p>}
                        </div>
                    </Card>
                )}

                {activeTab === 'support' && (
                    <div className="animate-fadeIn space-y-6">
                        <Card title="Speak with Leadership">
                            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                                <input type="text" value={fbSubject} onChange={e => setFbSubject(e.target.value)} placeholder="Topic" className="w-full p-4 bg-gray-700 border border-gray-600 text-white rounded-xl focus:border-teal-500 outline-none" />
                                <textarea rows={4} value={fbMessage} onChange={e => setFbMessage(e.target.value)} placeholder="Type your message to President..." className="w-full p-4 bg-gray-700 border border-gray-600 text-white rounded-xl focus:border-teal-500 outline-none" />
                                <button type="submit" className="w-full py-4 bg-teal-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-teal-900/20">Submit Ticket</button>
                            </form>
                        </Card>
                        {myFeedbacks.map(f => (
                            <div key={f.id} className="p-6 bg-gray-800 border border-gray-700 rounded-2xl">
                                <h4 className="text-white font-bold">{f.subject}</h4>
                                <p className="text-sm text-gray-400 italic mt-2">"{f.message}"</p>
                                {f.reply ? <div className="mt-4 p-4 bg-teal-500/10 rounded-xl text-xs text-gray-300">Reply: {f.reply}</div> : <p className="text-[9px] text-gray-600 font-bold uppercase mt-4">Awaiting response...</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberDashboard;
