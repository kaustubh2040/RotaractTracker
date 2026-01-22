import React from 'react';
import { useClubData } from '../hooks/useClubData';
import Reveal from './common/Reveal';

const FlagshipEventPage: React.FC = () => {
    const { flagshipEvents, subEvents, setCurrentPage } = useClubData();
    const activeFlagship = flagshipEvents.find(f => f.isActive);
    const relatedSubEvents = subEvents.filter(s => s.flagshipEventId === activeFlagship?.id);

    if (!activeFlagship) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-gray-500 font-black uppercase tracking-widest">No Active Flagship Event Found</p>
                <button onClick={() => setCurrentPage('home')} className="ml-4 text-teal-400 underline">Return Home</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-teal-500/30 pb-24 overflow-x-hidden">
            {/* Theme Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-teal-900/10 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[150px]"></div>
            </div>

            {/* Top Navigation / Back */}
            <div className="container mx-auto px-6 pt-12 relative z-20">
                <button 
                    onClick={() => setCurrentPage('home')}
                    className="group flex items-center text-teal-400 hover:text-white transition-all uppercase text-[10px] font-black tracking-[0.3em]"
                >
                    <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Abandon Ship to Main
                </button>
            </div>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    <div className="w-full lg:w-1/2">
                        <Reveal instant={true}>
                            <div className="relative group rounded-[3rem] overflow-hidden border-4 border-[#d4af37]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] transform transition-transform duration-700 hover:scale-[1.01]">
                                <img src={activeFlagship.flyerUrl} className="w-full h-auto object-cover" alt={activeFlagship.name} />
                                <div className="absolute inset-0 ring-1 ring-inset ring-[#d4af37]/10 pointer-events-none"></div>
                            </div>
                        </Reveal>
                    </div>
                    <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                        <Reveal instant={true} delay={100}>
                            <span className="inline-block px-6 py-2 rounded-full bg-[#d4af37]/5 border border-[#d4af37]/20 text-[#d4af37] text-[10px] font-black uppercase tracking-[0.5em] mb-4 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                Legend Unfolds
                            </span>
                            <h1 className="text-6xl lg:text-[7rem] font-black text-white uppercase tracking-tighter leading-[0.85] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-6">
                                {activeFlagship.name}
                            </h1>
                            <p className="text-gray-400 text-xl lg:text-2xl font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                                {activeFlagship.description}
                            </p>
                            <div className="flex items-center justify-center lg:justify-start text-[#d4af37] pt-4">
                                <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" /></svg>
                                <span className="text-lg font-black uppercase tracking-[0.2em]">{activeFlagship.dateRange}</span>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Sub-Events Section */}
            <section className="container mx-auto px-6 py-24 relative z-10 border-t border-[#d4af37]/10 mt-12">
                <Reveal>
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4">The Treasure Map</h2>
                        <div className="w-24 h-1 bg-[#d4af37] mx-auto rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    {relatedSubEvents.length > 0 ? relatedSubEvents.map((sub, idx) => (
                        <Reveal key={sub.id} delay={idx * 150}>
                            <div className="group bg-gray-900/40 border border-[#d4af37]/10 rounded-[2.5rem] overflow-hidden hover:border-[#d4af37]/30 transition-all duration-500 flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <div className="h-64 overflow-hidden relative border-b border-[#d4af37]/10">
                                    <img src={sub.flyerUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={sub.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                                    <div className="absolute bottom-4 left-6 bg-[#d4af37] text-gray-950 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                                        {sub.date}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1 space-y-4">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-[#d4af37] transition-colors duration-300">{sub.name}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed font-light line-clamp-3">{sub.description}</p>
                                    <div className="flex items-center text-[#d4af37]">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mr-2">Bounty:</span>
                                        <span className="font-black text-lg">₹{sub.registrationFee}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 pt-4">
                                        <a 
                                            href={sub.googleFormUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="py-3 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest text-center rounded-xl transition-all shadow-xl active:scale-95"
                                        >
                                            Sign On
                                        </a>
                                        <a 
                                            href={sub.rulebookUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="py-3 bg-gray-800 hover:bg-gray-700 text-[#d4af37] border border-[#d4af37]/20 text-[10px] font-black uppercase tracking-widest text-center rounded-xl transition-all active:scale-95"
                                        >
                                            The Code
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    )) : (
                        <p className="col-span-full text-center text-gray-600 italic py-12">The Captain is still drafting the missions. Come back soon.</p>
                    )}
                </div>
            </section>

            {/* Footer Sign-off */}
            <footer className="container mx-auto px-6 py-24 text-center border-t border-[#d4af37]/5 mt-24">
                <Reveal>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{activeFlagship.name}</h2>
                    <p className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.4em] mb-8">Part of the Rotaract Legacy</p>
                    <button 
                        onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="p-4 rounded-full bg-gray-900 border border-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-gray-950 transition-all shadow-2xl animate-float"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    </button>
                </Reveal>
            </footer>
        </div>
    );
};

export default FlagshipEventPage;