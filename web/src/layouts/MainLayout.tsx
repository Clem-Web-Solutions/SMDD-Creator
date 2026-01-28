import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import { ChangePasswordModal } from '../components/ChangePasswordModal';

export function MainLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    useEffect(() => {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                if (userInfo.mustChangePassword) {
                    setShowChangePasswordModal(true);
                }
            } catch (error) {
                console.error('Error parsing user info:', error);
            }
        }
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans text-slate-900 dark:text-slate-200 relative">
            {showChangePasswordModal && (
                <ChangePasswordModal onSuccess={() => setShowChangePasswordModal(false)} />
            )}
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <div className={`flex flex-col min-h-screen transition-all duration-300 lg:ml-72 ml-0`}>
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
