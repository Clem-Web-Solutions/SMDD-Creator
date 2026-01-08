import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Dashboard } from './pages/Dashboard';
import { Generator } from './pages/Generator';
import { Settings } from './pages/Settings';
import { MyEbooks } from './pages/MyEbooks';
import { MyFormations } from './pages/MyFormations';
import { History } from './pages/History';
import { Landing } from './pages/Landing';
import { PageTransition } from './components/PageTransition';
import { MainLayout } from './layouts/MainLayout';
import { LandingLayout } from './layouts/LandingLayout';
import { Outlet } from 'react-router-dom';

export function AppRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes with LandingLayout */}
                <Route element={<LandingLayout><Outlet /></LandingLayout>}>
                    <Route path="/" element={<Landing />} />
                </Route>

                {/* Protected Routes with MainLayout */}
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={
                        <PageTransition>
                            <Dashboard />
                        </PageTransition>
                    } />
                    <Route path="/generator" element={
                        <PageTransition>
                            <Generator />
                        </PageTransition>
                    } />
                    <Route path="/settings" element={
                        <PageTransition>
                            <Settings />
                        </PageTransition>
                    } />
                    <Route path="/ebooks" element={
                        <PageTransition>
                            <MyEbooks />
                        </PageTransition>
                    } />
                    <Route path="/formations" element={
                        <PageTransition>
                            <MyFormations />
                        </PageTransition>
                    } />
                    <Route path="/history" element={
                        <PageTransition>
                            <History />
                        </PageTransition>
                    } />
                </Route>
            </Routes>
        </AnimatePresence>
    );
}
