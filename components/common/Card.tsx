import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-teal-500/5 ${className}`}>
            <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-3">{title}</h2>
                <div className="text-gray-300">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Card;