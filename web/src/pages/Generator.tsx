import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Sparkles, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Generator() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [contentType, setContentType] = useState<'ebook' | 'formation'>(
        (searchParams.get('type') as 'ebook' | 'formation') || 'ebook'
    );

    // Form State
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [language, setLanguage] = useState('Français');
    const [tone, setTone] = useState('Professionnel');
    const [length, setLength] = useState('Moyen (~15 pages)');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [generatedEbookId, setGeneratedEbookId] = useState<string | null>(null);

    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'ebook' || type === 'formation') {
            setContentType(type);
        }
    }, [searchParams]);

    async function generateEbook() {
        if (!title || !subject) {
            alert("Veuillez remplir le titre et le sujet.");
            return;
        }

        setIsGenerating(true);
        setShowSuccessModal(false);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Vous devez être connecté pour générer un ebook.");
                navigate('/login');
                return;
            }

            const response = await fetch("http://localhost:3001/api/generate/ebook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    subject,
                    language,
                    tone,
                    length
                })
            });

            const data = await response.json();

            if (response.ok) {
                setGeneratedEbookId(data.ebook._id);
                setShowSuccessModal(true);
            } else {
                throw new Error(data.message || 'Erreur lors de la génération');
            }

        } catch (error) {
            console.error("Erreur lors de la génération:", error);
            alert("Erreur lors de la génération. Vérifiez que le serveur tourne.");
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 relative">
            {/* Generation Modal Overlay */}
            <AnimatePresence>
                {(isGenerating || showSuccessModal) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-800"
                        >
                            {isGenerating ? (
                                <div className="space-y-6">
                                    <div className="relative w-20 h-20 mx-auto">
                                        <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <Sparkles className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Génération en cours...</h3>
                                        <p className="text-slate-500 dark:text-slate-400">L'IA rédige votre ebook. Cela peut prendre une minute.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                        <BookOpen className="text-green-600 dark:text-green-400" size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Votre ebook est prêt !</h3>
                                        <p className="text-slate-500 dark:text-slate-400">La génération a été un succès. Vous pouvez maintenant consulter et éditer votre contenu.</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/ebooks/${generatedEbookId}/edit`)}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50"
                                    >
                                        Voir mon ebook
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/40">
                        <Sparkles className="text-white" size={20} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Générateur IA</h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400">Créez du contenu de qualité professionnelle en quelques clics grâce à l'intelligence artificielle.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                {/* Content Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <button
                        onClick={() => setContentType('ebook')}
                        className={`text-left p-6 rounded-xl border-2 transition-all ${contentType === 'ebook'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${contentType === 'ebook' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}>
                            <BookOpen size={24} />
                        </div>
                        <h3 className={`font-bold mb-1 ${contentType === 'ebook' ? 'text-blue-600 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>Ebook</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Générez un ebook complet avec chapitres</p>
                    </button>

                    <button
                        onClick={() => setContentType('formation')}
                        className={`text-left p-6 rounded-xl border-2 transition-all ${contentType === 'formation'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${contentType === 'formation' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}>
                            <FileText size={24} />
                        </div>
                        <h3 className={`font-bold mb-1 ${contentType === 'formation' ? 'text-blue-600 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>Formation</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Créez un cours structuré avec modules</p>
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {contentType === 'formation' ? (
                        <motion.div
                            key="formation-avatar"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/40">
                                        1
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Création de l'Avatar IA</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
                                    Pour créer votre formation, nous avons besoin de générer un présentateur virtuel.
                                    Décrivez le style, la voix et la personnalité de votre avatar.
                                </p>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Description de l'Avatar
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Décrivez votre avatar ici..."
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                                    />
                                </div>

                                <div className="bg-slate-100 dark:bg-slate-950/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-1">Exemple de prompt</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                        "Un formateur professionnel, homme, la trentaine, style business casual avec une chemise blanche.
                                        Expression bienveillante et dynamique. Voix posée et claire, ton pédagogique et encourageant.
                                        Fond de bureau moderne et lumineux."
                                    </p>
                                </div>

                                <button className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50">
                                    Générer mon Avatar
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ebook-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Title */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Titre du contenu
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Guide complet du marketing digital en 2024"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                />
                            </div>

                            {/* Subject */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Sujet principal
                                </label>
                                <textarea
                                    rows={4}
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Décrivez le sujet que vous souhaitez traiter. Plus vous êtes précis, meilleur sera le résultat..."
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                                />
                            </div>

                            {/* Settings Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Langue</label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                                    >
                                        <option>Français</option>
                                        <option>English</option>
                                        <option>Español</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Ton</label>
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                                    >
                                        <option>Professionnel</option>
                                        <option>Amical</option>
                                        <option>Académique</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Longueur</label>
                                    <select
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                                    >
                                        <option>Moyen (~15 pages)</option>
                                        <option>Court (~5-10 pages)</option>
                                        <option>Long (~30+ pages)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Credit Estimation */}
                            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 flex items-center justify-between mb-8 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-blue-500" size={20} />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Crédits estimés</p>
                                        <p className="text-xs text-slate-500">Basé sur la longueur sélectionnée</p>
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-500">~150 crédits</span>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={generateEbook}
                                disabled={isGenerating}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        <span>Génération en cours...</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={20} />
                                        <span>Générer avec l'IA</span>
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

}
