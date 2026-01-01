import React from 'react';
import { useClubData } from '../hooks/useClubData';
import Reveal from './common/Reveal';
import { Skeleton } from './common/Skeleton';

const LeaderboardPage: React.FC = () => {
    const { memberStats, loading } = useClubData();

    return (
        <div className="animate-fadeIn min-h-[calc(100vh-5rem)] bg-gray-900 pb-24">
            <div className="relative py-24 bg-gray-800/40 border-b border-gray-800 overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <Reveal>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-4">Global Rankings</h2>
                        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                            Club <span className="text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 to-amber-200">Leaderboard</span>
                        </h1>
                        <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
                            Celebrating our top contributors and their commitment to excellence.
                        </p>
                    </Reveal>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 max-w-5xl">
                <Reveal delay={200}>
                    <div className="bg-gray-800 rounded-[2rem] border border-gray-700 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-amber-500/5">
                        <div className="p-8 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
                            <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center">
                                <svg className="w-5 h-5 mr-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                </svg>
                                The Honor Roll
                            </h3>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-900 px-4 py-1 rounded-full border border-gray-700">Live Data</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-900/50 text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-gray-700">
                                    <tr>
                                        <th className="px-8 py-5 w-24">Rank</th>
                                        <th className="px-8 py-5">Member Name</th>
                                        <th className="px-8 py-5 text-right">Impact Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {loading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <tr key={i}>
                                                <td colSpan={3} className="px-8 py-6">
                                                    <Skeleton className="h-12 w-full" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : memberStats.map((member, index) => (
                                        <tr key={member.userId} className={`group hover:bg-gray-700/30 transition-colors ${index < 3 ? 'bg-teal-500/5' : ''}`}>
                                            <td className="px-8 py-6">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg transition-all duration-300 group-hover:scale-110 ${
                                                    index === 0 ? 'bg-amber-400 text-gray-900 shadow-lg shadow-amber-400/20' :
                                                    index === 1 ? 'bg-gray-300 text-gray-900 shadow-lg shadow-gray-300/20' :
                                                    index === 2 ? 'bg-amber-700 text-white shadow-lg shadow-amber-700/20' :
                                                    'bg-gray-700 text-gray-400'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center">
                                                    <p className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors duration-300">{member.name}</p>
                                                    {index < 3 && (
                                                        <span className="ml-3 px-2 py-0.5 rounded text-[8px] font-black bg-teal-500/20 text-teal-400 uppercase tracking-widest border border-teal-500/30 animate-pulse">
                                                            Top Tier
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-2xl font-black text-teal-400 tracking-tighter group-hover:text-teal-300 transition-colors">{member.totalPoints}</span>
                                                <span className="text-[10px] text-gray-500 font-black uppercase ml-2 tracking-widest">pts</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default LeaderboardPage;