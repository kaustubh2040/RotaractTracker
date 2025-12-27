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
                <p>No pending approvals at the moment.</p>
            ) : (
                <div className="space-y-4">
                    {pendingActivities.map(activity => (
                        <div key={activity.id} className="p-4 border border-gray-700 rounded-lg bg-gray-700/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-white">{activity.userName}</p>
                                    <p className="text-sm text-gray-300">{activity.type}</p>
                                    <p className="mt-1">{activity.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">Submitted on: {new Date(activity.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0 ml-4">
                                    <button onClick={() => updateActivityStatus(activity.id, ActivityStatus.APPROVED)} className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition">Approve</button>
                                    <button onClick={() => updateActivityStatus(activity.id, ActivityStatus.REJECTED)} className="px-3 py-1 bg-rose-600 text-white text-sm font-semibold rounded-md hover:bg-rose-700 transition">Reject</button>
                                </div>
                            </div>
                             <div className="mt-3 pt-3 border-t border-gray-600">
                                <button
                                    onClick={() => handleGenerateMessage(activity)}
                                    disabled={generatingMessageId === activity.id}
                                    className="text-sm text-teal-400 hover:text-teal-300 font-semibold disabled:opacity-50 disabled:cursor-wait flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" transform="rotate(45 10 10)" /></svg>
                                    {generatingMessageId === activity.id ? 'Generating...' : 'Suggest Appreciation Message'}
                                </button>
                                {generatedMessage && generatingMessageId !== activity.id && (
                                    <div className="mt-2 p-3 bg-teal-900/50 text-teal-200 border border-teal-800 rounded-md text-sm">
                                        <p><strong className="text-teal-300">Suggestion:</strong> {generatedMessage}</p>
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
