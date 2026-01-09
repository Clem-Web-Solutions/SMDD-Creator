import { BookOpen, Download, Edit, Trash2, Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const mockEbooks = [
    {
        id: 1,
        title: "Guide Marketing Digital 2024",
        subject: "Marketing",
        date: "08 Jan 2024",
        pages: 45,
        status: "completed",
        coverColor: "from-blue-500 to-cyan-500"
    },
    {
        id: 2,
        title: "Les bases de la Nutrition",
        subject: "Santé",
        date: "05 Jan 2024",
        pages: 32,
        status: "completed",
        coverColor: "from-emerald-500 to-teal-500"
    },
    {
        id: 3,
        title: "Intelligence Artificielle pour débutants",
        subject: "Technologie",
        date: "02 Jan 2024",
        pages: 12,
        status: "draft",
        coverColor: "from-violet-500 to-purple-500"
    },
    {
        id: 4,
        title: "Recettes Keto Faciles",
        subject: "Cuisine",
        date: "28 Dec 2023",
        pages: 60,
        status: "completed",
        coverColor: "from-orange-500 to-red-500"
    },
    {
        id: 5,
        title: "Investir en Bourse",
        subject: "Finance",
        date: "20 Dec 2023",
        pages: 85,
        status: "completed",
        coverColor: "from-slate-700 to-slate-900"
    },
    {
        id: 6,
        title: "Yoga du matin",
        subject: "Bien-être",
        date: "15 Dec 2023",
        pages: 24,
        status: "draft",
        coverColor: "from-rose-400 to-pink-500"
    }
];

export function MyEbooks() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Mes Ebooks</h1>
                    <p className="text-slate-500 dark:text-slate-400">Retrouvez tous vos guides et livres blancs générés.</p>
                </div>
                <div className="flex gap-4">
                    <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Tous les ebooks</option>
                        <option>Terminés</option>
                        <option>Brouillons</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockEbooks.map((ebook, index) => (
                    <motion.div
                        key={ebook.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group"
                    >
                        {/* Cover Preview */}
                        <div className={`h-48 bg-gradient-to-br ${ebook.coverColor} p-6 flex flex-col justify-between relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            <div className="relative z-10">
                                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md border border-white/20">
                                    {ebook.subject}
                                </span>
                            </div>
                            <div className="relative z-10">
                                <BookOpen className="text-white/80 w-12 h-12 mb-2" strokeWidth={1} />
                                <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 shadow-sm">
                                    {ebook.title}
                                </h3>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    <span>{ebook.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FileText size={14} />
                                    <span>{ebook.pages} pages</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                {ebook.status === 'completed' ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-full">
                                        Terminé
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
                                        Brouillon
                                    </span>
                                )}

                                <div className="flex items-center gap-1">
                                    <Link to={`/ebooks/${ebook.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Éditer">
                                        <Edit size={18} />
                                    </Link>
                                    <button className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors" title="Télécharger">
                                        <Download size={18} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Supprimer">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Create New Card */}
                <Link to="/generator" className="block">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: mockEbooks.length * 0.05 }}
                        className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all cursor-pointer group flex flex-col items-center justify-center p-8 min-h-[300px] h-full"
                    >
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Créer un Ebook</h3>
                        <p className="text-sm text-slate-500 text-center">Commencez un nouveau projet avec l'IA</p>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
