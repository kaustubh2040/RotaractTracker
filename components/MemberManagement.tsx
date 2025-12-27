import React, { useState } from 'react';
import { useClubData } from '../hooks/useClubData';
import type { User } from '../types';
import Card from './common/Card';

const AddMemberForm: React.FC = () => {
    const { addMember } = useClubData();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !password.trim()) {
            setError('Both name and password are required.');
            return;
        }
        addMember(name, password);
        setName('');
        setPassword('');
        setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 mb-6 bg-gray-700/50 border border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Add New Member</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300">Initial Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
            </div>
            {error && <p className="text-sm text-rose-400 mb-2">{error}</p>}
            <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-md hover:bg-teal-700 transition">Add Member</button>
        </form>
    );
};


const MemberManagement: React.FC = () => {
    const { users, updateMember, deleteMember, currentUser } = useClubData();
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [formState, setFormState] = useState({ name: '', password: '' });
    
    const sortedUsers = [...users].sort((a,b) => {
        if(a.role === 'admin') return -1;
        if(b.role === 'admin') return 1;
        return a.name.localeCompare(b.name);
    });

    const handleEdit = (member: User) => {
        setEditingMemberId(member.id);
        setFormState({ name: member.name, password: '' });
    };

    const handleCancel = () => {
        setEditingMemberId(null);
        setFormState({ name: '', password: '' });
    };

    const handleSave = (memberId: string) => {
        if (!formState.name.trim()) {
            alert("Name cannot be empty.");
            return;
        }
        updateMember(memberId, formState.name, formState.password || undefined);
        handleCancel();
    };

    const handleDelete = (member: User) => {
        if (window.confirm(`Are you sure you want to delete ${member.name}? This action cannot be undone.`)) {
            deleteMember(member.id);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Card title="User Management">
            <AddMemberForm />
            <div className="space-y-4">
                {sortedUsers.map(member => (
                    <div key={member.id} className="p-4 border border-gray-700 rounded-lg bg-gray-700/50">
                        {editingMemberId === member.id ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formState.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full shadow-sm sm:text-sm bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">New Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formState.password}
                                            onChange={handleInputChange}
                                            placeholder="Leave blank to keep unchanged"
                                            className="mt-1 block w-full shadow-sm sm:text-sm bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button onClick={handleCancel} className="px-3 py-1 bg-gray-600 text-white text-sm font-semibold rounded-md hover:bg-gray-500 transition">Cancel</button>
                                    <button onClick={() => handleSave(member.id)} className="px-3 py-1 bg-teal-600 text-white text-sm font-semibold rounded-md hover:bg-teal-700 transition">Save</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-white">{member.name}</p>
                                    {member.role === 'admin' && <p className="text-xs text-teal-400 font-semibold">President</p>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => handleEdit(member)} className="px-3 py-1 bg-gray-600 text-white text-sm font-semibold rounded-md hover:bg-gray-500 transition">Edit</button>
                                    {member.id !== currentUser?.id && member.role !== 'admin' && (
                                        <button onClick={() => handleDelete(member)} className="px-3 py-1 bg-rose-600 text-white text-sm font-semibold rounded-md hover:bg-rose-700 transition">Delete</button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default MemberManagement;
