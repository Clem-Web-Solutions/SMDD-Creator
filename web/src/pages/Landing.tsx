import { ArrowRight, BookOpen, GraduationCap, Sparkles, Wand2, Check, Zap, Smartphone, Globe, Shield, Play, Users, Star, X, ChevronDown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Landing() {
    const navigate = useNavigate();

    return (
        <div className="overflow-hidden bg-slate-950 font-sans selection:bg-blue-500/30">
            {/* 1. HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 text-center md:text-left z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 mb-8 backdrop-blur-sm">
                            <Sparkles size={14} />
                            <span>La référence des créateurs de contenu IA</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Créez des Ebooks et Formations <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">en quelques minutes</span> grâce à l’IA.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                            Générez du contenu structuré, professionnel et prêt à vendre, sans écrire une ligne.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-100 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-white/10 hover:shadow-white/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                Créer mon premier ebook
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-center flex items-center justify-center gap-2">
                                <Play size={20} fill="currentColor" />
                                Voir une démo
                            </button>
                        </div>
                    </motion.div>

                    {/* Visual / Interface Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, rotate: 5 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 relative z-10 w-full max-w-lg"
                    >
                        <div className="relative aspect-square md:aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl p-4 overflow-hidden backdrop-blur-xl group">
                            {/* Abstract UI Elements */}
                            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />

                            {/* Mockup Content */}
                            <div className="flex flex-col h-full gap-4">
                                {/* Header Mock */}
                                <div className="h-12 border-b border-slate-700/50 flex items-center justify-between px-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 md:bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 md:bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20 md:bg-green-500" />
                                    </div>
                                    <div className="w-32 h-2 bg-slate-700/50 rounded-full" />
                                </div>
                                {/* Body Mock */}
                                <div className="flex-1 flex gap-4">
                                    <div className="w-16 hidden md:flex flex-col gap-3 py-2">
                                        <div className="w-10 h-10 bg-blue-500 rounded-xl mx-auto" />
                                        <div className="w-10 h-10 bg-slate-800 rounded-xl mx-auto" />
                                        <div className="w-10 h-10 bg-slate-800 rounded-xl mx-auto" />
                                    </div>
                                    <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-700/50 p-6 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
                                        <div className="w-3/4 h-8 bg-slate-800 rounded-lg mb-4" />
                                        <div className="space-y-3">
                                            <div className="w-full h-3 bg-slate-800/50 rounded" />
                                            <div className="w-full h-3 bg-slate-800/50 rounded" />
                                            <div className="w-2/3 h-3 bg-slate-800/50 rounded" />
                                        </div>
                                        <div className="mt-8 flex gap-3">
                                            <div className="h-24 w-24 bg-blue-500/10 rounded-lg border border-blue-500/20" />
                                            <div className="h-24 w-24 bg-violet-500/10 rounded-lg border border-violet-500/20" />
                                        </div>

                                        {/* Activity Popups */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1, duration: 0.5 }}
                                            className="absolute bottom-4 right-4 bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-xl flex items-center gap-3"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-xs text-slate-300">Génération terminée</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Background Glows */}
                <div className="absolute top-0 left-10 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[128px] pointer-events-none" />
            </section>

            {/* 2. PROBLEM -> SOLUTION */}
            <section className="py-24 bg-slate-900/30 border-y border-white/5">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Pourquoi c'est si dur de créer du contenu ?</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <ProblemCard icon={X} title="Trop long" desc="Créer un ebook prend des semaines de rédaction." />
                        <ProblemCard icon={X} title="Complexe" desc="Structurer une formation pédagogique est un métier." />
                        <ProblemCard icon={X} title="Page blanche" desc="Le manque d'idées bloque 80% des créateurs." />
                    </div>
                    <div className="relative p-8 bg-gradient-to-r from-blue-900/20 to-violet-900/20 rounded-3xl border border-blue-500/20">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                            La Solution
                        </div>
                        <p className="text-xl md:text-2xl font-medium text-white">
                            Notre IA s’occupe de tout, <span className="text-blue-400">de l’idée à la publication</span>.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. FUNCTIONALITIES (Bento Grid) */}
            <section id="features" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Tout pour réussir.</h2>
                        <p className="text-slate-400 text-lg">Ne liste pas des features, vendez des résultats.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Ebook Card */}
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl md:col-span-2 hover:border-blue-500/30 transition-colors group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500/20 transition-colors">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Création d’Ebooks IA</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <BenefitItem text="Génération automatique de chapitres" />
                                <BenefitItem text="Ton personnalisable (expert, vendeur...)" />
                                <BenefitItem text="Structuration logique & fluide" />
                                <BenefitItem text="Export PDF / EPUB / DOC" />
                            </div>
                        </div>

                        {/* Bonus IA Card */}
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl flex flex-col justify-center hover:border-amber-500/30 transition-colors group">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-500/20 transition-colors">
                                <Wand2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Bonus IA</h3>
                            <ul className="space-y-3">
                                <BenefitItem text="Réécriture & amélioration" small />
                                <BenefitItem text="SEO & copywriting" small />
                                <BenefitItem text="Traduction multilingue" small />
                            </ul>
                        </div>

                        {/* Formation Card */}
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl md:col-span-3 hover:border-violet-500/30 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                                <div className="flex-1">
                                    <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400 mb-6 group-hover:bg-violet-500/20 transition-colors">
                                        <GraduationCap size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Création de Formations IA</h3>
                                    <p className="text-slate-400 mb-6 max-w-xl">
                                        Transformez votre expertise en cours complets. L'IA génère le plan, les leçons, et même les exercices pour vos étudiants.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm border border-slate-700">Plan intelligent</span>
                                        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm border border-slate-700">Modules automatiques</span>
                                        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm border border-slate-700">Scripts vidéo</span>
                                        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm border border-slate-700">Quiz & Exercices</span>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-slate-950/50 rounded-xl border border-slate-800 p-4">
                                    <div className="space-y-3">
                                        <div className="h-2 bg-slate-800 rounded w-1/2 mb-4" />
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-xs text-violet-400">1</div>
                                            <div className="flex-1 h-8 bg-slate-800 rounded flex items-center px-3 text-xs text-slate-500">Module 1 : Les bases...</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-xs text-violet-400">2</div>
                                            <div className="flex-1 h-8 bg-slate-800 rounded flex items-center px-3 text-xs text-slate-500">Module 2 : Avancé...</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="py-24 bg-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
                        3 étapes, <span className="text-blue-400">zéro effort</span>.
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0" />

                        <StepCard
                            number="1"
                            title="Décrivez votre sujet"
                            desc="Entrez simplement le thème ou le titre de votre projet."
                        />
                        <StepCard
                            number="2"
                            title="L'IA génère tout"
                            desc="En quelques secondes, la structure et le contenu sont créés."
                        />
                        <StepCard
                            number="3"
                            title="Ajustez et Publiez"
                            desc="Modifiez si besoin, exportez et commencez à vendre."
                        />
                    </div>
                    <div className="text-center mt-12">
                        <p className="text-slate-400 font-medium">👉 Simple, rapide, sans compétences techniques.</p>
                    </div>
                </div>
            </section>

            {/* 5. USE CASES */}
            <section className="py-24 px-6 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Fait pour tous ceux qui veulent <br />
                                <span className="text-blue-400">vendre leur savoir</span>.
                            </h2>
                            <p className="text-slate-400 text-lg mb-8">
                                Que vous soyez débutant ou expert, SMDD Creator accélère votre production.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <UseCaseItem text="Coaches & formateurs" icon={Users} />
                                <UseCaseItem text="Infopreneurs" icon={Zap} />
                                <UseCaseItem text="Freelances" icon={Globe} />
                                <UseCaseItem text="Écoles en ligne" icon={GraduationCap} />
                            </div>
                        </div>
                        <div className="md:w-1/2 relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
                            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gray-700 rounded-full" />
                                    <div>
                                        <div className="text-white font-bold">Thomas L.</div>
                                        <div className="text-slate-500 text-sm">Coach Business</div>
                                    </div>
                                </div>
                                <p className="text-slate-300 italic">
                                    "J'ai créé ma formation complète en un week-end au lieu de 2 mois. C'est juste bluffant."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. SOCIAL PROOF */}
            <section className="py-16 bg-slate-950 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex justify-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} className="text-yellow-400" fill="currentColor" />)}
                    </div>
                    <h3 className="text-2xl text-white font-bold mb-12">Rejoignez l'élite des créateurs</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatItem value="+10 000" label="Ebooks créés" />
                        <StatItem value="+5 000" label="Formations générées" />
                        <StatItem value="98%" label="Satisfaction client" />
                        <StatItem value="24/7" label="Support disponible" />
                    </div>
                </div>
            </section>

            {/* 7. COMPARISON */}
            <section className="py-24 px-6 bg-slate-900/30">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-16">Pourquoi nous et pas ChatGPT ?</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 text-slate-500 font-medium">Fonctionnalité</th>
                                    <th className="p-4 text-blue-400 font-bold bg-blue-500/5 rounded-t-xl w-1/3">SMDD Creator</th>
                                    <th className="p-4 text-slate-500 font-medium w-1/3">Autres outils / ChatGPT</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                <ComparisonRow label="Structuration automatique" us="Oui, complète" them="Non, texte brut" />
                                <ComparisonRow label="Spécialisé Ebook & Formation" us="Oui, expert" them="Non, générique" />
                                <ComparisonRow label="Export prêt à vendre" us="Oui (PDF, etc)" them="Non, copier-coller" />
                                <ComparisonRow label="Workflow guidé" us="Oui, étape par étape" them="Aucun" />
                                <ComparisonRow label="Mises à jour gratuites" us="Oui" them="Payant (souvent)" />
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* 8. PRICING */}
            <section id="pricing" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Des tarifs simples.</h2>
                        <p className="text-slate-400">Commencez gratuitement, passez pro quand vous voulez.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <PricingCard
                            title="Découverte"
                            price="0€"
                            features={['300 crédits offerts', '1 Ebook complet', 'Fonctionnalités de base', 'Export PDF avec filigrane']}
                        />
                        <PricingCard
                            title="Pro"
                            price="20€"
                            period="/mois"
                            isPopular
                            features={['1500 crédits / mois', '~ 5 Ebooks ou Formations', 'Exports sans filigrane', 'Mode Expert IA', 'Support prioritaire', 'Accès Communauté Privée']}
                        />
                        <PricingCard
                            title="Business"
                            price="50€"
                            period="/mois"
                            features={['5000 crédits / mois', 'Licence revendeur', 'API Access', 'White Label', 'Account Manager dédié', 'Accès Communauté Privée']}
                        />
                    </div>
                </div>
            </section>

            {/* 9. SECURITY (Short band) */}
            <section className="py-12 bg-slate-900 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-400">
                    <div className="flex items-center gap-2">
                        <Lock size={18} /> Données sécurisées
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield size={18} /> Contenu 100% privé
                    </div>
                    <div className="flex items-center gap-2">
                        <Check size={18} /> Conforme RGPD
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe size={18} /> Hébergement France
                    </div>
                </div>
            </section>

            {/* 11. FAQ */}
            <section className="py-24 px-6 md:px-0">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Questions fréquentes</h2>
                    <div className="space-y-4">
                        <FaqItem q="Est-ce vraiment unique ?" a="Oui, chaque contenu est généré de zéro par l'IA en fonction de vos paramètres spécifiques." />
                        <FaqItem q="Est-ce détectable comme IA ?" a="Nous utilisons des algorithmes avancés pour humaniser le contenu et le rendre fluide et naturel." />
                        <FaqItem q="Puis-je modifier le contenu ?" a="Absolument. Vous avez un éditeur complet pour ajuster chaque mot avant l'export." />
                        <FaqItem q="Est-ce que je possède les droits ?" a="Oui, avec les plans Pro et Business, vous avez 100% des droits commerciaux." />
                        <FaqItem q="Pour quel niveau ?" a="Pour tous ! De débutant complet à expert cherchant à gagner du temps." />
                    </div>
                </div>
            </section>

            {/* 10. FINAL CTA */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        Créez ton premier ebook ou ta première formation <span className="text-blue-400">aujourd’hui</span>.
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-1"
                        >
                            Commencer gratuitement
                        </button>
                        <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all">
                            Créer mon contenu avec l’IA
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function ProblemCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 mb-4">
                <Icon size={20} />
            </div>
            <h3 className="text-white font-bold mb-2">{title}</h3>
            <p className="text-sm text-slate-400">{desc}</p>
        </div>
    )
}

