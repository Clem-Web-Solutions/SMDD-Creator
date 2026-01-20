import { GraduationCap, PlayCircle, Edit, Trash2, Calendar, LayoutList, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Removed mock data

import { useState, useEffect } from 'react';

export function MyFormations() {
    const [formations, setFormations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("http://localhost:3001/api/formation", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormations(data);
                }
            } catch (error) {
                console.error("Failed to fetch formations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFormations();
    }, []);

    if (loading) return <div className="p-8 text-center text-white">Chargement...</div>;
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Mes Formations</h1>
                    <p className="text-slate-500 dark:text-slate-400">Gérez vos cours vidéo et modules de formation.</p>
                </div>
                <div className="flex gap-4">
                    <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Toutes les formations</option>
                        <option>Terminées</option>
                        <option>Brouillons</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {formations.map((course, index) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group"
                    >
                        {/* Cover Preview */}
                        <div className={`h-48 bg-gradient-to-br ${course.coverColor} p-6 flex flex-col justify-between relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            <div className="relative z-10">
                                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md border border-white/20">
                                    {course.subject || "Général"}
                                </span>
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 text-white">
                                    <PlayCircle fill="currentColor" size={24} className="opacity-90" />
                                </div>
                                <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 shadow-sm">
                                    {course.title}
                                </h3>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <LayoutList size={14} />
                                    <span>{course.slides ? course.slides.length : 0} slides</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                {course.status === 'completed' ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-full">
                                        Terminé
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
                                        Brouillon
                                    </span>
                                )}

                                <div className="flex items-center gap-1">
                                    <Link to={`/presentation/${course._id}`}>
                                        <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Voir">
                                            <PlayCircle size={18} />
                                        </button>
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
                <Link to="/generator?type=formation" className="block">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: formations.length * 0.05 }}
                        className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all cursor-pointer group flex flex-col items-center justify-center p-8 min-h-[300px] h-full"
                    >
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <GraduationCap size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Nouvelle Formation</h3>
                        <p className="text-sm text-slate-500 text-center">Créez un plan de cours avec l'IA</p>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
