import React from 'react';
import { useClubData } from '../../hooks/useClubData';

const Header: React.FC = () => {
    const { currentUser, logout } = useClubData();

    return (
        <header className="bg-gray-800 shadow-lg border-b border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <svg className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 000 5.292" />
                        </svg>
                        <h1 className="text-xl font-bold text-white ml-2">Rotaract Activity Tracker</h1>
                    </div>
                    {currentUser && (
                        <div className="flex items-center">
                            <span className="text-gray-300 mr-4 hidden sm:block">
                                Welcome, <span className="font-semibold text-white">{currentUser.name}</span>
                            </span>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
