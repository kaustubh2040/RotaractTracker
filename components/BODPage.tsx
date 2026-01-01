import React from 'react';
import { useClubData } from '../hooks/useClubData';
import { BOD_POSITIONS } from '../constants';
import Reveal from './common/Reveal';

const BODPage: React.FC = () => {
    const { users, setCurrentPage } = useClubData();

    const bodLeadership = users.filter(u => u.positions && u.positions.length > 0).sort((a, b) => {
        const aPrimary = a.positions![0];
        const bPrimary = b.positions![0];
        const aIndex = BOD_POSITIONS.indexOf(aPrimary);
        const bIndex = BOD_POSITIONS.indexOf(bPrimary);
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    });

    return (
        <div className="animate-fadeIn min-h-screen bg-gray-900 pb-24">
            <div className="relative py-24 bg-gray-800/40 border-b border-gray-800 overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <Reveal>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-4">The Official Board</h2>
                        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                            Leadership <span className="text-transparent bg-clip-text bg-gradient-to-tr from-teal-400 to-teal-200">Portfolio</span>
                        </h1>
                    </Reveal>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-20 max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {bodLeadership.map((member, idx) => (
                        <Reveal key={member.id} delay={idx * 50}>
                            <div className="group flex flex-col h-full">
                                <div className="relative aspect-[3/4] bg-gray-800 rounded-[3rem] overflow-hidden border-2 border-gray-800 group-hover:border-teal-500/40 transition-all duration-500 shadow-2xl shadow-black/50">
                                    {member.photoUrl ? (
                                        <img src={member.photoUrl} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt={member.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-950">
                                            <svg className="w-24 h-24 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-90"></div>
                                    <div className="absolute bottom-10 left-8 right-8 z-10">
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-teal-400 transition-colors leading-none mb-3">{member.name}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {member.positions?.map(pos => (
                                                <span key={pos} className="bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-teal-500/20">{pos}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <button 
                        onClick={() => setCurrentPage('home')}
                        className="text-teal-400 hover:text-white flex items-center justify-center mx-auto uppercase text-[10px] font-black tracking-widest group bg-gray-800/50 px-8 py-3 rounded-full border border-gray-700 hover:border-teal-500/50 transition-all"
                    >
                        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BODPage;