
import React from 'react';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';

const ZoneIndicator: React.FC<{ zone: 'green' | 'orange' | 'red' }> = ({ zone }) => {
    const zoneClasses = {
        green: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]',
        orange: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]',
        red: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]',
    };
    return <span className={`w-2.5 h-2.5 rounded-full ${zoneClasses[zone]} mr-3 flex-shrink-0`}></span>;
};

const Leaderboard: React.FC = () => {
    const { memberStats } = useClubData();

    return (
        <Card title="Club Rankings">
            <div className="space-y-2">
                {memberStats.map((member, index) => (
                    <div key={member.userId} className="group flex items-center justify-between p-3 bg-gray-800/40 hover:bg-gray-700/50 rounded-xl border border-transparent hover:border-gray-700 transition-all">
                        <div className="flex items-center">
                            <span className={`font-black text-[10px] w-5 text-center mr-2 ${index < 3 ? 'text-teal-400' : 'text-gray-600'}`}>
                                {index + 1}
                            </span>
                            <ZoneIndicator zone={member.zone} />
                            <p className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{member.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-teal-400 text-sm">{member.totalPoints} <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">pts</span></p>
                        </div>
                    </div>
                ))}
                {memberStats.length === 0 && <p className="text-center py-6 text-gray-500 italic text-sm">No member statistics available.</p>}
            </div>
            <div className="mt-6 flex items-center justify-around text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 pt-4 border-t border-gray-700/50">
                <div className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span> Elite</div>
                <div className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span> Rising</div>
                <div className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span> Inactive</div>
            </div>
        </Card>
    );
};

export default Leaderboard;
