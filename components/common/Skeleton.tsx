import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-800/60 rounded-xl ${className}`}></div>
);

export const SkeletonCard: React.FC = () => (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-3xl overflow-hidden p-6 space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full mt-4" />
    </div>
);