import { BookOpen, Download, Edit, Trash2, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Define Ebook interface
interface Ebook {
    _id: string;
    id: string; // Keep for compatibility if needed, but prefer _id
    title: string;
    subject: string;
    createdAt: string;
    date?: string; // Formatted date
    length: string;
    status: string;
    coverColor?: string; // Optional since backend doesn't save it yet
}

export function MyEbooks() {
    const [ebooks, setEbooks] = useState<Ebook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; ebookId: string | null }>({
        isOpen: false,
        ebookId: null
    });

    const handleDelete = async () => {
        if (!deleteModal.ebookId) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/ebooks/${deleteModal.ebookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setEbooks(ebooks.filter(e => e.id !== deleteModal.ebookId));
                setDeleteModal({ isOpen: false, ebookId: null });
            } else {
                alert("Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de la suppression");
        }
    };

    useEffect(() => {
        const fetchEbooks = async () => {
            try {
                const token = localStorage.getItem('token');
                // Even without a token, we might want to fail gracefully or redirect to login
                // For now assuming user is logged in if they access this page via dashboard

                const response = await fetch('http://localhost:3001/api/ebooks', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Map data to match UI expectations if necessary
                    const formattedData = data.map((item: any) => ({
                        ...item,
                        id: item._id, // Map _id to id
                        date: new Date(item.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
                        coverColor: "from-blue-500 to-cyan-500" // Default color for now
                    }));
                    setEbooks(formattedData);
                } else {
                    console.error('Failed to fetch ebooks');
                }
            } catch (error) {
                console.error('Error fetching ebooks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEbooks();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto container-enter">
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

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
                </div>
            ) : ebooks.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400">Aucun ebook trouvé. Générez votre premier ebook !</p>
                    <Link to="/generator" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                        Aller au générateur
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ebooks.map((ebook, index) => (
                        <motion.div
                            key={ebook.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group"
                        >
                            {/* Cover Preview */}
                            <div className={`h-48 bg-gradient-to-br ${ebook.coverColor || "from-blue-500 to-cyan-500"} p-6 flex flex-col justify-between relative overflow-hidden`}>
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
                                        <span>{ebook.length}</span>
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
                                        <button
                                            onClick={() => setDeleteModal({ isOpen: true, ebookId: ebook.id })}
                                            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
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
                            transition={{ duration: 0.3, delay: ebooks.length * 0.05 }}
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
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setDeleteModal({ isOpen: false, ebookId: null })}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                                    <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Supprimer l'ebook ?</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                                    Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet ebook ?
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setDeleteModal({ isOpen: false, ebookId: null })}
                                        className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
