import { ArrowRight, BookOpen, GraduationCap, Sparkles, Wand2, Check, Zap, Globe, Shield, Play, Users, Star, X, ChevronDown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useState, useRef } from 'react';

export function Landing() {
    const heroRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();

    return (
        <div className="overflow-hidden bg-[#020617] font-sans selection:bg-electric/30">
            {/* 1. HERO SECTION */}
            <section ref={heroRef} className="relative h-[200vh]"> {/* 200vh: 1 screen static + 1 screen scroll travel */}

                {/* Fixed Content: Background & Text */}
                <div className="sticky top-0 h-screen overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-electric/20 rounded-full blur-[120px] opacity-60" />
                        <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] opacity-40" />
                    </div>

                    <div className="max-w-7xl mx-auto flex flex-col items-center pt-32 md:pt-48 px-6 text-center relative z-10">
                        <HeroText />
                    </div>

                    {/* The Sticky Image Component */}
                    <HeroImage parentRef={heroRef} />
                </div>
            </section>

            {/* 2. PROBLEM -> SOLUTION */}
            <section className="pt-32 pb-32 border-t border-white/5 bg-[#03091e] relative z-40 -mt-[50vh]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 tracking-tight">Pourquoi c'est si dur de créer du contenu ?</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <ProblemCard icon={X} title="Trop long" desc="Créer un ebook prend des semaines de rédaction." />
                        <ProblemCard icon={X} title="Complexe" desc="Structurer une formation pédagogique est un métier." />
                        <ProblemCard icon={X} title="Page blanche" desc="Le manque d'idées bloque 80% des créateurs." />
                    </div>
                    <div className="relative p-1 bg-gradient-to-r from-electric/20 via-blue-500/20 to-electric/20 rounded-3xl">
                        <div className="bg-[#0B1121] rounded-[22px] p-10 border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-electric to-transparent" />
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-electric text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-electric/20">
                                La Solution
                            </div>
                            <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
                                Notre IA s’occupe de tout, <br />
                                <span className="text-electric">de l’idée à la publication</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FUNCTIONALITIES (Bento Grid) */}
            <section id="features" className="py-32 px-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric/20 rounded-full blur-[128px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">Tout pour réussir.</h2>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">Ne vendez pas du temps, vendez des résultats. Notre suite d'outils est conçue pour la performance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Ebook Card */}
                        <div className="bg-[#0B1121] border border-white/5 p-8 rounded-3xl md:col-span-2 hover:border-electric/30 transition-all group relative overflow-hidden hover:shadow-[0_0_40px_-10px_rgba(43,111,255,0.1)]">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BookOpen size={120} />
                            </div>
                            <div className="w-14 h-14 bg-electric/10 rounded-2xl flex items-center justify-center text-electric mb-8 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-6">Création d’Ebooks IA</h3>
                            <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                                <BenefitItem text="Génération automatique de chapitres" />
                                <BenefitItem text="Ton personnalisable (expert, vendeur...)" />
                                <BenefitItem text="Structuration logique & fluide" />
                                <BenefitItem text="Export PDF / EPUB / DOC" />
                            </div>
                        </div>

                        {/* Bonus IA Card */}
                        <div className="bg-[#0B1121] border border-white/5 p-8 rounded-3xl flex flex-col justify-center hover:border-amber-500/30 transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-8">
                                <Wand2 size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-6">Bonus IA</h3>
                            <ul className="space-y-4 relative z-10">
                                <BenefitItem text="Réécriture & amélioration" small />
                                <BenefitItem text="SEO & copywriting" small />
                                <BenefitItem text="Traduction multilingue" small />
                            </ul>
                        </div>

                        {/* Formation Card */}
                        <div className="bg-[#0B1121] border border-white/5 p-10 rounded-3xl md:col-span-3 hover:border-electric/30 transition-all group relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric/5 rounded-full blur-[100px] pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                                <div className="flex-1">
                                    <div className="w-14 h-14 bg-electric/10 rounded-2xl flex items-center justify-center text-electric mb-8">
                                        <GraduationCap size={28} />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-6">Création de Formations IA</h3>
                                    <p className="text-slate-400 mb-8 max-w-xl text-lg leading-relaxed">
                                        Transformez votre expertise en cours complets. L'IA génère le plan, les leçons, et même les exercices pour vos étudiants.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="bg-white/5 text-slate-300 px-4 py-2 rounded-lg text-sm border border-white/10 font-medium">Plan intelligent</span>
                                        <span className="bg-white/5 text-slate-300 px-4 py-2 rounded-lg text-sm border border-white/10 font-medium">Modules automatiques</span>
                                        <span className="bg-white/5 text-slate-300 px-4 py-2 rounded-lg text-sm border border-white/10 font-medium">Scripts vidéo</span>
                                        <span className="bg-white/5 text-slate-300 px-4 py-2 rounded-lg text-sm border border-white/10 font-medium">Quiz & Exercices</span>
                                    </div>
                                </div>
                                <div className="w-full md:w-2/5 bg-[#020617] rounded-2xl border border-white/10 p-6 shadow-2xl">
                                    <div className="space-y-4">
                                        <div className="h-2 bg-white/10 rounded w-1/2 mb-6" />
                                        <div className="flex gap-4 items-center p-3 rounded-lg bg-white/5 border border-white/5">
                                            <div className="w-8 h-8 rounded-full bg-electric/20 flex items-center justify-center text-sm font-bold text-electric">1</div>
                                            <div className="flex-1">
                                                <div className="h-2 bg-white/20 rounded w-3/4 mb-2" />
                                                <div className="h-2 bg-white/10 rounded w-1/2" />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-center p-3 rounded-lg border border-white/5 opacity-50">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-slate-500">2</div>
                                            <div className="flex-1">
                                                <div className="h-2 bg-white/20 rounded w-2/3 mb-2" />
                                                <div className="h-2 bg-white/10 rounded w-1/3" />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-center p-3 rounded-lg border border-white/5 opacity-50">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-slate-500">3</div>
                                            <div className="flex-1">
                                                <div className="h-2 bg-white/20 rounded w-3/4 mb-2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section id="how-it-works" className="py-24 bg-[#020617] relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16 tracking-tight">
                        3 étapes, <span className="text-electric">zéro effort</span>.
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-electric/0 via-electric/50 to-electric/0" />

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
                </div>
            </section>

            {/* 5. USE CASES */}
            <section className="py-24 px-6 border-y border-white/5 bg-[#03091e]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Fait pour tous ceux qui veulent <br />
                                <span className="text-electric">vendre leur savoir</span>.
                            </h2>
                            <p className="text-slate-400 text-lg mb-10 max-w-lg">
                                Que vous soyez débutant ou expert, SMDD Creator accélère votre production par 10.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <UseCaseItem text="Coaches & formateurs" icon={Users} />
                                <UseCaseItem text="Infopreneurs" icon={Zap} />
                                <UseCaseItem text="Freelances" icon={Globe} />
                                <UseCaseItem text="Écoles en ligne" icon={GraduationCap} />
                            </div>
                        </div>
                        <div className="md:w-1/2 relative">
                            <div className="absolute inset-0 bg-electric/20 blur-[100px] rounded-full" />
                            <div className="relative bg-[#0B1121] border border-white/10 rounded-3xl p-10 shadow-2xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full border-2 border-white/10" />
                                    <div>
                                        <div className="text-white font-bold text-lg">Thomas L.</div>
                                        <div className="text-electric text-sm font-medium">Coach Business</div>
                                    </div>
                                    <div className="ml-auto flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />)}
                                    </div>
                                </div>
                                <p className="text-slate-300 italic text-lg leading-relaxed">
                                    "J'ai créé ma formation complète en un week-end au lieu de 2 mois. La qualité du plan généré m'a bluffé, je n'ai eu qu'à ajouter ma touche personnelle."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. SOCIAL PROOF */}
            <section className="py-20 bg-[#020617] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium border border-yellow-500/20 mb-8">
                        <Star size={14} fill="currentColor" />
                        <span>Rejoignez l'élite des créateurs</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatItem value="+10 000" label="Ebooks créés" />
                        <StatItem value="+5 000" label="Formations générées" />
                        <StatItem value="98%" label="Satisfaction client" />
                        <StatItem value="24/7" label="Support disponible" />
                    </div>
                </div>
            </section>

            {/* 7. COMPARISON */}
            <section className="py-24 px-6 bg-[#03091e]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-16">Pourquoi nous et pas ChatGPT ?</h2>
                    <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#0B1121]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 text-slate-400 font-medium border-b border-white/5">Fonctionnalité</th>
                                    <th className="p-6 text-electric font-bold bg-electric/5 border-b border-electric/10 w-1/3">SMDD Creator</th>
                                    <th className="p-6 text-slate-500 font-medium border-b border-white/5 w-1/3 bg-slate-900/50">Autres outils / ChatGPT</th>
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
            <section id="pricing" className="py-24 px-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Des tarifs simples.</h2>
                        <p className="text-slate-400 text-lg">Commencez gratuitement, passez pro quand vous voulez.</p>
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
            <section className="py-12 bg-[#020617] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                        <Lock size={18} className="text-slate-400" /> Données sécurisées
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-slate-400" /> Contenu 100% privé
                    </div>
                    <div className="flex items-center gap-2">
                        <Check size={18} className="text-slate-400" /> Conforme RGPD
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe size={18} className="text-slate-400" /> Hébergement France
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
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-electric/20" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                        Créez ton premier ebook ou ta première formation <span className="text-electric">aujourd’hui</span>.
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full sm:w-auto bg-electric hover:bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-electric/25 hover:shadow-electric/40 transition-all transform hover:-translate-y-1"
                        >
                            Commencer gratuitement
                        </button>
                        <button className="w-full sm:w-auto bg-[#0B1121] hover:bg-slate-800 text-white px-10 py-5 rounded-full font-bold text-lg border border-white/10 transition-all">
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
        <div className="p-8 rounded-3xl bg-[#0B1121] border border-white/5 text-left hover:border-electric/30 transition-all duration-300 hover:shadow-2xl hover:shadow-electric/5 group">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon size={26} />
            </div>
            <h3 className="text-xl text-white font-bold mb-3 group-hover:text-electric transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{desc}</p>
        </div>
    )
}

