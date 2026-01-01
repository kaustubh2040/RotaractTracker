import React, { useState } from 'react';
import { useClubData } from '../hooks/useClubData';
import type { User } from '../types';
import Card from './common/Card';
import { BOD_POSITIONS } from '../constants';
import ImageUploadField from './common/ImageUploadField';
import Reveal from './common/Reveal';

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
        <form onSubmit={handleSubmit} className="p-4 mb-6 bg-gray-700/50 border border-gray-700 rounded-lg transition-all hover:border-teal-500/20">
            <h3 className="text-lg font-semibold text-white mb-3">Add New Member</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Member Name"
                    className="p-3 bg-gray-700 border-gray-600 text-white rounded-md outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Access Pass"
                    className="p-3 bg-gray-700 border-gray-600 text-white rounded-md outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                />
            </div>
            {error && <p className="text-sm text-rose-400 mb-2">{error}</p>}
            <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-teal-600 text-white text-sm font-bold rounded-md shadow-lg shadow-teal-900/20 active:scale-95 transition-all">Add Member</button>
        </form>
    );
};


const MemberManagement: React.FC = () => {
    const { users, updateMember, deleteMember, currentUser } = useClubData();
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [formState, setFormState] = useState<{name: string, password?: string, positions: string[], photoUrl?: string}>({ name: '', positions: [] });
    
    const sortedUsers = [...users].sort((a,b) => {
        if(a.role === 'admin') return -1;
        if(b.role === 'admin') return 1;
        return a.name.localeCompare(b.name);
    });

    const handleRoleToggle = (role: string) => {
        setFormState(prev => {
            const current = prev.positions || [];
            if (current.includes(role)) {
                return { ...prev, positions: current.filter(r => r !== role) };
            }
            if (current.length >= 2) {
                alert('A member can hold at most 2 BOD positions.');
                return prev;
            }
            return { ...prev, positions: [...current, role] };
        });
    };

    const handleEdit = (member: User) => {
        setEditingMemberId(member.id);
        setFormState({ 
            name: member.name, 
            positions: member.positions || [],
            photoUrl: member.photoUrl || ''
        });
    };

    const handleCancel = () => {
        setEditingMemberId(null);
        setFormState({ name: '', positions: [] });
    };

    const handleSave = (memberId: string) => {
        if (!formState.name.trim()) return alert("Name is required.");
        updateMember(memberId, formState);
        handleCancel();
    };

    const handleDelete = (member: User) => {
        if (window.confirm(`Delete ${member.name}?`)) deleteMember(member.id);
    }

    return (
        <Card title="Club Roster Management">
            <AddMemberForm />
            <div className="space-y-4">
                {sortedUsers.map((member, idx) => (
                    <Reveal key={member.id} delay={idx * 50}>
                        <div className="p-5 border border-gray-700 rounded-2xl bg-gray-800/50 transition-all hover:border-teal-500/20 group">
                            {editingMemberId === member.id ? (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={formState.name}
                                            onChange={e => setFormState({...formState, name: e.target.value})}
                                            className="p-3 bg-gray-700 border-gray-600 text-white rounded-xl outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                                            placeholder="Name"
                                        />
                                        <input
                                            type="password"
                                            value={formState.password || ''}
                                            onChange={e => setFormState({...formState, password: e.target.value})}
                                            placeholder="New Pass (optional)"
                                            className="p-3 bg-gray-700 border-gray-600 text-white rounded-xl outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                                        />
                                    </div>
                                    
                                    <ImageUploadField 
                                        label="Member Photo"
                                        value={formState.photoUrl || ''}
                                        onChange={url => setFormState({...formState, photoUrl: url})}
                                        folder="profiles"
                                    />

                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest ml-1">Assign BOD Positions (Max 2)</p>
                                        <div className="flex flex-wrap gap-2 h-40 overflow-y-auto p-4 bg-gray-900 rounded-xl border border-gray-700 scrollbar-hide">
                                            {BOD_POSITIONS.map(role => (
                                                <button 
                                                    key={role}
                                                    onClick={() => handleRoleToggle(role)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-black transition-all border active:scale-90 ${
                                                        formState.positions.includes(role) 
                                                            ? 'bg-teal-500 text-gray-950 border-teal-500 shadow-lg shadow-teal-500/20' 
                                                            : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-500'
                                                    }`}
                                                >
                                                    {role}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button onClick={handleCancel} className="px-4 py-2 text-gray-400 font-bold uppercase text-xs active:scale-95 transition-all">Cancel</button>
                                        <button onClick={() => handleSave(member.id)} className="px-6 py-2 bg-teal-600 text-white font-black uppercase text-xs rounded-xl shadow-lg active:scale-95 transition-all">Save Record</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-gray-900 rounded-full border border-gray-700 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                                            {member.photoUrl ? <img src={member.photoUrl} className="w-full h-full object-cover" /> : null}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white uppercase tracking-tight group-hover:text-teal-400 transition-colors">{member.name}</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {member.positions?.map(p => (
                                                    <span key={p} className="text-[8px] bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded-full border border-teal-500/20 font-black uppercase tracking-widest transition-all group-hover:bg-teal-500/20">{p}</span>
                                                ))}
                                                {(!member.positions || member.positions.length === 0) && <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Active Member</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(member)} className="text-teal-400 p-2 hover:bg-teal-400/10 rounded-lg active:scale-90 transition-all">Edit</button>
                                        {member.id !== currentUser?.id && member.role !== 'admin' && (
                                            <button onClick={() => handleDelete(member)} className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-lg active:scale-90 transition-all">Delete</button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Reveal>
                ))}
            </div>
        </Card>
    );
};

export default MemberManagement;