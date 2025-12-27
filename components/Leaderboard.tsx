
import React from 'react';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';

const Leaderboard: React.FC = () => {
    const { memberStats } = useClubData();

    return (
        <Card title="Engagement Standings">
            <div className="space-y-3">
                {memberStats.map((member, index) => (
                    <div key={member.userId} className={`flex items-center justify-between p-4 rounded-xl border border-gray-700/50 transition-all ${
                        index === 0 ? 'bg-amber-400/5 border-amber-400/20' : 
                        index === 1 ? 'bg-gray-300/5 border-gray-300/20' :
                        index === 2 ? 'bg-amber-700/5 border-amber-700/20' :
                        'bg-gray-900/40'
                    }`}>
                        <div className="flex items-center">
                            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black mr-3 ${
                                index === 0 ? 'bg-amber-400 text-gray-900' :
                                index === 1 ? 'bg-gray-300 text-gray-900' :
                                index === 2 ? 'bg-amber-700 text-white' :
                                'bg-gray-700 text-gray-400'
                            }`}>
                                {index + 1}
                            </span>
                            <p className="text-sm font-bold text-gray-200">{member.name}</p>
                        </div>
                        <p className="font-black text-teal-400 text-sm">
                            {member.totalPoints} 
                            <span className="text-[10px] text-gray-600 font-black ml-1 uppercase">Pts</span>
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-center space-x-4 text-[9px] font-black uppercase text-gray-600 tracking-widest">
                <div className="flex items-center"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-1.5"></span> Gold</div>
                <div className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-1.5"></span> Silver</div>
                <div className="flex items-center"><span className="w-1.5 h-1.5 bg-amber-700 rounded-full mr-1.5"></span> Bronze</div>
            </div>
        </Card>
    );
};

export default Leaderboard;
