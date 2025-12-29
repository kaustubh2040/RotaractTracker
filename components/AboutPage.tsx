import React from 'react';
import { useClubData } from '../hooks/useClubData';

const AboutPage: React.FC = () => {
    const { aboutContent, settings } = useClubData();

    return (
        <div className="animate-fadeIn min-h-[calc(100vh-5rem)] bg-gray-900 pb-24">
            {/* Header Section */}
            <div className="relative py-24 bg-gray-800/40 border-b border-gray-800 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-96 h-96 bg-teal-500 blur-[150px] rounded-full"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-4">Official Profile</h2>
                    <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-tight">
                        About <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-tr from-teal-400 to-teal-200">Rotaract Club of RSCOE</span>
                    </h1>
                    <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg italic">
                        "Service Above Self"
                    </p>
                </div>
            </div>

            {/* Content Sections */}
            <div className="container mx-auto px-6 mt-16 space-y-16">
                <div className="max-w-4xl mx-auto bg-gray-800/50 p-8 lg:p-12 rounded-[2rem] border border-gray-700 shadow-2xl">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6 flex items-center">
                        <span className="w-8 h-px bg-teal-500 mr-4"></span>
                        Introduction
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                        {aboutContent.intro}
                    </p>
                </div>

                {/* Group Image Section - NEW */}
                <div className="max-w-6xl mx-auto mb-16">
                    <div className="relative group rounded-[3rem] overflow-hidden border-2 border-gray-800 shadow-2xl transition-all duration-500 hover:border-teal-500/30">
                        <img 
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                            alt="Club Team Impact" 
                            className="w-full h-auto object-cover max-h-[600px] transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-10 left-10 z-10">
                            <h4 className="text-white text-3xl font-black uppercase tracking-tighter">Unified Leadership</h4>
                            <p className="text-teal-400 font-black uppercase text-[10px] tracking-[0.4em] mt-2">Making a difference together</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <div className="bg-gray-800/50 p-10 rounded-[2rem] border border-gray-700 shadow-xl group hover:border-teal-500/30 transition-all">
                        <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 border border-teal-500/20">
                            <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase mb-4 tracking-widest">Our Vision</h3>
                        <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {aboutContent.vision}
                        </p>
                    </div>

                    <div className="bg-gray-800/50 p-10 rounded-[2rem] border border-gray-700 shadow-xl group hover:border-teal-500/30 transition-all">
                        <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 border border-teal-500/20">
                            <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase mb-4 tracking-widest">Our Mission</h3>
                        <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {aboutContent.mission}
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto bg-gradient-to-br from-teal-900/20 to-gray-800/20 p-8 lg:p-12 rounded-[2rem] border border-teal-500/10 text-center">
                    <h3 className="text-[10px] font-black uppercase text-teal-400 tracking-[0.4em] mb-4">Core Philosophy</h3>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-8">Our Values</h2>
                    <p className="text-gray-300 italic text-xl whitespace-pre-wrap leading-relaxed">
                        {aboutContent.values}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;