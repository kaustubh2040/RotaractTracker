
import React from 'react';
import { useClubData } from '../hooks/useClubData';

const HomePage: React.FC = () => {
    const { settings, publicEvents, setCurrentPage } = useClubData();
    
    const recentEvents = publicEvents.filter(e => !e.isUpcoming).slice(0, 4);
    const upcomingEvents = publicEvents.filter(e => e.isUpcoming).slice(0, 3);

    return (
        <div className="animate-fadeIn">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-40 overflow-hidden bg-gray-900">
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
                    <div className="mt-12 flex justify-center space-x-4">
                        <button 
                            onClick={() => setCurrentPage('login')}
                            className="px-10 py-4 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest rounded-full transition-all shadow-2xl shadow-teal-900/40"
                        >
                            Join the Portal
                        </button>
                    </div>
                </div>
            </section>

            {/* Upcoming Section (Enhanced with Images) */}
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
                                        <button className="w-full py-3 bg-gray-700 group-hover:bg-teal-600 text-[10px] font-black uppercase tracking-widest text-teal-400 group-hover:text-white rounded-xl border border-teal-500/20 group-hover:border-transparent transition-all">
                                            Set Reminder
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

            {/* Recent Impact (Top 4) */}
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
                                <div className="h-48 overflow-hidden relative">
                                    <img 
                                        src={event.imageUrl || 'https://images.unsplash.com/photo-1559027615-cd7667dfd31b?q=80&w=2070&auto=format&fit=crop'} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
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
