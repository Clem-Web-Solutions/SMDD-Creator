import { Search, Filter, Zap, BookOpen, GraduationCap, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const mockHistory = [
    {
        id: 1,
        type: 'ebook',
        action: 'Génération terminée',
        title: 'Guide Marketing Digital 2024',
        date: 'Aujourd\'hui, 14:30',
        credits: -45,
        status: 'success'
    },
    {
        id: 2,
        type: 'formation',
        action: 'Nouveau module créé',
        title: 'Devenir Freelance - Module 3',
        date: 'Hier, 09:15',
        credits: -15,
        status: 'success'
    },
    {
        id: 3,
        type: 'credits',
        action: 'Rechargement pack',
        title: 'Pack Starter (500 crédits)',
        date: '05 Jan 2024, 18:00',
        credits: 500,
        status: 'success'
    },
    {
        id: 4,
        type: 'ebook',
        action: 'Génération échouée',
        title: 'Les secrets du Yoga',
        date: '04 Jan 2024, 11:20',
        credits: 0,
        status: 'failed'
    },
    {
        id: 5,
        type: 'formation',
        action: 'Export terminé',
        title: 'Python pour débutants',
        date: '03 Jan 2024, 16:45',
        credits: 0,
        status: 'success'
    },
    {
        id: 6,
        type: 'ebook',
        action: 'Génération terminée',
        title: 'Recettes Keto Faciles',
        date: '02 Jan 2024, 10:10',
        credits: -35,
        status: 'success'
    }
];

export function History() {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Historique</h1>
                    <p className="text-slate-500 dark:text-slate-400">Suivez toutes vos activités et consommations de crédits.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>
                    <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Filter size={18} />
                        <span>Filtrer</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {mockHistory.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.type === 'ebook' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                                    item.type === 'formation' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' :
                                        'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                    }`}>
                                    {item.type === 'ebook' && <BookOpen size={20} />}
                                    {item.type === 'formation' && <GraduationCap size={20} />}
                                    {item.type === 'credits' && <Zap size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-slate-900 dark:text-white font-semibold">{item.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                                        <span>{item.action}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {item.date}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className={`font-semibold ${item.credits > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'
                                    }`}>
                                    {item.credits > 0 ? '+' : ''}{item.credits} crédits
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${item.status === 'success'
                                    ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                                    : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                                    }`}>
                                    {item.status === 'success' ? 'Succès' : 'Échec'}
                                </div>
                                <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-center">
                    <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                        Charger plus d'activités
                    </button>
                </div>
            </div>
        </div>
    );
}
