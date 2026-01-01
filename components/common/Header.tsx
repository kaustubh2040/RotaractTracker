import React, { useState, useEffect } from 'react';
import { useClubData } from '../../hooks/useClubData';

const Header: React.FC = () => {
    const { currentUser, logout, settings, setCurrentPage, currentPage } = useClubData();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setIsMobileMenuOpen(false);
        if (currentPage === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setCurrentPage('home');
        }
    };

    const navigateTo = (page: any) => {
        setCurrentPage(page);
        setIsMobileMenuOpen(false);
    };

    // Close menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    return (
        <>
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
                        <button 
                            onClick={() => setCurrentPage('contact')}
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentPage === 'contact' ? 'text-teal-400 border-b-2 border-teal-500 pb-1' : 'text-gray-400 hover:text-white'} transition-all`}
                        >
                            Contact
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
                                    className="hidden lg:block px-3 sm:px-4 py-2 bg-gray-700 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded-lg text-xs font-bold transition-all border border-gray-600 hover:border-rose-500/30"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setCurrentPage('login')}
                                className="hidden lg:block px-4 sm:px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-900/20 border border-teal-500/50"
                            >
                                Sign In
                            </button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-400 hover:text-teal-400 transition-colors z-50 relative"
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer & Overlay */}
            <div 
                className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}
            >
                {/* Backdrop Overlay */}
                <div 
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Right-aligned Drawer Pane */}
                <div 
                    className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-l border-gray-800 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex flex-col h-full pt-24 px-8 pb-12 overflow-y-auto">
                        <div className="mb-12 border-b border-gray-800 pb-8">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-2">Navigation</h2>
                            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Rotaract Club of RSCOE</p>
                        </div>

                        <nav className="flex flex-col space-y-2">
                            <button 
                                onClick={() => navigateTo('home')}
                                className={`flex items-center space-x-4 py-4 px-4 rounded-2xl transition-all ${currentPage === 'home' ? 'bg-teal-500/10 text-teal-400' : 'text-white hover:bg-gray-800'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                <span className="text-lg font-black uppercase tracking-widest">Home</span>
                            </button>
                            <button 
                                onClick={() => navigateTo('about')}
                                className={`flex items-center space-x-4 py-4 px-4 rounded-2xl transition-all ${currentPage === 'about' ? 'bg-teal-500/10 text-teal-400' : 'text-white hover:bg-gray-800'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-lg font-black uppercase tracking-widest">About</span>
                            </button>
                            <button 
                                onClick={() => navigateTo('contact')}
                                className={`flex items-center space-x-4 py-4 px-4 rounded-2xl transition-all ${currentPage === 'contact' ? 'bg-teal-500/10 text-teal-400' : 'text-white hover:bg-gray-800'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                <span className="text-lg font-black uppercase tracking-widest">Contact</span>
                            </button>
                            
                            {currentUser && (
                                <>
                                    <div className="h-px bg-gray-800 my-4"></div>
                                    <button 
                                        onClick={() => navigateTo('leaderboard')}
                                        className={`flex items-center space-x-4 py-4 px-4 rounded-2xl transition-all ${currentPage === 'leaderboard' ? 'bg-teal-500/10 text-teal-400' : 'text-white hover:bg-gray-800'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                        <span className="text-lg font-black uppercase tracking-widest">Leaderboard</span>
                                    </button>
                                    <button 
                                        onClick={() => navigateTo('dashboard')}
                                        className={`flex items-center space-x-4 py-4 px-4 rounded-2xl transition-all ${currentPage === 'dashboard' ? 'bg-teal-500/10 text-teal-400' : 'text-white hover:bg-gray-800'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        <span className="text-lg font-black uppercase tracking-widest">Portal</span>
                                    </button>
                                </>
                            )}
                        </nav>

                        <div className="mt-auto pt-12">
                            {currentUser ? (
                                <button 
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                    className="w-full flex items-center justify-center space-x-3 py-5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all active:scale-95"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    <span>Sign Out</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={() => navigateTo('login')}
                                    className="w-full py-5 bg-teal-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-teal-900/40 transition-all active:scale-95"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;