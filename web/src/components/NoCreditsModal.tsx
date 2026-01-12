import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CreditCard, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NoCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    required: number;
    current: number;
}

const PLANS = [
    {
        id: 'free',
        name: 'Découverte',
        price: '0€',
        credits: 300,
        features: ['300 crédits offerts', '1 Ebook complet', 'Fonctionnalités de base', 'Export PDF avec filigrane'],
        color: 'bg-slate-100 dark:bg-slate-800',
        textColor: 'text-slate-900 dark:text-white',
        btnColor: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '20€',
        credits: 1500,
        features: ['1500 crédits / mois', '~ 5 Ebooks ou Formations', 'Exports sans filigrane', 'Mode Expert IA', 'Support prioritaire', 'Accès Communauté Privée'],
        color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-900 dark:text-blue-100',
        btnColor: 'bg-blue-600 hover:bg-blue-500 text-white',
        popular: true
    },
    {
        id: 'enterprise',
        name: 'Business',
        price: '50€',
        credits: 5000,
        features: ['5000 crédits / mois', 'Licence revendeur', 'API Access', 'White Label', 'Account Manager dédié', 'Accès Communauté Privée'],
        color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
        textColor: 'text-purple-900 dark:text-purple-100',
        btnColor: 'bg-purple-600 hover:bg-purple-500 text-white'
    }
];

export function NoCreditsModal({ isOpen, onClose, required, current }: NoCreditsModalProps) {
    const navigate = useNavigate();
    const [view, setView] = useState<'initial' | 'plans' | 'recharge'>('initial');
    const [userPlan, setUserPlan] = useState<string>('free');
    const [rechargeAmount, setRechargeAmount] = useState<number>(50);

    const PRICE_PER_10_CREDITS = 2.99;
    const calculatePrice = (credits: number) => ((credits / 10) * PRICE_PER_10_CREDITS).toFixed(2);

    useEffect(() => {
        if (isOpen) {
            try {
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    const user = JSON.parse(userInfo);
                    if (user.plan) {
                        setUserPlan(user.plan);
                    }
                }
            } catch (e) {
                console.error("Failed to parse user info", e);
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-0 w-full overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 ${view === 'plans' ? 'max-w-5xl' : 'max-w-lg'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {view === 'initial' ? (
                        <>
                            {/* Header */}
                            <div className="p-8 pb-4 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-red-500/20">
                                    <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                    Plus de crédits ?
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                                    Il vous manque <span className="font-bold text-slate-900 dark:text-white">{required - current} crédits</span> pour cette action.
                                </p>
                            </div>

                            {/* Options */}
                            <div className="p-8 pt-2 space-y-6">
                                <button
                                    onClick={() => setView('plans')}
                                    className="w-full group relative flex items-center p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 text-left gap-5"
                                >
                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                        <Zap size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">M'abonner / Upgrader</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-normal">Pour avoir plus de crédits tous les mois</p>
                                    </div>
                                    <ArrowRight className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" size={24} />
                                </button>

                                <button
                                    onClick={() => setView('recharge')}
                                    className="w-full group relative flex items-center p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-green-500 dark:hover:border-green-500 bg-white dark:bg-slate-800/50 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all duration-300 text-left gap-5"
                                >
                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                        <CreditCard size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Achat unique</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-normal">Juste un pack de crédits, sans engagement</p>
                                    </div>
                                    <ArrowRight className="text-slate-300 dark:text-slate-600 group-hover:text-green-500 transition-colors" size={24} />
                                </button>
                            </div>
                        </>
                    ) : view === 'plans' ? (
                        <div className="p-8 max-h-[80vh] overflow-y-auto w-full">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Choisissez votre plan</h3>
                                <p className="text-slate-500 dark:text-slate-400">Débloquez plus de puissance créative avec nos offres premium</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {PLANS.map((plan) => {
                                    const isCurrentPlan = plan.id === userPlan;
                                    return (
                                        <div key={plan.name} className={`relative p-6 rounded-2xl border-2 flex flex-col transition-all ${isCurrentPlan ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 opacity-100' : `${plan.color} hover:scale-[1.02] hover:shadow-xl`}`}>
                                            {plan.popular && !isCurrentPlan && (
                                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-900/20">
                                                    Recommandé
                                                </span>
                                            )}
                                            {isCurrentPlan && (
                                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                    Actuel
                                                </span>
                                            )}
                                            <div className="mb-6 text-center">
                                                <h4 className={`text-lg font-bold mb-2 ${plan.textColor}`}>{plan.name}</h4>
                                                <div className="flex items-center justify-center gap-1 mb-2">
                                                    <span className={`text-3xl font-extrabold ${plan.textColor}`}>{plan.price}</span>
                                                    <span className={`text-sm opacity-70 ${plan.textColor}`}>/mois</span>
                                                </div>
                                                <div className={`inline-block px-3 py-1 rounded-full bg-white/50 dark:bg-black/20 text-xs font-bold ${plan.textColor}`}>
                                                    {plan.credits} crédits
                                                </div>
                                            </div>

                                            <ul className="space-y-3 mb-8 flex-1">
                                                {plan.features.map(feature => (
                                                    <li key={feature} className={`text-sm flex items-center gap-2 ${plan.textColor} opacity-90`}>
                                                        <div className="min-w-[16px]"><Check size={16} /></div>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={() => {
                                                    if (!isCurrentPlan) {
                                                        onClose();
                                                        navigate('/settings');
                                                    }
                                                }}
                                                disabled={isCurrentPlan}
                                                className={`w-full py-3 rounded-xl text-sm font-bold transition-transform ${isCurrentPlan
                                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                                                    : `${plan.btnColor} active:scale-95`
                                                    }`}
                                            >
                                                {isCurrentPlan ? 'Votre plan actuel' : `Choisir ${plan.name}`}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="text-center mt-8">
                                <button
                                    onClick={() => setView('initial')}
                                    className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
                                >
                                    Retour aux options
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Recharge View
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Recharger des crédits</h3>
                                <p className="text-slate-500 dark:text-slate-400">Achetez des crédits ponctuels, valables sans limite de temps</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[50, 150, 350].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setRechargeAmount(amount)}
                                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${rechargeAmount === amount
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-700 text-slate-600 dark:text-slate-400'
                                            }`}
                                    >
                                        <span className="text-2xl font-bold">{amount}</span>
                                        <span className="text-xs uppercase font-medium">Crédits</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Ou entrez un montant personnalisé
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            min="50"
                                            value={rechargeAmount}
                                            onChange={(e) => setRechargeAmount(Math.max(50, parseInt(e.target.value) || 0))}
                                            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all font-bold text-lg text-slate-900 dark:text-white"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">crédits</span>
                                    </div>
                                    <div className="text-right min-w-[120px]">
                                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Prix total</div>
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{calculatePrice(rechargeAmount)}€</div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Minimum 50 crédits. Taux: 2.99€ pour 10 crédits.</p>
                            </div>

                            <button
                                onClick={() => { onClose(); navigate('/settings'); }}
                                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <CreditCard size={20} />
                                Payer {calculatePrice(rechargeAmount)}€
                            </button>

                            <div className="text-center mt-6">
                                <button
                                    onClick={() => setView('initial')}
                                    className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
                                >
                                    Retour aux options
                                </button>
                            </div>
                        </div>
                    )}

                    {view === 'initial' && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                            <button
                                onClick={onClose}
                                className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                            >
                                Annuler et fermer
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
