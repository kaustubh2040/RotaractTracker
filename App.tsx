
import React from 'react';
import AdminDashboard from './components/AdminDashboard';
import MemberDashboard from './components/MemberDashboard';
import Header from './components/common/Header';
import { ClubDataProvider, ClubDataContext } from './hooks/useClubData';
import LoginScreen from './components/LoginScreen';

const AppContent: React.FC = () => {
    const { currentUser, loading } = React.useContext(ClubDataContext);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                <p className="text-gray-400 font-medium">Syncing with database...</p>
            </div>
        );
    }

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
