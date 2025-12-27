
import React, { useState, useEffect } from 'react';
import { useClubData } from '../hooks/useClubData';

const LoginScreen: React.FC = () => {
    const { users, login } = useClubData();
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!selectedUserId) {
            setError('Please choose a profile.');
            return;
        }
        if (!password) {
            setError('Please enter your password.');
            return;
        }
        const success = login(selectedUserId, password);
        if (!success) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
            <div className="p-8 bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-teal-500/10 p-4 rounded-full mb-4 ring-1 ring-teal-500/30">
                        <svg className="h-12 w-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 000 5.292" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white text-center tracking-tight">Rotaract Tracker</h1>
                    <p className="text-gray-400 text-sm mt-2 text-center">Engagement & Activity Management System</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="user-select" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 ml-1">Member Profile</label>
                        <select
                            id="user-select"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full p-4 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                        >
                            <option value="">Choose a profile...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} {user.role === 'admin' ? '(President)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="password-input" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 ml-1">Access Pin</label>
                        <input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full p-4 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none placeholder-gray-500"
                        />
                    </div>
                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                            <p className="text-sm text-rose-400 text-center font-semibold">{error}</p>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-4 px-6 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transform active:scale-[0.98] transition-all duration-200 shadow-xl shadow-teal-900/40"
                    >
                        Sign In
                    </button>
                </form>
            </div>
            
            <footer className="mt-12 text-center text-gray-500 text-sm">
                <p>&copy; 2025 &bull; Built by <span className="text-teal-400 font-semibold">Kaustubh Patil</span> &bull; All rights reserved</p>
                <div className="mt-2 flex items-center justify-center space-x-2 text-xs opacity-50">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>Secure Cloud Instance Connected</span>
                </div>
            </footer>
        </div>
    );
};

export default LoginScreen;
