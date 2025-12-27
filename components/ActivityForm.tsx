import React, { useState } from 'react';
import { useClubData } from '../hooks/useClubData';
import { ActivityType } from '../types';
import { ACTIVITY_POINTS } from '../constants';
import Card from './common/Card';

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
        <Card title="Report a New Activity">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="activityType" className="block text-sm font-medium text-gray-300">Activity Type</label>
                    <select
                        id="activityType"
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value as ActivityType)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                    >
                        {Object.values(ActivityType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea
                        id="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
                        placeholder="e.g., Volunteered at the annual book drive"
                    />
                </div>
                
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date of Activity</label>
                     <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full shadow-sm sm:text-sm bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button type="submit" className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200">
                        Submit for Approval
                    </button>
                </div>
                {message && <p className="text-center text-green-400 font-semibold">{message}</p>}
            </form>
        </Card>
    );
};

export default ActivityForm;
