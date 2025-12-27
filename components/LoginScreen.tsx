import React, { useState } from 'react';
import { useClubData } from '../hooks/useClubData';

const LoginScreen: React.FC = () => {
    const { users, login } = useClubData();
    const [selectedUserId, setSelectedUserId] = useState<string>(users.length > 0 ? users[0].id : '');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

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
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Rotaract Club Login</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="user-select" className="block text-sm font-medium text-gray-300">Select User</label>
                        <select
                            id="user-select"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full mt-1 p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        >
                            <option value="" disabled>-- Select your profile --</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} {user.role === 'admin' ? '(President)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="password-input" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Default is '123'"
                            className="w-full mt-1 p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                    </div>
                    {error && <p className="text-sm text-rose-400 text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
