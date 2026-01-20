import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Generator } from './pages/Generator';
import { Settings } from './pages/Settings';
import { MyEbooks } from './pages/MyEbooks';
import { EbookEditor } from './pages/EbookEditor';
import { MyFormations } from './pages/MyFormations';
import { History } from './pages/History';
import { Landing } from './pages/Landing';
import { Presentation } from './pages/Presentation';
import { PageTransition } from './components/PageTransition';
import { MainLayout } from './layouts/MainLayout';
import { LandingLayout } from './layouts/LandingLayout';

export function AppRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Auth Routes (Standalone) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Public Routes with LandingLayout */}
                <Route element={<LandingLayout><Outlet /></LandingLayout>}>
                    <Route path="/" element={<Landing />} />
                </Route>

                {/* Presentation Route (Standalone) */}
                <Route path="/presentation/:id" element={<Presentation />} />

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
                    <Route path="/ebooks/:id/edit" element={
                        <PageTransition>
                            <EbookEditor />
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
