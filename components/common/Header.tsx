
import React, { useState, useEffect } from 'react';
import { useClubData } from '../../hooks/useClubData';

const Header: React.FC = () => {
    const { currentUser, logout, settings, setCurrentPage, currentPage } = useClubData();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const checkStandalone = () => {
            const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
            setIsStandalone(isStandaloneMode);
        };
        checkStandalone();

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', () => {
            setIsInstallable(false);
            setIsStandalone(true);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    const handleLogoClick = () => {
        if (currentPage === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setCurrentPage('home');
            // Small delay to allow page transition before scrolling if needed
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        }
    };

    return (
        <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 h-20 sticky top-0 z-50 flex items-center justify-between px-4 lg:px-12 transition-all">
            <div 
                className="flex items-center cursor-pointer group" 
                onClick={handleLogoClick}
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
                    <h1 className="text-xl sm:text-3xl font-black text-white tracking-tighter uppercase leading-none">ACTRA</h1>
                    <p className="text-[7px] sm:text-[9px] text-teal-400 font-black uppercase tracking-[0.2em] mt-1 hidden xs:block">BY ROTARACT CLUB OF RSCOE</p>
                </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
                <nav className="hidden lg:flex items-center space-x-6 mr-4">
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

                <div className="flex items-center space-x-2 sm:space-x-3">
                    {isInstallable && !isStandalone && (
                        <button
                            onClick={handleInstallClick}
                            className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-gray-950 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-teal-500/20 active:scale-95 animate-pulse"
                            title="Install Actra App"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="hidden xs:inline">Install</span>
                        </button>
                    )}

                    {currentUser ? (
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Active Member</p>
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
                            className="px-4 sm:px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-900/20 border border-teal-500/50"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
