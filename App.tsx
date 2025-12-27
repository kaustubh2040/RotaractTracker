import React, { useState, useMemo } from 'react';
import AdminDashboard from './components/AdminDashboard';
import MemberDashboard from './components/MemberDashboard';
import Header from './components/common/Header';
import { useClubData, ClubDataProvider, ClubDataContext } from './hooks/useClubData';
import type { User } from './types';
import LoginScreen from './components/LoginScreen';

const AppContent: React.FC = () => {
    const { currentUser } = React.useContext(ClubDataContext);

    if (!currentUser) {
        return <LoginScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8">
                {currentUser.role === 'admin' ? <AdminDashboard /> : <MemberDashboard />}
            </main>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <ClubDataProvider>
            <AppContent />
        </ClubDataProvider>
    );
};

export default App;
