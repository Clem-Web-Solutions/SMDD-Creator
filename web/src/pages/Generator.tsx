import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Sparkles, Wand2, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NoCreditsModal } from '../components/NoCreditsModal';
import { AvatarSuccessModal } from '../components/AvatarSuccessModal';
import { FormationConfigModal } from '../components/FormationConfigModal';
import { ExistingAvatarModal } from '../components/ExistingAvatarModal';
import { AvatarSelector } from '../components/AvatarSelector';

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
    const [showNoCreditsModal, setShowNoCreditsModal] = useState(false);
    const [insufficientCreditDetails, setInsufficientCreditDetails] = useState({ required: 100, current: 0 });

    // Formation Steps
    // const [formationStep, setFormationStep] = useState<1 | 2>(1);
    // const [slidePrompt, setSlidePrompt] = useState(''); // Removed simple prompt

    // New Structured Formation Config
    const [formationTitle, setFormationTitle] = useState('');
    const [formationSubject, setFormationSubject] = useState('');
    const [formationAudience, setFormationAudience] = useState('Débutants');
    const [formationTone, setFormationTone] = useState('Pédagogique');
    const [formationLanguage, setFormationLanguage] = useState('Français');
    const [formationLength, setFormationLength] = useState('Moyen (8-12 slides)');

    // Avatar State
    const [avatarMode, setAvatarMode] = useState<'studio' | 'custom'>('studio'); // New Mode State
    const [avatarGender, setAvatarGender] = useState('Femme');
    const [avatarAge, setAvatarAge] = useState('Trentenaire');
    const [avatarStyle, setAvatarStyle] = useState('Professionnel');
    const [avatarDetails, setAvatarDetails] = useState('');

    // const [avatarDescription, setAvatarDescription] = useState(''); // Removed simple description
    const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);
    const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
    const [showFormationConfig, setShowFormationConfig] = useState(false); // Modal state
    const [showAvatarModal, setShowAvatarModal] = useState(false); // New explicit modal state
    const [showExistingAvatarModal, setShowExistingAvatarModal] = useState(false); // Pop-up for existing avatar
    const [existingAvatarData, setExistingAvatarData] = useState<any>(null);

    async function generateAvatar() {
        // Can add more specific validation if needed, but defaults are set.
        // if (!avatarGender) ...

        setIsGeneratingAvatar(true);
        setShowAvatarModal(false); // Reset

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Vous devez être connecté.");
                navigate('/login');
                return;
            }

            const response = await fetch("http://localhost:3001/api/avatar/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    gender: avatarGender,
                    age: avatarAge,
                    style: avatarStyle,
                    details: avatarDetails
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Poll for status
                checkAvatarStatus(data.video_id, token);
            } else {
                throw new Error(data.error || "Erreur lors de la génération");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur: " + (error as Error).message);
            setIsGeneratingAvatar(false);
        }
    }

    const intervalRef = useRef<number | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
        };
    }, []);

    async function checkAvatarStatus(videoId: string, token: string) {
        // Clear existing interval if any
        if (intervalRef.current) window.clearInterval(intervalRef.current);

        intervalRef.current = window.setInterval(async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/avatar/status/${videoId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await response.json();

                if (data.status === 'completed' && data.video_url) {
                    if (intervalRef.current) window.clearInterval(intervalRef.current);
                    setAvatarVideoUrl(data.video_url);
                    setIsGeneratingAvatar(false);
                    setShowAvatarModal(true); // Show success modal

                    // UPDATE USER DATA GLOBALLY
                    try {
                        const userRes = await fetch("http://localhost:3001/api/auth/me", {
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        const userData = await userRes.json();
                        // userData.avatar should now have 'latestFormationId' if backend supports it or we inferred it.
                        // Actually, backend formationRoutes updates 'avatar' but maybe not 'latestFormationId'.
                        // Wait, I commented out 'latestFormationId' in backend.
                        // Ideally the polling response 'data' should include the formationId if it's a formation video.
                        // For now, let's just rely on refreshing the user data which should have the latest structure if we saved it.

                        const updatedUser = { ...userData, token };
                        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                        window.dispatchEvent(new Event('userDataUpdated'));
                    } catch (err) {
                        console.error("Failed to refresh user data:", err);
                    }
                } else if (data.status === 'failed') {
                    if (intervalRef.current) window.clearInterval(intervalRef.current);
                    alert("La génération de l'avatar a échoué.");
                    setIsGeneratingAvatar(false);
                }
            } catch (error) {
                console.error("Polling error:", error);
                if (intervalRef.current) window.clearInterval(intervalRef.current);
                setIsGeneratingAvatar(false);
            }
        }, 5000); // Poll every 5 seconds
    }


    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'ebook' || type === 'formation') {
            setContentType(type);
        }

        checkUserData();

        window.addEventListener('userDataUpdated', checkUserData);
        return () => window.removeEventListener('userDataUpdated', checkUserData);
    }, [searchParams, contentType]);

    function checkUserData() {
        // Fetch user data to check for existing avatar
        const token = localStorage.getItem('token');
        if (token) {
            fetch("http://localhost:3001/api/auth/me", {
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.avatar && data.avatar.videoId) {
                        // Avatar exists
                        if (data.avatar.videoUrl) {
                            setAvatarVideoUrl(data.avatar.videoUrl);
                        } else {
                            checkAvatarStatus(data.avatar.videoId, token);
                        }
                        if (data.avatar.description) {
                            // Map old description to details, or just ignore. 
                            setAvatarDetails(data.avatar.description);
                        }

                        // Show modal if we are on formation type and avatar exists
                        if (contentType === 'formation' && !showFormationConfig && !isGeneratingAvatar && !showAvatarModal) {
                            setShowExistingAvatarModal(true);
                            setExistingAvatarData(data.avatar);
                        }
                    }
                })
                .catch(err => console.error("Failed to fetch user data:", err));
        }
    }

    async function generateSlides() {
        if (!formationSubject) {
            alert("Veuillez décrire le sujet de la formation.");
            return;
        }

        setIsGeneratingAvatar(true); // Reuse loading state or add new one? reused for simplicity for now
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3001/api/formation/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formationTitle,
                    subject: formationSubject,
                    audience: formationAudience,
                    tone: formationTone,
                    language: formationLanguage,
                    slideCount: formationLength
                })
            });

            if (response.status === 403) {
                const errorData = await response.json();
                setInsufficientCreditDetails({
                    required: errorData.required || 100,
                    current: errorData.current || 0
                });
                setShowNoCreditsModal(true);
                setIsGeneratingAvatar(false);
                return;
            }

            const data = await response.json();

            if (response.ok) {
                console.log("Formation generation started:", data);
                // Start polling for this new video
                // We can reuse checkAvatarStatus if we update the local stored ID? 
                // Formation generation returns { success: true, video_id: ..., script: ... }
                // We should probably store the 'formationId' if the backend returned it.
                // But currently backend only returns video_id.
                // We will poll for video status.
                checkAvatarStatus(data.video_id, token!);

                // REFRESH USER CREDITS AFTER SUCCESS
                fetch("http://localhost:3001/api/auth/me", {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                    .then(res => res.json())
                    .then(userData => {
                        const updatedUser = { ...userData, token };
                        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                        window.dispatchEvent(new Event('userDataUpdated'));
                    });

            } else {
                console.error("Formation generation failed:", data);
                setIsGeneratingAvatar(false);
                alert(data.error || "Erreur lors de la génération");
            }
        } catch (error) {
            console.error("Error generating formation:", error);
            setIsGeneratingAvatar(false);
        }
    }

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

            if (response.status === 403) {
                const errorData = await response.json();
                setInsufficientCreditDetails({
                    required: errorData.required || 150,
                    current: errorData.current || 0
                });
                setShowNoCreditsModal(true);
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setGeneratedEbookId(data.ebook._id);
                setShowSuccessModal(true);

                // Fetch updated user stats (credits)
                fetch("http://localhost:3001/api/auth/me", {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                    .then(res => res.json())
                    .then(userData => {
                        const updatedUser = { ...userData, token };
                        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                        window.dispatchEvent(new Event('userDataUpdated'));
                    })
                    .catch(err => console.error("Failed to update credits:", err));
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
                            key="formation-steps"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-6 relative">
                                {/* GENERATING OVERLAY */}
                                <AnimatePresence>
                                    {isGeneratingAvatar && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl flex flex-col items-center justify-center p-8 text-center"
                                        >
                                            <div className="w-20 h-20 relative mb-6">
                                                <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                                                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                <Sparkles className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Création de votre Avatar...</h3>
                                            <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                                                L'IA configure l'apparence et la voix de votre présentateur.
                                                <br /><span className="font-semibold text-blue-600">Temps estimé : ~1 minute.</span>
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

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

                                {/* Tip Box */}
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 flex gap-3">
                                    <Lightbulb className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" size={20} />
                                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                        <p className="font-semibold mb-1">Conseil pour un meilleur résultat</p>
                                        <p className="opacity-90">
                                            Pour avoir des prompts efficaces, rejoignez la <a href="https://discord.gg/4cErewmehw" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors">communauté Discord</a> et consultez le salon <span className="font-mono bg-yellow-100 dark:bg-yellow-900/40 px-1.5 py-0.5 rounded text-xs font-bold border border-yellow-200 dark:border-yellow-700/50">#bibliothèque</span>.
                                        </p>
                                    </div>
                                </div>

                                {/* Avatar Mode Selection */}
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6">
                                    <button
                                        onClick={() => setAvatarMode('studio')}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${avatarMode === 'studio'
                                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        Studio (Avatars Réels)
                                    </button>
                                    <button
                                        onClick={() => setAvatarMode('custom')}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${avatarMode === 'custom'
                                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        Custom (Génératif)
                                    </button>
                                </div>

                                {avatarMode === 'studio' ? (
                                    <AvatarSelector
                                        onSelect={(avatar) => {
                                            // Simulate "Generation Success" by setting data and showing modal or moving next
                                            setExistingAvatarData({
                                                videoId: null, // No intro video yet, but that's fine
                                                videoUrl: avatar.preview_video_url || avatar.preview_image_url, // Use preview
                                                name: avatar.name,
                                                type: 'avatar',
                                                avatarId: avatar.avatar_id
                                            });
                                            setShowExistingAvatarModal(true);
                                        }}
                                    />
                                ) : (
                                    <>
                                        {/* Custom Avatar Form */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Genre</label>
                                                <select
                                                    value={avatarGender}
                                                    onChange={(e) => setAvatarGender(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                                                >
                                                    <option>Homme</option>
                                                    <option>Femme</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Âge</label>
                                                <select
                                                    value={avatarAge}
                                                    onChange={(e) => setAvatarAge(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                                                >
                                                    <option>Jeune Adulte (20s)</option>
                                                    <option>Trentenaire (30s)</option>
                                                    <option>Senior (50+)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Style</label>
                                                <select
                                                    value={avatarStyle}
                                                    onChange={(e) => setAvatarStyle(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                                                >
                                                    <option>Professionnel</option>
                                                    <option>Décontracté</option>
                                                    <option>Artistique</option>
                                                    <option>Futuriste</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Détails Supplémentaires (Optionnel)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={avatarDetails}
                                                onChange={(e) => setAvatarDetails(e.target.value)}
                                                placeholder="Ex: Lunettes, cheveux courts, sourire..."
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                                            />
                                        </div>

                                        <button
                                            onClick={generateAvatar}
                                            disabled={isGeneratingAvatar}
                                            className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isGeneratingAvatar ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                                    <span>Génération de l'avatar...</span>
                                                </>
                                            ) : (
                                                "Générer mon Avatar"
                                            )}
                                        </button>
                                    </>
                                )}
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
                                <span className={`text-xl font-bold transition-all key={length} ${length.includes('Court') ? 'text-green-600 dark:text-green-500' :
                                    length.includes('Moyen') ? 'text-blue-600 dark:text-blue-500' :
                                        'text-purple-600 dark:text-purple-500'
                                    }`}>
                                    ~{
                                        length.includes('Court') ? 100 :
                                            length.includes('Moyen') ? 150 :
                                                250
                                    } crédits
                                </span>
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
            <NoCreditsModal
                isOpen={showNoCreditsModal}
                onClose={() => setShowNoCreditsModal(false)}
                required={insufficientCreditDetails.required}
                current={insufficientCreditDetails.current}
            />

            <AvatarSuccessModal
                isOpen={showAvatarModal}
                onClose={() => setShowAvatarModal(false)}
                onContinue={() => {
                    setShowAvatarModal(false);
                    // setFormationStep(1);
                    setShowFormationConfig(true);
                }}
                videoUrl={avatarVideoUrl}
            />

            <FormationConfigModal
                isOpen={showFormationConfig}
                onClose={() => setShowFormationConfig(false)}
                onGenerate={() => {
                    setShowFormationConfig(false);
                    generateSlides();
                }}
                isGenerating={isGeneratingAvatar}

                title={formationTitle}
                setTitle={setFormationTitle}
                subject={formationSubject}
                setSubject={setFormationSubject}
                audience={formationAudience}
                setAudience={setFormationAudience}
                tone={formationTone}
                setTone={setFormationTone}
                language={formationLanguage}
                setLanguage={setFormationLanguage}
                length={formationLength}
                setLength={setFormationLength}
            />

            <ExistingAvatarModal
                isOpen={showExistingAvatarModal}
                onClose={() => setShowExistingAvatarModal(false)}
                onContinue={() => {
                    setShowExistingAvatarModal(false);
                    setShowFormationConfig(true);
                }}
                onReset={() => {
                    setShowExistingAvatarModal(false);
                    setAvatarVideoUrl(null);
                    setExistingAvatarData(null);
                    // Explicitly reset form?
                    setAvatarDetails('');
                }}
                avatar={existingAvatarData}
            />
        </div>
    );
}