function BenefitItem({ text, small }: { text: string, small?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                <Check size={12} />
            </div>
            <span className={`text-slate-300 ${small ? 'text-sm' : ''}`}>{text}</span>
        </div>
    )
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="text-center relative z-10">
            <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                {number}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400">{desc}</p>
        </div>
    )
}

function UseCaseItem({ text, icon: Icon }: { text: string, icon: any }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-colors">
            <div className="text-blue-400"><Icon size={20} /></div>
            <span className="text-white font-medium">{text}</span>
        </div>
    )
}

function StatItem({ value, label }: { value: string, label: string }) {
    return (
        <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-slate-500 uppercase tracking-wider">{label}</div>
        </div>
    )
}

function ComparisonRow({ label, us, them }: { label: string, us: string, them: string }) {
    return (
        <tr className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors">
            <td className="p-4 font-medium text-white">{label}</td>
            <td className="p-4 bg-blue-500/5 text-blue-400 font-semibold">{us}</td>
            <td className="p-4 text-slate-500">{them}</td>
        </tr>
    )
}

function PricingCard({ title, price, period, features, isPopular }: { title: string, price: string, period?: string, features: string[], isPopular?: boolean }) {
    return (
        <div className={`p-8 rounded-3xl border flex flex-col ${isPopular ? 'bg-slate-900 border-blue-500 relative shadow-2xl shadow-blue-900/20' : 'bg-slate-950 border-slate-800'}`}>
            {isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-b-lg">
                    Recommandé
                </div>
            )}
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <div className="mb-6">
                <span className="text-4xl font-bold text-white">{price}</span>
                <span className="text-slate-400 text-sm">{period}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
                {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <Check size={16} className="text-blue-500 flex-shrink-0" />
                        {f}
                    </li>
                ))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-bold transition-colors ${isPopular ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}>
                Choisir
            </button>
        </div>
    )
}

function FaqItem({ q, a }: { q: string, a: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors"
            >
                <span className="font-semibold text-white">{q}</span>
                <ChevronDown className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 text-slate-400 text-sm leading-relaxed">
                            {a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
