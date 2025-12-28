
import React, { useState } from 'react';
import { useClubData } from '../hooks/useClubData';
import { PublicEvent, User } from '../types';
import { BOD_POSITIONS } from '../constants';

const HomePage: React.FC = () => {
    const { settings, publicEvents, setCurrentPage, users, registerVisitor } = useClubData();
    const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);
    const [regForm, setRegForm] = useState({ name: '', email: '', phone: '' });
    const [regStatus, setRegStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    
    const today = new Date();
    today.setHours(0,0,0,0);

    // Filter upcoming (Future events only)
    const upcomingEvents = [...publicEvents]
        .filter(e => e.isUpcoming && new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Most recent impact first (Past events)
    const recentEvents = [...publicEvents]
        .filter(e => new Date(e.date) < today)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);

    // Filter BOD and sort by the provided hierarchy sequence
    const bodLeadership = users.filter(u => u.positions && u.positions.length > 0).sort((a, b) => {
        const aPrimary = a.positions![0];
        const bPrimary = b.positions![0];
        const aIndex = BOD_POSITIONS.indexOf(aPrimary);
        const bIndex = BOD_POSITIONS.indexOf(bPrimary);
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    });

    // Only show top 2 on home page: President (0) and Secretary (1)
    const homeBOD = bodLeadership.slice(0, 2);

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent) return;
        setRegStatus('loading');
        await registerVisitor({
            eventId: selectedEvent.id,
            eventTitle: selectedEvent.title,
            eventDate: selectedEvent.date,
            name: regForm.name,
            email: regForm.email,
            phone: regForm.phone
        });
        setRegStatus('success');
        setRegForm({ name: '', email: '', phone: '' });
    };

    if (selectedEvent) {
        return (
            <div className="animate-fadeIn bg-gray-900 min-h-screen pb-20">
                <div className="relative h-[40vh] lg:h-[50vh] w-full overflow-hidden">
                    <img 
                        src={selectedEvent.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop'} 
                        className="w-full h-full object-cover" 
                        alt={selectedEvent.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                    <div className="absolute top-8 left-8 z-20">
                        <button 
                            onClick={() => { setSelectedEvent(null); setRegStatus('idle'); }}
                            className="p-3 bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-teal-500 hover:text-gray-900 transition-all shadow-2xl group"
                        >
                            <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                    </div>
                    <div className="absolute bottom-12 left-8 lg:left-24 right-8 z-10">
                        <span className="bg-teal-500 text-gray-950 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg">
                            {selectedEvent.category}
                        </span>
                        <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl mb-4">
                            {selectedEvent.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-teal-400 font-bold uppercase tracking-widest text-xs">
                                {selectedEvent.venue} &bull; {new Date(selectedEvent.date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 lg:px-24 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-gray-800/40 p-10 rounded-[2.5rem] border border-gray-700 shadow-xl">
                            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center">
                                <span className="w-10 h-px bg-teal-500 mr-4"></span> Mission Brief
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Category</p>
                                    <p className="text-sm font-bold text-teal-400 uppercase">{selectedEvent.category}</p>
                                </div>
                                <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Host Organization</p>
                                    <p className="text-sm font-bold text-white uppercase">{selectedEvent.hostClub}</p>
                                </div>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap font-light">
                                {selectedEvent.description}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        {selectedEvent.registrationEnabled ? (
                            <div className="bg-teal-500/5 p-10 rounded-[2.5rem] border border-teal-500/20 sticky top-28 shadow-2xl backdrop-blur-md">
                                {regStatus === 'success' ? (
                                    <div className="text-center py-12 animate-fadeIn">
                                        <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-teal-500/20">
                                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">Access Granted!</h4>
                                        <p className="text-gray-400 mt-4 text-sm font-medium leading-relaxed">You are now registered for {selectedEvent.title}. See you there!</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                                        <div className="mb-8">
                                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">Register Now</h4>
                                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Join the impact movement</p>
                                        </div>
                                        <input required type="text" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} placeholder="Full Name" className="w-full bg-gray-900/50 border border-gray-700 focus:border-teal-500 p-4 rounded-2xl text-white outline-none placeholder-gray-700 font-medium" />
                                        <input required type="email" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} placeholder="Email Address" className="w-full bg-gray-900/50 border border-gray-700 focus:border-teal-500 p-4 rounded-2xl text-white outline-none placeholder-gray-700 font-medium" />
                                        <input required type="tel" value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} placeholder="WhatsApp Number" className="w-full bg-gray-900/50 border border-gray-700 focus:border-teal-500 p-4 rounded-2xl text-white outline-none placeholder-gray-700 font-medium" />
                                        <button disabled={regStatus === 'loading'} className="w-full py-5 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-teal-900/40 transition-all active:scale-[0.98]">
                                            {regStatus === 'loading' ? 'Authenticating...' : 'Confirm Registration'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-800/40 p-12 rounded-[2.5rem] border border-gray-700 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight">Direct Entry</h4>
                                <p className="text-gray-500 mt-3 text-[10px] font-black uppercase tracking-widest leading-relaxed">Registration portal is currently closed for this event. Direct participation is welcome.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-40 overflow-hidden bg-gray-900 border-b border-gray-800">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    {settings.clubLogoUrl && (
                        <div className="flex justify-center mb-8">
                            <img src={settings.clubLogoUrl} alt="Logo" className="h-24 w-24 sm:h-32 sm:w-32 object-contain bg-gray-900/50 p-2 rounded-2xl border border-gray-800 shadow-2xl animate-float" />
                        </div>
                    )}
                    <h1 className="text-7xl lg:text-[10rem] font-black text-white tracking-tighter uppercase mb-2 drop-shadow-2xl">
                        {settings.appName}
                    </h1>
                    <h2 className="text-[10px] lg:text-[14px] font-black uppercase tracking-[0.5em] text-teal-400 mb-10">
                        {settings.appSubtitle}
                    </h2>
                    <p className="text-xl lg:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                        Driving <span className="text-white font-bold italic">Action</span>. Creating <span className="text-white font-bold italic">Impact</span>. 
                        Building the future with <span className="text-teal-400 font-bold">Rotaract</span>.
                    </p>
                    <div className="mt-12 flex justify-center items-center">
                        <button onClick={() => setCurrentPage('login')} className="w-full sm:w-auto px-12 py-5 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest rounded-full transition-all shadow-2xl active:scale-95 text-sm">Join Community</button>
                    </div>
                </div>
            </section>

            {/* Board of Directors Showcase - Centered & Top 2 Only */}
            <section className="py-24 bg-gray-900 overflow-hidden border-b border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-400 mb-3">Leadership Team</h3>
                        <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">Board of Directors</h2>
                        <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 lg:gap-16 max-w-5xl mx-auto mb-20">
                        {homeBOD.map(member => (
                            <div key={member.id} className="group relative w-full sm:w-72 lg:w-80">
                                <div className="relative aspect-[4/5] bg-gray-800 rounded-[3rem] overflow-hidden border border-gray-700 group-hover:border-teal-500/50 transition-all duration-500 shadow-2xl group-hover:-translate-y-4">
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent z-10"></div>
                                    {member.photoUrl ? (
                                        <img src={member.photoUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={member.name} />
                                    ) : (
                                        <div className="w-full h-full bg-gray-950 flex items-center justify-center">
                                            <svg className="w-24 h-24 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                        </div>
                                    )}
                                    <div className="absolute bottom-10 left-8 right-8 z-20">
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-teal-400 transition-colors leading-none">{member.name}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {member.positions?.map(pos => (
                                                <span key={pos} className="bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-teal-500/20">{pos}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <button 
                            onClick={() => setCurrentPage('bod-all')}
                            className="group flex items-center space-x-3 px-12 py-5 bg-gray-800 hover:bg-teal-600 text-teal-400 hover:text-white border border-teal-500/30 font-black uppercase tracking-[0.2em] text-[11px] rounded-full transition-all shadow-2xl active:scale-95"
                        >
                            <span>Explore Full Leadership Cabinet</span>
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Upcoming Impact - Auto-Filtered by Date */}
            <section className="py-24 bg-gray-800/20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-2">Next Steps</h3>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight">Upcoming Impact</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                            <div key={event.id} className="group bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-xl hover:border-teal-500/50 transition-all flex flex-col h-full">
                                <div className="h-56 overflow-hidden relative">
                                    <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                                    <div className="absolute top-4 left-4 bg-teal-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        {new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-md text-teal-400 px-3 py-1 rounded-lg text-[8px] font-black uppercase border border-teal-500/20 tracking-widest">
                                        {event.category}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-teal-400 transition-colors">{event.title}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3 font-light">{event.description}</p>
                                    <div className="mt-auto">
                                        <button onClick={() => { setSelectedEvent(event); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full py-4 bg-gray-700 group-hover:bg-teal-600 text-[10px] font-black uppercase tracking-widest text-teal-400 group-hover:text-white rounded-2xl border border-teal-500/10 group-hover:border-transparent transition-all shadow-xl active:scale-95">
                                            View Mission Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-600 italic py-12 col-span-full">No scheduled missions at the moment. Impact reports coming soon.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Recent Impact Portfolio */}
            <section className="py-24 bg-gray-900 border-t border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-2">Portfolio</h3>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight">Recent Impact</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recentEvents.length > 0 ? recentEvents.map(event => (
                            <div key={event.id} className="group bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-teal-500/50 transition-all hover:-translate-y-2">
                                <div className="h-48 overflow-hidden relative cursor-pointer" onClick={() => setSelectedEvent(event)}>
                                    <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                                </div>
                                <div className="p-6">
                                    <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">{new Date(event.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                    <h4 className="text-lg font-black text-white mt-2 group-hover:text-teal-400 transition-colors uppercase">{event.title}</h4>
                                    <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed font-light italic">"{event.category}"</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-600 col-span-full py-12 text-center italic">Archive portal initializing impact records.</p>
                        )}
                    </div>
                </div>
            </section>

            <footer className="py-20 bg-gray-900 border-t border-gray-800 text-center">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">{settings.appName}</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-6">{settings.appSubtitle}</p>
                <div className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">&copy; 2025 • Built by <span className="text-teal-400">Kaustubh Patil</span> • All rights reserved</div>
            </footer>
        </div>
    );
};

export default HomePage;
