
import React from 'react';
import { useClubData } from '../../hooks/useClubData';

const Header: React.FC = () => {
    const { currentUser, logout } = useClubData();

    return (
        <header className="bg-gray-800 border-b border-gray-700 h-16 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
            <div className="flex items-center">
                <svg className="h-8 w-8 text-teal-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 000 5.292" />
                </svg>
                <h1 className="text-lg font-bold text-white hidden md:block">Rotaract Tracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest leading-none">Logged as</p>
                    <p className="text-sm font-semibold text-white">{currentUser?.name}</p>
                </div>
                <button
                    onClick={logout}
                    className="p-2 bg-gray-700 hover:bg-rose-600/20 text-gray-300 hover:text-rose-400 rounded-lg transition-all duration-200"
                    title="Sign Out"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
