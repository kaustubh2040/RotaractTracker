
import React, { useState, useEffect } from 'react';
import { useClubData } from '../hooks/useClubData';

const LoginScreen: React.FC = () => {
    const { users, login } = useClubData();
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Update selection once users are loaded from Supabase
    useEffect(() => {
        if (users.length > 0 && !selectedUserId) {
            setSelectedUserId(users[0].id);
        }
    }, [users, selectedUserId]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!selectedUserId) {
            setError('Please select a user.');
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
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="p-8 bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm mx-auto border border-gray-700">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-teal-500/10 p-3 rounded-full mb-3">
                        <svg className="h-10 w-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 000 5.292" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white text-center">Rotaract Club Tracker</h1>
                    <p className="text-gray-400 text-sm mt-1">Please log in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="user-select" className="block text-sm font-medium text-gray-400 mb-1 ml-1">Profile</label>
                        <select
                            id="user-select"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none"
                        >
                            {users.length === 0 && <option value="">Loading users...</option>}
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} {user.role === 'admin' ? '(President)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="password-input" className="block text-sm font-medium text-gray-400 mb-1 ml-1">Password</label>
                        <input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Try '123'"
                            className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none placeholder-gray-500"
                        />
                    </div>
                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                            <p className="text-sm text-rose-400 text-center font-medium">{error}</p>
                        </div>
                    )}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 active:scale-95 transition duration-200 shadow-lg shadow-teal-900/20"
                        >
                            Login
                        </button>
                    </div>
                </form>
                
                <p className="mt-8 text-center text-xs text-gray-500">
                    Secure Database Connected • Supabase Cloud
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
