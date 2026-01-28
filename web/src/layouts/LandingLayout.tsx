import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LandingLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-electric/30">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-electric to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-electric/20">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">SMDD <span className="text-electric">Creator</span></span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Fonctionnalités</a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Comment ça marche</a>
                        <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Tarifs</a>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-200 transition-all transform hover:scale-105"
                        >
                            Connexion
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[60] bg-[#020617] flex flex-col p-6 md:hidden"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-electric to-blue-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">S</span>
                                </div>
                                <span className="font-bold text-xl tracking-tight">SMDD <span className="text-electric">Creator</span></span>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6 text-xl font-medium text-center">
                            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-slate-300 hover:text-white transition-colors">Fonctionnalités</a>
                            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-slate-300 hover:text-white transition-colors">Comment ça marche</a>
                            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-slate-300 hover:text-white transition-colors">Tarifs</a>
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    navigate('/login');
                                }}
                                className="mt-4 bg-white text-black px-6 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Connexion
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[#020617] py-12 border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-electric/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-bold text-sm">SMDD Creator</span>
                    </div>
                    <div className="flex gap-6 text-sm text-slate-400">
                        <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
                        <a href="#" className="hover:text-white transition-colors">CGU</a>
                    </div>
                    <p className="text-slate-600 text-sm">© 2024 SMDD Creator. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}