function BenefitItem({ text, small }: { text: string, small?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-electric/20 flex items-center justify-center flex-shrink-0 text-electric border border-electric/20">
                <Check size={12} strokeWidth={3} />
            </div>
            <span className={`text-slate-300 font-medium ${small ? 'text-sm' : ''}`}>{text}</span>
        </div>
    )
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="text-center relative z-10 group">
            <div className="w-16 h-16 rounded-2xl bg-[#0B1121] border border-white/10 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-8 shadow-xl shadow-black/20 group-hover:border-electric/50 group-hover:text-electric transition-colors duration-300">
                {number}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed px-4">{desc}</p>
        </div>
    )
}

function UseCaseItem({ text, icon: Icon }: { text: string, icon: any }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0B1121] border border-white/5 hover:border-electric/30 transition-colors group cursor-default">
            <div className="text-slate-400 group-hover:text-electric transition-colors"><Icon size={20} /></div>
            <span className="text-slate-200 font-medium group-hover:text-white transition-colors">{text}</span>
        </div>
    )
}

function StatItem({ value, label }: { value: string, label: string }) {
    return (
        <div>
            <div className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">{value}</div>
            <div className="text-sm text-electric font-bold uppercase tracking-wider">{label}</div>
        </div>
    )
}

function ComparisonRow({ label, us, them }: { label: string, us: string, them: string }) {
    return (
        <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
            <td className="p-6 font-medium text-slate-300 border-r border-white/5">{label}</td>
            <td className="p-6 bg-electric/5 text-electric font-bold border-r border-electric/10 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1 bg-electric shadow-[0_0_10px_theme(colors.electric)]" />
                {us}
            </td>
            <td className="p-6 text-slate-500 bg-slate-900/30">{them}</td>
        </tr>
    )
}

