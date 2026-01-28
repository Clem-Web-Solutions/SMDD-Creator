import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, X, FileText } from 'lucide-react';

interface FormationConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: () => void;
    isGenerating: boolean;

    // Form State
    title: string;
    setTitle: (val: string) => void;
    subject: string;
    setSubject: (val: string) => void;
    audience: string;
    setAudience: (val: string) => void;
    tone: string;
    setTone: (val: string) => void;
    language: string;
    setLanguage: (val: string) => void;
    length: string;
    setLength: (val: string) => void;
}

export function FormationConfigModal({
    isOpen,
    onClose,
    onGenerate,
    isGenerating,
    title, setTitle,
    subject, setSubject,
    audience, setAudience,
    tone, setTone,
    language, setLanguage,
    length, setLength
}: FormationConfigModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Scène & Contenu</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Configurez le contenu pédagogique</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-6">
                            {/* Title Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Titre de la Formation (Optionnel)
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Introduction au Marketing Digital"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                                />
                            </div>

                            {/* Subject Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Sujet Détaillé
                                </label>
                                <textarea
                                    rows={4}
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Ex: Expliquer les bases du SEO, les mots-clés, et l'optimisation on-page..."
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white resize-none"
                                />
                            </div>

                            {/* Config Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Public Cible</label>
                                    <select
                                        value={audience}
                                        onChange={(e) => setAudience(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                                    >
                                        <option>Débutants</option>
                                        <option>Intermédiaires</option>
                                        <option>Experts</option>
                                        <option>Enfants / Ados</option>
                                        <option>Grand Public</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Ton</label>
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                                    >
                                        <option>Pédagogique</option>
                                        <option>Professionnel</option>
                                        <option>Inspirant</option>
                                        <option>Humoristique</option>
                                        <option>Direct & Concis</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Langue</label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                                    >
                                        <option>Français</option>
                                        <option>English</option>
                                        <option>Español</option>
                                        <option>Deutsch</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Longueur</label>
                                    <select
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                                    >
                                        <option>Court (3-5 slides)</option>
                                        <option>Moyen (8-12 slides)</option>
                                        <option>Long (15-20 slides)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Credit Cost Indicator */}
                            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-4 rounded-xl mb-4 border border-slate-200 dark:border-slate-800">
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Coût de génération</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-600 dark:text-purple-400 font-bold">
                                        {length.includes('Court') ? 100 : length.includes('Moyen') ? 150 : 250} Crédits
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={onGenerate}
                                disabled={isGenerating || !subject}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        <span>Génération de la formation...</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={24} />
                                        <span>Générer les slides (-{length.includes('Court') ? 100 : length.includes('Moyen') ? 150 : 250} crédits)</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
