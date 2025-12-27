
import React from 'react';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';
import { ActivityStatus } from '../types';

const PendingApprovals: React.FC = () => {
    const { activities, updateActivityStatus } = useClubData();
    const pending = activities.filter(a => a.status === ActivityStatus.PENDING);

    return (
        <Card title="Pending Review">
            {pending.length === 0 ? <p className="text-center py-12 text-gray-500 italic">No pending logs found.</p> : (
                <div className="space-y-4">
                    {pending.map(act => (
                        <div key={act.id} className="p-5 bg-gray-800 border border-gray-700 rounded-2xl flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-white text-lg">{act.userName}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded">{act.type}</span>
                                    <span className="text-[10px] text-gray-500">Event Date: {new Date(act.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-2 italic">"{act.description}"</p>
                                <p className="text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-wider border-t border-gray-700/50 pt-2">
                                    Submitted on: <span className="text-teal-500/60">{new Date(act.submittedAt).toLocaleDateString()}</span>
                                </p>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <button onClick={() => updateActivityStatus(act.id, ActivityStatus.APPROVED)} className="px-5 py-2 bg-green-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-green-900/20">Approve</button>
                                <button onClick={() => updateActivityStatus(act.id, ActivityStatus.REJECTED)} className="px-5 py-2 bg-gray-700 text-red-400 rounded-xl text-xs font-bold border border-red-500/20">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default PendingApprovals;
