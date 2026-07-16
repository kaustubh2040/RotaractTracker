import React, { useState } from 'react';
import { SupportTicket } from '../types';

interface SupportInboxProps {
    tickets: SupportTicket[];
    updateStatus: (id: string, status: 'New' | 'In Progress' | 'Resolved') => Promise<void>;
}

const SupportInbox: React.FC<SupportInboxProps> = ({ tickets, updateStatus }) => {
    const [filter, setFilter] = useState<'All' | 'New' | 'In Progress' | 'Resolved'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Filter and search logic
    const filteredTickets = tickets
        .filter(t => {
            if (filter === 'All') return true;
            return t.status === filter;
        })
        .filter(t => {
            const query = searchQuery.toLowerCase();
            return (
                t.name.toLowerCase().includes(query) ||
                t.email.toLowerCase().includes(query) ||
                t.subject.toLowerCase().includes(query) ||
                t.message.toLowerCase().includes(query)
            );
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleStatusChange = async (id: string, status: 'New' | 'In Progress' | 'Resolved') => {
        setUpdatingId(id);
        try {
            await updateStatus(id, status);
        } catch (error) {
            console.error("Failed to update ticket status:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status: 'New' | 'In Progress' | 'Resolved') => {
        switch (status) {
            case 'New':
                return {
                    border: 'border-rose-500/30 hover:border-rose-500/50',
                    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                    dot: 'bg-rose-500'
                };
            case 'In Progress':
                return {
                    border: 'border-blue-500/30 hover:border-blue-500/50',
                    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    dot: 'bg-blue-500'
                };
            case 'Resolved':
                return {
                    border: 'border-emerald-500/30 hover:border-emerald-500/50',
                    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    dot: 'bg-emerald-500'
                };
        }
    };

    return (
        <div className="bg-gray-800/20 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Header / Stats row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 5-8-5" />
                        </svg>
                        Support Inbox
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                        View and manage context-aware user support inquiries
                    </p>
                </div>

                {/* Counter row */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-lg font-bold">
                        {tickets.filter(t => t.status === 'New').length} New
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg font-bold">
                        {tickets.filter(t => t.status === 'In Progress').length} Active
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-bold">
                        {tickets.filter(t => t.status === 'Resolved').length} Solved
                    </span>
                </div>
            </div>

            {/* Filter and Search controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Filter Tabs */}
                <div className="flex bg-gray-900/60 p-1 rounded-xl border border-gray-800 self-stretch md:self-auto">
                    {(['All', 'New', 'In Progress', 'Resolved'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`flex-1 md:flex-none px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                                filter === tab
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search Box */}
                <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search ticket content..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-900/50 text-white border border-gray-800 rounded-xl text-xs focus:outline-none focus:border-teal-500 transition-all placeholder-gray-600"
                    />
                </div>
            </div>

            {/* Ticket Stream */}
            <div className="space-y-4">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => {
                        const style = getStatusColor(ticket.status);
                        return (
                            <div
                                key={ticket.id}
                                className={`p-6 bg-gray-900/40 border ${style.border} rounded-2xl transition-all duration-300 relative group`}
                            >
                                {/* Ticket Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-white font-bold text-sm">{ticket.name}</span>
                                            <a
                                                href={`mailto:${ticket.email}`}
                                                className="text-[10px] text-gray-500 hover:text-teal-400 font-mono transition-colors"
                                                title="Send direct email reply"
                                            >
                                                &lt;{ticket.email}&gt;
                                            </a>
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                            Submitted: {new Date(ticket.createdAt).toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.badge}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                        {ticket.status}
                                    </span>
                                </div>

                                {/* Subject and Message */}
                                <div className="space-y-2 border-t border-gray-800/50 pt-4">
                                    <h4 className="text-white font-black text-sm uppercase tracking-wide">
                                        {ticket.subject}
                                    </h4>
                                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                        {ticket.message}
                                    </p>
                                </div>

                                {/* Status Transitions Footer */}
                                <div className="mt-6 pt-4 border-t border-gray-800/40 flex flex-wrap items-center justify-between gap-4">
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                                        Manage Workflow:
                                    </span>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {ticket.status !== 'New' && (
                                            <button
                                                disabled={updatingId === ticket.id}
                                                onClick={() => handleStatusChange(ticket.id, 'New')}
                                                className="px-3 py-1.5 bg-gray-800 hover:bg-rose-950/20 hover:text-rose-400 text-gray-400 border border-gray-700/60 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40"
                                            >
                                                Mark New
                                            </button>
                                        )}
                                        {ticket.status !== 'In Progress' && (
                                            <button
                                                disabled={updatingId === ticket.id}
                                                onClick={() => handleStatusChange(ticket.id, 'In Progress')}
                                                className="px-3 py-1.5 bg-gray-800 hover:bg-blue-950/20 hover:text-blue-400 text-gray-400 border border-gray-700/60 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40"
                                            >
                                                Mark In Progress
                                            </button>
                                        )}
                                        {ticket.status !== 'Resolved' && (
                                            <button
                                                disabled={updatingId === ticket.id}
                                                onClick={() => handleStatusChange(ticket.id, 'Resolved')}
                                                className="px-3 py-1.5 bg-gray-800 hover:bg-emerald-950/20 hover:text-emerald-400 text-gray-400 border border-gray-700/60 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40"
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-16 text-center border border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center space-y-3">
                        <div className="p-3 bg-teal-500/5 text-teal-500 rounded-full">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="text-gray-400 font-bold text-sm uppercase tracking-wider">
                            No support tickets found
                        </h4>
                        <p className="text-xs text-gray-600 max-w-xs mx-auto">
                            {searchQuery ? "Try widening your search terms or checking a different filter tab." : "All caught up! Excellent job keeping club members happy."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportInbox;
