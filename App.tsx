
import React from 'react';
import AdminDashboard from './components/AdminDashboard';
import MemberDashboard from './components/MemberDashboard';
import Header from './components/common/Header';
import { ClubDataProvider, ClubDataContext } from './hooks/useClubData';
import LoginScreen from './components/LoginScreen';
import HomePage from './components/HomePage';

const AppContent: React.FC = () => {
    const { currentUser, loading, currentPage } = React.useContext(ClubDataContext);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                <p className="text-gray-400 font-medium tracking-widest uppercase text-[10px]">Synchronizing Actra...</p>
            </div>
        );
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return <LoginScreen />;
            case 'dashboard':
                if (!currentUser) return <LoginScreen />;
                return currentUser.role === 'admin' ? <AdminDashboard /> : <MemberDashboard />;
            case 'home':
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            <main className={currentPage !== 'home' ? 'p-4 sm:p-6 lg:p-12' : ''}>
                {renderPage()}
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
