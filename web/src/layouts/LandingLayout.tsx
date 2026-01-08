import { useNavigate } from 'react-router-dom';

export function LandingLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">SMDD <span className="text-blue-500">Creator</span></span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block">Fonctionnalités</a>
                        <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block">Tarifs</a>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
                        >
                            Accéder à l'app
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 py-12 border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 opacity-50">
                        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-bold text-sm">SMDD Creator</span>
                    </div>
                    <p className="text-slate-600 text-sm">© 2024 SMDD Creator. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}
