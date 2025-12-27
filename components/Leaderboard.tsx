import React from 'react';
import { useClubData } from '../hooks/useClubData';
import Card from './common/Card';

const ZoneIndicator: React.FC<{ zone: 'green' | 'yellow' | 'red' }> = ({ zone }) => {
    const zoneClasses = {
        green: 'bg-green-500',
        yellow: 'bg-yellow-400',
        red: 'bg-red-500',
    };
    return <span className={`w-3 h-3 rounded-full ${zoneClasses[zone]} mr-3`}></span>;
};

const Leaderboard: React.FC = () => {
    const { memberStats } = useClubData();

    return (
        <Card title="Weekly Leaderboard">
            <div className="space-y-3">
                {memberStats.map((member, index) => (
                    <div key={member.userId} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md">
                        <div className="flex items-center">
                            <span className="font-bold text-gray-400 w-6 text-center">{index + 1}</span>
                            <ZoneIndicator zone={member.zone} />
                            <p className="font-semibold text-gray-100">{member.name}</p>
                        </div>
                        <p className="font-bold text-teal-400">{member.totalPoints} pts</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default Leaderboard;
