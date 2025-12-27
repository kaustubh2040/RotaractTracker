
import React from 'react';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';

const Leaderboard: React.FC = () => {
    const { memberStats } = useClubData();

    return (
        <Card title="Member Standings">
            <div className="space-y-2">
                {memberStats.map((member, index) => (
                    <div key={member.userId} className="flex items-center justify-between p-3 bg-gray-900/40 rounded-xl border border-transparent hover:border-gray-700 transition-all">
                        <div className="flex items-center">
                            <span className={`w-5 text-[10px] font-black mr-2 ${index < 3 ? 'text-teal-400' : 'text-gray-600'}`}>{index + 1}</span>
                            <span className={`w-2 h-2 rounded-full mr-3 ${
                                member.zone === 'green' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                member.zone === 'orange' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' :
                                'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                            }`}></span>
                            <p className="text-sm font-bold text-gray-200">{member.name}</p>
                        </div>
                        <p className="font-black text-teal-400 text-sm">{member.totalPoints} <span className="text-[10px] text-gray-600">pts</span></p>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-around text-[9px] font-black uppercase text-gray-600 tracking-widest">
                <div className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> Elite</div>
                <div className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></span> Rising</div>
                <div className="flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span> Inactive</div>
            </div>
        </Card>
    );
};

export default Leaderboard;