function PricingCard({ title, price, period, features, isPopular }: { title: string, price: string, period?: string, features: string[], isPopular?: boolean }) {
    return (
        <div className={`p-8 rounded-[32px] border flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${isPopular ? 'bg-[#0B1121] border-electric shadow-2xl shadow-electric/10' : 'bg-[#0B1121]/50 border-white/5 hover:border-white/10 hover:shadow-electric/5'}`}>
            {isPopular && (
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-electric to-transparent shadow-[0_0_20px_theme(colors.electric)]" />
            )}
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-electric text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-lg shadow-electric/20">
                    Populaire
                </div>
            )}

            <h3 className={`text-xl font-bold mb-4 ${isPopular ? 'text-white' : 'text-slate-200'}`}>{title}</h3>
            <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white tracking-tight">{price}</span>
                <span className="text-slate-400 font-medium">{period}</span>
            </div>

            <div className={`h-px w-full mb-8 ${isPopular ? 'bg-white/10' : 'bg-white/5'}`} />

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                        <Check size={16} className={`flex-shrink-0 mt-0.5 ${isPopular ? 'text-electric' : 'text-slate-500'}`} strokeWidth={3} />
                        {f}
                    </li>
                ))}
            </ul>
            <button className={`w-full py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-0.5 ${isPopular ? 'bg-electric hover:bg-blue-600 text-white shadow-lg shadow-electric/25' : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                }`}>
                Choisir
            </button>
        </div>
    )
}

