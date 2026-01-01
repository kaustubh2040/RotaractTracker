import React, { useState } from 'react';
import { useClubData } from '../hooks/useClubData';
import { ActivityType } from '../types';
import { ACTIVITY_POINTS } from '../constants';
import Card from './common/Card';
import Reveal from './common/Reveal';

const ActivityForm: React.FC = () => {
    const { currentUser, addActivity } = useClubData();
    const [activityType, setActivityType] = useState<ActivityType>(ActivityType.EVENT_ATTENDANCE);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !description.trim() || !date) {
            setMessage('Please fill out all fields.');
            return;
        }

        addActivity({
            userId: currentUser.id,
            type: activityType,
            description,
            date,
            points: ACTIVITY_POINTS[activityType],
        });

        setMessage('Activity submitted for approval!');
        setDescription('');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <Reveal>
            <Card title="Report a New Activity" className="hover:shadow-teal-500/10">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="group">
                        <label htmlFor="activityType" className="block text-sm font-medium text-gray-300 group-focus-within:text-teal-400 transition-colors">Activity Type</label>
                        <select
                            id="activityType"
                            value={activityType}
                            onChange={(e) => setActivityType(e.target.value as ActivityType)}
                            className="mt-1 block w-full pl-3 pr-10 py-3 bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-xl transition-all"
                        >
                            {Object.values(ActivityType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="group">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 group-focus-within:text-teal-400 transition-colors">Description</label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full p-3 shadow-sm sm:text-sm bg-gray-700 border-gray-600 text-white rounded-xl focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all placeholder-gray-500"
                            placeholder="e.g., Volunteered at the annual book drive"
                        />
                    </div>
                    
                    <div className="group">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300 group-focus-within:text-teal-400 transition-colors">Date of Activity</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full p-3 shadow-sm sm:text-sm bg-gray-700 border-gray-600 text-white rounded-xl focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <button type="submit" className="w-full px-4 py-3 bg-teal-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-teal-500 transition-all shadow-xl shadow-teal-900/20 active:scale-95">
                            Submit for Approval
                        </button>
                    </div>
                    {message && <p className="text-center text-teal-400 font-bold uppercase text-[10px] tracking-widest mt-2 animate-bounce">{message}</p>}
                </form>
            </Card>
        </Reveal>
    );
};

export default ActivityForm;