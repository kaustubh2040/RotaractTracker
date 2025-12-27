
import React, { useState } from 'react';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';
import { ActivityStatus, Activity } from '../types';
import { generateAppreciationMessage } from '../services/geminiService';

const PendingApprovals: React.FC = () => {
    const { activities, updateActivityStatus } = useClubData();
    const pendingActivities = activities.filter(a => a.status === ActivityStatus.PENDING);
    
    const [generatingMessageId, setGeneratingMessageId] = useState<string | null>(null);
    const [generatedMessage, setGeneratedMessage] = useState<string>('');

    const handleGenerateMessage = async (activity: Activity) => {
        setGeneratingMessageId(activity.id);
        setGeneratedMessage('');
        const message = await generateAppreciationMessage(activity);
        setGeneratedMessage(message);
        setGeneratingMessageId(null);
    };

    return (
        <Card title="Pending Approvals">
            {pendingActivities.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-gray-700/30 inline-block p-4 rounded-full mb-3">
                        <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium">All caught up! No pending logs.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingActivities.map(activity => (
                        <div key={activity.id} className="p-5 border border-gray-700 rounded-2xl bg-gray-800 shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h4 className="font-black text-white text-lg tracking-tight">{activity.userName}</h4>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded uppercase">
                                            {activity.type}
                                        </span>
                                        <span className="text-xs text-gray-500 font-semibold italic">
                                            Event Date: {new Date(activity.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-2 leading-relaxed">{activity.description}</p>
                                    <div className="flex items-center mt-3 pt-3 border-t border-gray-700/50">
                                        <svg className="h-3 w-3 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                            Submitted on: <span className="text-gray-400">{new Date(activity.submittedAt).toLocaleDateString()}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <button 
                                        onClick={() => updateActivityStatus(activity.id, ActivityStatus.APPROVED)} 
                                        className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-500 transition shadow-lg shadow-green-900/20"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => updateActivityStatus(activity.id, ActivityStatus.REJECTED)} 
                                        className="px-4 py-2 bg-gray-700 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl hover:bg-rose-500/10 transition"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                             <div className="mt-2 pt-4 border-t border-gray-700/50">
                                <button
                                    onClick={() => handleGenerateMessage(activity)}
                                    disabled={generatingMessageId === activity.id}
                                    className="text-xs text-teal-400 hover:text-teal-300 font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-wait flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    {generatingMessageId === activity.id ? 'Thinking...' : 'AI Appreciation Suggestion'}
                                </button>
                                {generatedMessage && generatingMessageId !== activity.id && (
                                    <div className="mt-3 p-4 bg-teal-500/5 text-teal-100 border border-teal-500/20 rounded-xl text-sm italic leading-relaxed">
                                        {generatedMessage}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default PendingApprovals;
