
import React, { useState } from 'react';
import { useClubData } from '../hooks/useClubData';
import { PublicEvent } from '../types';

const HomePage: React.FC = () => {
    const { settings, publicEvents, setCurrentPage } = useClubData();
    const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);
    const [regForm, setRegForm] = useState({ name: '', email: '', phone: '' });
    const [regStatus, setRegStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    
    // Most recent impact first (past events)
    const recentEvents = [...publicEvents]
        .filter(e => !e.isUpcoming)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);

    // Soonest upcoming first (future events)
    const upcomingEvents = [...publicEvents]
        .filter(e => e.isUpcoming)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setRegStatus('loading');
        setTimeout(() => {
            setRegStatus('success');
            setRegForm({ name: '', email: '', phone: '' });
        }, 1500);
    };

    if (selectedEvent) {
        return (
            <div className="animate-fadeIn bg-gray-900 min-h-screen pb-20">
                {/* Back Button */}
                <div className="container mx-auto px-6 py-8">
                    <button 
                        onClick={() => { setSelectedEvent(null); setRegStatus('idle'); }}
                        className="flex items-center space-x-2 text-gray-400 hover:text-teal-400 transition-colors group"
                    >
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Feed</span>
                    </button>
                </div>

                {/* Event Creative Detail */}
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="relative h-[400px] lg:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
                        <img 
                            src={selectedEvent.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop'} 
                            className="w-full h-full object-cover" 
                            alt={selectedEvent.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
                        <div className="absolute bottom-12 left-12 right-12">
                            <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-4 leading-tight">
                                {selectedEvent.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="bg-teal-500 text-gray-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                                    {new Date(selectedEvent.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                <span className="bg-gray-800/80 backdrop-blur-md text-teal-400 border border-teal-500/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                    {selectedEvent.venue || 'Venue to be announced'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Information Section */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-gray-800/40 p-10 rounded-[2.5rem] border border-gray-700">
                                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center">
                                    <span className="w-8 h-px bg-teal-500 mr-4"></span>
                                    Event Mission
                                </h3>
                                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                                    {selectedEvent.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-800/40 p-8 rounded-3xl border border-gray-700">
                                    <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-2">Category</p>
                                    <p className="text-white font-bold text-lg">Community Service</p>
                                </div>
                                <div className="bg-gray-800/40 p-8 rounded-3xl border border-gray-700">
                                    <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-2">Host Club</p>
                                    <p className="text-white font-bold text-lg">Rotaract RSCOE</p>
                                </div>
                            </div>
                        </div>

                        {/* Registration Panel */}
                        <div className="lg:col-span-1">
                            {selectedEvent.registrationEnabled ? (
                                <div className="bg-teal-500/5 p-10 rounded-[2.5rem] border border-teal-500/20 sticky top-28 shadow-2xl">
                                    {regStatus === 'success' ? (
                                        <div className="text-center py-8 animate-fadeIn">
                                            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">Registered!</h4>
                                            <p className="text-gray-400 mt-4 text-sm">See you at the event. Confirmation sent to your email.</p>
                                            <button 
                                                onClick={() => setRegStatus('idle')}
                                                className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 hover:text-white"
                                            >
                                                Register Another Person
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleRegister} className="space-y-6">
                                            <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Join Event</h4>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Limited seats available</p>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Full Name</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        value={regForm.name}
                                                        onChange={e => setRegForm({...regForm, name: e.target.value})}
                                                        placeholder="Enter your name" 
                                                        className="w-full bg-gray-900 border border-gray-700 focus:border-teal-500 p-4 rounded-xl text-white outline-none transition-all placeholder-gray-700"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Gmail / Email</label>
                                                    <input 
                                                        required
                                                        type="email" 
                                                        value={regForm.email}
                                                        onChange={e => setRegForm({...regForm, email: e.target.value})}
                                                        placeholder="user@gmail.com" 
                                                        className="w-full bg-gray-900 border border-gray-700 focus:border-teal-500 p-4 rounded-xl text-white outline-none transition-all placeholder-gray-700"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Phone Number</label>
                                                    <input 
                                                        required
                                                        type="tel" 
                                                        value={regForm.phone}
                                                        onChange={e => setRegForm({...regForm, phone: e.target.value})}
                                                        placeholder="+91 00000 00000" 
                                                        className="w-full bg-gray-900 border border-gray-700 focus:border-teal-500 p-4 rounded-xl text-white outline-none transition-all placeholder-gray-700"
                                                    />
                                                </div>
                                            </div>

                                            <button 
                                                disabled={regStatus === 'loading'}
                                                className="w-full py-5 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-teal-900/40 transition-all flex items-center justify-center space-x-2"
                                            >
                                                {regStatus === 'loading' ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <span>Complete Registration</span>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-gray-800/40 p-10 rounded-[2.5rem] border border-gray-700 text-center">
                                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tight">Direct Entry</h4>
                                    <p className="text-gray-500 mt-2 text-xs font-bold uppercase tracking-widest">No registration required for this event.</p>
                                </div>
                            )}
                        </div>
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
                    <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-teal-400 mb-4 uppercase">{settings.appSubtitle}</h2>
                    <h1 className="text-6xl lg:text-9xl font-black text-white tracking-tighter uppercase mb-6 drop-shadow-2xl">
                        {settings.appName}
                    </h1>
                    <p className="text-xl lg:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                        Driving <span className="text-white font-bold italic">Action</span>. Creating <span className="text-white font-bold italic">Impact</span>. 
                        Building the future with <span className="text-teal-400 font-bold">Rotaract</span>.
                    </p>
                    
                    <div className="mt-12 flex justify-center items-center">
                        <button 
                            onClick={() => setCurrentPage('login')}
                            className="w-full sm:w-auto px-12 py-5 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest rounded-full transition-all shadow-2xl shadow-teal-900/40 transform hover:-translate-y-1 active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </section>

            {/* Upcoming Section */}
            <section className="py-24 bg-gray-800/20 border-t border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-2">Next Steps</h3>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tight">Upcoming Events</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                                <div key={event.id} className="group bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-xl hover:border-teal-500/50 transition-all">
                                    <div className="h-56 overflow-hidden relative">
                                        <img 
                                            src={event.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop'} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            alt={event.title}
                                        />
                                        <div className="absolute top-4 left-4 bg-teal-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                            {new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-teal-400 transition-colors">{event.title}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">{event.description}</p>
                                        <button 
                                            onClick={() => { setSelectedEvent(event); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="w-full py-3 bg-gray-700 group-hover:bg-teal-600 text-[10px] font-black uppercase tracking-widest text-teal-400 group-hover:text-white rounded-xl border border-teal-500/20 group-hover:border-transparent transition-all"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-gray-600 italic py-8 col-span-full">No events scheduled at the moment.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Impact Section */}
            <section className="py-24 bg-gray-900 border-t border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-2">Portfolio</h3>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tight">Recent Impact</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recentEvents.length > 0 ? recentEvents.map(event => (
                            <div key={event.id} className="group bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-teal-500/50 transition-all hover:-translate-y-2">
                                <div className="h-48 overflow-hidden relative" onClick={() => setSelectedEvent(event)}>
                                    <img 
                                        src={event.imageUrl || 'https://images.unsplash.com/photo-1559027615-cd7667dfd31b?q=80&w=2070&auto=format&fit=crop'} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer" 
                                        alt={event.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                                </div>
                                <div className="p-6">
                                    <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">{new Date(event.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                    <h4 className="text-lg font-black text-white mt-2 group-hover:text-teal-400 transition-colors uppercase">{event.title}</h4>
                                    <p className="text-sm text-gray-500 mt-3 line-clamp-3 leading-relaxed">{event.description}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-600 col-span-full py-12 text-center italic border border-dashed border-gray-800 rounded-3xl">Our latest impact stories will appear here soon.</p>
                        )}
                    </div>
                </div>
            </section>

            <footer className="py-20 bg-gray-900 border-t border-gray-800">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex justify-center items-center mb-8">
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{settings.appName}</h2>
                    </div>
                    <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
                        Empowering youth to serve and lead. {settings.appSubtitle}. 
                        An official platform for club engagement and impact tracking.
                    </p>
                    <div className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
                        &copy; 2025 &bull; Built by <span className="text-teal-400">Kaustubh Patil</span> &bull; All rights reserved
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
