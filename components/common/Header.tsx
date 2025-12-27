
import React from 'react';
import { useClubData } from '../../hooks/useClubData';

const Header: React.FC = () => {
    const { currentUser, logout } = useClubData();

    return (
        <header className="bg-gray-800 border-b border-gray-700 h-16 sticky top-0 z-50 flex items-center justify-between px-6">
            <div className="flex items-center cursor-pointer" onClick={() => window.location.reload()}>
                <div className="bg-teal-600/20 p-2 rounded-lg mr-3">
                    <svg className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h1 className="text-lg font-black text-white tracking-tighter uppercase">Rotaract</h1>
            </div>
            
            <div className="flex items-center space-x-6">
                <div className="hidden sm:block text-right">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Authenticated</p>
                    <p className="text-sm font-black text-white">{currentUser?.name}</p>
                </div>
                <button
                    onClick={logout}
                    className="p-2.5 bg-gray-700 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded-xl transition-all"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
