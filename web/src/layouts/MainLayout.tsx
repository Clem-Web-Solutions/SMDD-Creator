import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AvatarSuccessModal } from '../components/AvatarSuccessModal';

export function MainLayout() {
    const [user, setUser] = useState<any>(() => {
        const userInfoStr = localStorage.getItem('userInfo');
        return userInfoStr ? JSON.parse(userInfoStr) : null;
    });

    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    useEffect(() => {
        const handleUserUpdate = (event: Event) => {
            console.log("MainLayout: userDataUpdated event received");

            let updatedUser = null;
            if ((event as CustomEvent).detail) {
                console.log("MainLayout: Using detail from CustomEvent");
                updatedUser = (event as CustomEvent).detail;
            } else {
                const userInfoStr = localStorage.getItem('userInfo');
                updatedUser = userInfoStr ? JSON.parse(userInfoStr) : null;
            }

            setUser(updatedUser);

            // Auto open if avatar exists and is recent AND NOT ALREADY SEEN
            if (updatedUser?.avatar && (updatedUser.avatar.status === 'pending' || updatedUser.avatar.status === 'completed')) {
                const lastSeenVideoId = localStorage.getItem('lastSeenVideoId');

                // If it's a new video ID, or if we haven't seen it yet
                if (updatedUser.avatar.videoId !== lastSeenVideoId) {
                    console.log("MainLayout: New video detected. Opening modal.", updatedUser.avatar.videoId);
                    setIsAvatarModalOpen(true);
                }
            }
        };

        window.addEventListener('userDataUpdated', handleUserUpdate as EventListener);

        // Check on mount
        if (user?.avatar && (user.avatar.status === 'pending' || user.avatar.status === 'completed')) {
            const lastSeenVideoId = localStorage.getItem('lastSeenVideoId');
            if (user.avatar.videoId !== lastSeenVideoId) {
                console.log("MainLayout: Avatar found on mount (new), opening modal.", user.avatar.videoId);
                setIsAvatarModalOpen(true);
            }
        }

        return () => window.removeEventListener('userDataUpdated', handleUserUpdate);
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans text-slate-900 dark:text-slate-200">
            <Sidebar />
            <div className="ml-72 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
            {user?.avatar && (
                <AvatarSuccessModal
                    isOpen={isAvatarModalOpen}
                    onClose={() => {
                        setIsAvatarModalOpen(false);
                        if (user?.avatar?.videoId) {
                            localStorage.setItem('lastSeenVideoId', user.avatar.videoId);
                        }
                    }}
                    avatar={user.avatar}
                />
            )}
        </div>
    );
}
