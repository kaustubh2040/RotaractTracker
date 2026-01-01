import React, { useState } from 'react';
import { useClubData } from '../hooks/useClubData';

const LoginScreen: React.FC = () => {
    const { users, login, settings } = useClubData();
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
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
            setError('Invalid access pin. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
            <div className="p-8 bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 transition-all duration-500 hover:shadow-teal-500/5">
                <div className="flex flex-col items-center mb-8">
                    {settings.clubLogoUrl ? (
                        <img src={settings.clubLogoUrl} alt="Club Logo" className="h-24 w-24 object-contain mb-6 rounded-xl shadow-lg border border-gray-700 p-2 bg-gray-900/50 transition-transform duration-500 hover:scale-110" />
                    ) : (
                        <div className="bg-teal-500/10 p-4 rounded-full mb-4 ring-1 ring-teal-500/30 transition-all duration-300 hover:scale-110">
                            <svg className="h-12 w-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 000 5.292" />
                            </svg>
                        </div>
                    )}
                    <h1 className="text-3xl font-extrabold text-white text-center tracking-tight uppercase transition-all duration-500 hover:tracking-tighter">Rotaract Tracker</h1>
                    <p className="text-gray-400 text-sm mt-2 text-center italic">Engagement & Activity Management</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="group">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 ml-1 transition-colors group-focus-within:text-teal-400">Member Profile</label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full p-4 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                        >
                            <option value="">Choose a profile...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} {user.role === 'admin' ? '(President)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 ml-1 transition-colors group-focus-within:text-teal-400">Access Pin</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full p-4 pr-12 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none placeholder-gray-500 font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-400 transition-all active:scale-90"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-sm text-rose-400 text-center font-semibold animate-pulse">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-teal-900/40 hover:shadow-teal-500/20"
                    >
                        Sign In
                    </button>
                </form>
            </div>
            
            <footer className="mt-12 text-center text-gray-500 text-sm opacity-60 hover:opacity-100 transition-opacity duration-300">
                <p>&copy; 2025 &bull; Built by <span className="text-teal-400 font-semibold">Kaustubh Patil</span> &bull; All rights reserved</p>
            </footer>
        </div>
    );
};

export default LoginScreen;