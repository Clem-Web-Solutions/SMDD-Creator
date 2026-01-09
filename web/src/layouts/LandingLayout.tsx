import { useNavigate } from 'react-router-dom';

export function LandingLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

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
                    <div className="flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:block">Fonctionnalités</a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:block">Comment ça marche</a>
                        <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:block">Tarifs</a>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-200 transition-all transform hover:scale-105"
                        >
                            Connexion
                        </button>
                    </div>
                </div>
            </nav>

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
