
import React, { useState, useEffect } from 'react';
import { useClubData } from '../../hooks/useClubData';

const Header: React.FC = () => {
    const { currentUser, logout, settings, setCurrentPage, currentPage } = useClubData();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        window.addEventListener('appinstalled', () => {
            // Log install to analytics or update UI
            console.log('PWA was installed');
            setIsInstallable(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    return (
        <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 h-20 sticky top-0 z-50 flex items-center justify-between px-4 lg:px-12 transition-all">
            <div 
                className="flex items-center cursor-pointer group" 
                onClick={() => setCurrentPage('home')}
            >
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-teal-500 via-amber-200 to-teal-400 group-hover:scale-105 transition-transform">
                    <div className="bg-gray-900 p-1.5 rounded-full overflow-hidden flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 border border-gray-800">
                        {settings.clubLogoUrl ? (
                            <img src={settings.clubLogoUrl} alt="Club Logo" className="h-full w-full object-contain" />
                        ) : (
                            <svg className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        )}
                    </div>
                </div>
                <div className="ml-3 sm:ml-4">
                    <h1 className="text-lg sm:text-2xl font-black text-white tracking-tighter uppercase leading-none">{settings.appName}</h1>
                    <p className="text-[7px] sm:text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1 hidden xs:block">by Rotaract Club of RSCOE</p>
                </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8">
                <nav className="hidden md:flex items-center space-x-6">
                    <button 
                        onClick={() => setCurrentPage('home')}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentPage === 'home' ? 'text-teal-400 border-b-2 border-teal-500 pb-1' : 'text-gray-400 hover:text-white'} transition-all`}
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => setCurrentPage('about')}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentPage === 'about' ? 'text-teal-400 border-b-2 border-teal-500 pb-1' : 'text-gray-400 hover:text-white'} transition-all`}
                    >
                        About
                    </button>
                    {currentUser && (
                        <>
                            <button 
                                onClick={() => setCurrentPage('leaderboard')}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentPage === 'leaderboard' ? 'text-teal-400 border-b-2 border-teal-500 pb-1' : 'text-gray-400 hover:text-white'} transition-all`}
                            >
                                Leaderboard
                            </button>
                            <button 
                                onClick={() => setCurrentPage('dashboard')}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentPage === 'dashboard' ? 'text-teal-400 border-b-2 border-teal-500 pb-1' : 'text-gray-400 hover:text-white'} transition-all`}
                            >
                                Portal
                            </button>
                        </>
                    )}
                </nav>

                <div className="h-8 w-px bg-gray-700 hidden sm:block"></div>

                {isInstallable && (
                    <button
                        onClick={handleInstallClick}
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all animate-pulse"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span className="hidden sm:inline">Install App</span>
                        <span className="sm:hidden">Install</span>
                    </button>
                )}

                {currentUser ? (
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Impact Level</p>
                            <p className="text-xs font-black text-white">{currentUser.name}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded-lg text-xs font-bold transition-all border border-gray-600 hover:border-rose-500/30"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setCurrentPage('login')}
                        className="px-4 sm:px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-900/20"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
