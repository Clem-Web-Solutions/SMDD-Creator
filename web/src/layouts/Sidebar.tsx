import { LayoutDashboard, PenTool, BookOpen, GraduationCap, History as HistoryIcon, Settings, LogOut, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    to: string;
}

function NavItem({ icon: Icon, label, active = false, to }: NavItemProps) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-500'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
        >
            <Icon size={20} className={active ? 'text-blue-500' : 'group-hover:text-blue-400 transition-colors'} />
            <span className="font-medium">{label}</span>
        </Link>
    );
}

export function Sidebar() {
    const location = useLocation();

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col z-50 transition-colors duration-300">
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                    <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">SMDD</h1>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium tracking-wide">CREATOR</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu Principal</p>
                <nav className="space-y-1">
                    <NavItem
                        icon={LayoutDashboard}
                        label="Tableau de bord"
                        to="/dashboard"
                        active={location.pathname === '/dashboard'}
                    />
                    <NavItem
                        icon={PenTool}
                        label="Générateur IA"
                        to="/generator"
                        active={location.pathname === '/generator'}
                    />
                    <NavItem icon={BookOpen} label="Mes Ebooks" to="/ebooks" active={location.pathname === '/ebooks'} />
                    <NavItem icon={GraduationCap} label="Formations" to="/formations" active={location.pathname === '/formations'} />
                    <NavItem icon={HistoryIcon} label="Historique" to="/history" active={location.pathname === '/history'} />
                    <NavItem
                        icon={Settings}
                        label="Paramètres"
                        to="/settings"
                        active={location.pathname === '/settings'}
                    />
                </nav>
            </div>

            <div className="mt-auto px-2 mb-6">
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-blue-500" />
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">Crédits IA</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <span>2,450 / 5,000</span>
                        <span>49%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '49%' }} />
                    </div>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
                        Augmenter mon plan
                        <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-all group">
                    <LogOut size={20} className="group-hover:text-red-400" />
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </aside>
    );
}
