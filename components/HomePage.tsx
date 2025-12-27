
import React, { useState, useEffect } from 'react';
import { useClubData } from '../hooks/useClubData';

const HomePage: React.FC = () => {
    const { settings, publicEvents, setCurrentPage } = useClubData();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    
    useEffect(() => {
        // Check if already installed/standalone
        const checkStandalone = () => {
            const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
            setIsStandalone(isStandaloneMode);
        };

        // Detect iOS
        const checkIOS = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            setIsIOS(/iphone|ipad|ipod/.test(userAgent));
        };

        checkStandalone();
        checkIOS();

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsInstallable(false);
            setDeferredPrompt(null);
        }
    };
    
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
                    <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button 
                            onClick={() => setCurrentPage('login')}
                            className="w-full sm:w-auto px-10 py-4 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest rounded-full transition-all shadow-2xl shadow-teal-900/40"
                        >
                            Join the Portal
                        </button>
                    </div>
                </div>
            </section>

            {/* Smart Install Hub - Only shows if NOT installed */}
            {!isStandalone && (
                <section className="bg-gray-800/50 border-y border-gray-700 py-12">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto bg-gray-900 rounded-[2rem] p-8 border border-teal-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                            <div className="flex items-center space-x-6">
                                <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/30">
                                    <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Experience {settings.appName} Mobile</h3>
                                    <p className="text-sm text-gray-400 mt-1">Install the app for instant access and a smoother experience.</p>
                                </div>
                            </div>

                            {isIOS ? (
                                <div className="bg-teal-500/5 px-6 py-4 rounded-2xl border border-teal-500/10">
                                    <p className="text-xs font-bold text-teal-400 uppercase tracking-widest text-center md:text-left">For iOS Users:</p>
                                    <div className="flex items-center space-x-3 mt-2">
                                        <div className="bg-white/10 p-1.5 rounded-lg">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l3 3m-3-3L9 7" /></svg>
                                        </div>
                                        <p className="text-xs text-gray-300 font-medium">Tap <span className="text-white font-bold">Share</span> then <span className="text-white font-bold">"Add to Home Screen"</span></p>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleInstall}
                                    disabled={!isInstallable}
                                    className={`px-10 py-4 font-black uppercase tracking-widest rounded-xl transition-all shadow-xl ${
                                        isInstallable 
                                        ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/40 animate-pulse' 
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed grayscale'
                                    }`}
                                >
                                    {isInstallable ? 'Install Now' : 'App Ready'}
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            )}

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
