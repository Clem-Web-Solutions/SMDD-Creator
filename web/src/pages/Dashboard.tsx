import { DashboardStats } from '../components/DashboardStats';
import { DashboardCharts } from '../components/DashboardCharts';
import { Clock, Download, MoreVertical, Plus, Star } from 'lucide-react';

export function Dashboard() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userName = userInfo.name || 'Utilisateur';

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bonjour, {userName} 👋</h1>
                    <p className="text-slate-500 dark:text-slate-400">Voici ce qui se passe sur votre compte aujourd'hui.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 transition-all flex items-center gap-2">
                    <Plus size={20} />
                    Nouveau Projet
                </button>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <DashboardCharts />
                </div>

                {/* Recent Activity / Quick Actions */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Générations récentes</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Guide Marketing 2024</h3>
                                        <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">Ebook</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-2">Généré il y a 2h</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2 py-0.5 rounded">Terminé</span>
                                        <div className="flex-1"></div>
                                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><Download size={16} /></button>
                                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                            Voir tout l'historique
                        </button>
                    </div>


                </div>
            </div>
        </div>
    );
}