function FaqItem({ q, a }: { q: string, a: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/5 rounded-2xl bg-[#0B1121] overflow-hidden transition-all duration-300 hover:border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-bold text-lg text-white">{q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-electric text-white rotate-180' : 'bg-white/5 text-slate-400'}`}>
                    <ChevronDown size={18} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5 mt-2">
                            {a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
function HeroText() {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    return (
        <motion.div
            className="max-w-4xl mx-auto"
        >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric/10 text-electric text-sm font-bold border border-electric/20 mb-8 backdrop-blur-sm shadow-[0_0_20px_-5px_var(--tw-colors-electric)] shadow-electric/20">
                <Sparkles size={14} />
                <span>La référence des créateurs de contenu IA</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
                Créez Ebooks et Formations <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric via-blue-400 to-electric animate-gradient bg-[length:200%_auto]">en quelques minutes.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Générez du contenu structuré, professionnel et prêt à vendre, sans écrire une ligne. L'IA s'occupe de tout.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full sm:w-auto bg-electric hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-electric/25 hover:shadow-electric/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                    Créer mon premier ebook
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center flex items-center justify-center gap-2 backdrop-blur-sm">
                    <Play size={20} fill="currentColor" />
                    Voir une démo
                </button>
            </div>
        </motion.div>
    )
}
function HeroImage({ parentRef }: { parentRef: React.RefObject<HTMLElement | null> }) {
    // Sync animation with the scroll progress of the parent section
    const { scrollYProgress } = useScroll({
        target: parentRef,
        offset: ["start start", "end end"]
    });

    // Animate from 0 to 1 (start to end of the sticky capability)
    const imageY = useTransform(scrollYProgress, [0, 1], ["0vh", "-75vh"]);
    const imageScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.05]);
    const rotateX = useTransform(scrollYProgress, [0, 0.5], [20, 0]); // Straighten halfway through

    // Mouse Parallax (kept for extra juice)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    }

    const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });
    const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });

    return (
        <div
            style={{ height: '150vh' }} // Make the container tall to allow scrolling "through" the animation
            className="absolute top-0 left-0 w-full pointer-events-none z-30" // Increased Z-index to be above text (z-10)
        >
            <div className="sticky top-0 h-screen flex flex-col items-center justify-start overflow-hidden">
                <div
                    className="w-full max-w-6xl relative z-20 perspective-1000 group pointer-events-auto mt-[80vh]" // Sweet spot: visible but not overlapping buttons
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
                >
                    {/* Glows behind the mockup */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-electric via-purple-600 to-electric rounded-[32px] blur opacity-30 animate-pulse" />

                    <motion.div
                        style={{
                            y: imageY,
                            scale: imageScale,
                            rotateX: rotateX,
                        }}
                        className="relative rounded-[30px] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl bg-[#020617] origin-center"
                    >
                        {/* Parallax Inner Container */}
                        <motion.div style={{
                            rotateY: rotateYSpring,
                            rotateX: rotateXSpring
                        }}
                        >
                            <img
                                src="/dashboard.png"
                                alt="Dashboard Interface"
                                className="w-full h-auto object-cover relative z-10"
                            />
                            {/* Reflection/Sheen effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none z-20" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
