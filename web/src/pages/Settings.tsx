import { useState } from 'react';
import { User, Bell, Shield, CreditCard, Globe, Mail, Smartphone, RefreshCw, MessageSquare, Save, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export function Settings() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Paramètres</h1>
                <p className="text-slate-500 dark:text-slate-400">Gérez votre compte, vos préférences et vos paramètres de sécurité.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Tabs Headers */}
                <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 flex overflow-x-auto gap-2">
                    {[
                        { id: 'profile', label: 'Profil', icon: User },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Sécurité', icon: Shield },
                        { id: 'billing', label: 'Facturation', icon: CreditCard },
                        { id: 'preferences', label: 'Préférences', icon: Globe },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap relative ${activeTab === tab.id
                                ? 'text-white'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-blue-600 rounded-lg"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <tab.icon size={18} />
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'profile' && <ProfileTab />}
                            {activeTab === 'notifications' && <NotificationsTab />}
                            {activeTab === 'security' && <SecurityTab />}
                            {activeTab === 'billing' && <BillingTab />}
                            {activeTab === 'preferences' && <PreferencesTab />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function ProfileTab() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Informations du profil</h2>
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-xl">
                        TM
                    </div>
                    <div>
                        <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors mb-2">
                            Changer la photo
                        </button>
                        <p className="text-xs text-slate-500">JPG, PNG ou GIF. Max 2MB.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Prénom</label>
                        <input
                            type="text"
                            defaultValue="Show"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nom</label>
                        <input
                            type="text"
                            defaultValue="Me"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            defaultValue="thomas.m@example.com"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Téléphone</label>
                        <input
                            type="tel"
                            defaultValue="+33 6 12 34 56 78"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                    <textarea
                        rows={3}
                        defaultValue="Créateur de contenu et entrepreneur digital."
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                    />
                </div>

                <div className="flex justify-end">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                        <Save size={18} />
                        <span>Enregistrer les modifications</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function NotificationsTab() {
    return (
        <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Préférences de notification</h2>
            <div className="space-y-6">
                {[
                    { icon: Mail, title: "Notifications par email", desc: "Recevez des mises à jour par email", defaultChecked: true },
                    { icon: Smartphone, title: "Notifications push", desc: "Recevez des notifications sur votre appareil", defaultChecked: false },
                    { icon: RefreshCw, title: "Mises à jour produit", desc: "Nouvelles fonctionnalités et améliorations", defaultChecked: true },
                    { icon: MessageSquare, title: "Communications marketing", desc: "Offres spéciales et promotions", defaultChecked: true },
                ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-800 last:border-0">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${index % 2 === 0 ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                <item.icon size={20} />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SecurityTab() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Changer le mot de passe</h2>
                <div className="space-y-4 max-w-xl">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mot de passe actuel</label>
                        <input type="password" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nouveau mot de passe</label>
                        <input type="password" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirmer le mot de passe</label>
                        <input type="password" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
                        Mettre à jour le mot de passe
                    </button>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Authentification à deux facteurs</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Activer la 2FA</p>
                        <p className="text-sm text-slate-500">Sécurisez votre compte avec l'authentification à deux facteurs</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-red-500 mb-4">Zone de danger</h2>
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl p-6">
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Une fois votre compte supprimé, toutes vos données seront définitivement effacées.</p>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Trash2 size={18} />
                        <span>Supprimer mon compte</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function BillingTab() {
    return (
        <div className="space-y-8">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Plan actuel</h2>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg shadow-blue-900/40">Pro</span>
                </div>
                <p className="text-slate-500 text-sm mb-6">Gérez votre abonnement</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-500 mb-2">Crédits mensuels</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">5,000</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-500 mb-2">Crédits utilisés</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">2,550</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-500 mb-2">Prochain renouvellement</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">15 Fév</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
                        Changer de plan
                    </button>
                    <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Acheter des crédits
                    </button>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Méthode de paiement</h2>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between mb-4 bg-slate-50 dark:bg-slate-950">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold font-mono">
                            VISA
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">•••• •••• •••• 4242</p>
                            <p className="text-xs text-slate-500">Expire 12/2025</p>
                        </div>
                    </div>
                    <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        Modifier
                    </button>
                </div>
                <button className="text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-500/50 transition-colors flex items-center gap-2">
                    <Plus size={16} />
                    Ajouter une carte
                </button>
            </div>
        </div>
    );
}

function PreferencesTab() {
    const { theme: currentTheme, setTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(currentTheme === 'system' ? 'Système' : (currentTheme === 'dark' ? 'Sombre' : 'Clair'));

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTheme(e.target.value);
    };

    const handleSave = () => {
        const themeValue = selectedTheme === 'Système' ? 'system' : (selectedTheme === 'Sombre' ? 'dark' : 'light');
        setTheme(themeValue);
    };

    return (
        <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Préférences d'affichage</h2>
            <div className="space-y-6 max-w-xl">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Langue</label>
                    <div className="relative">
                        <select className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white appearance-none">
                            <option>Français</option>
                            <option>English</option>
                            <option>Español</option>
                        </select>
                        <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Thème</label>
                    <div className="relative">
                        <select
                            value={selectedTheme}
                            onChange={handleThemeChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white appearance-none"
                        >
                            <option value="Sombre">Sombre</option>
                            <option value="Clair">Clair</option>
                            <option value="Système">Système</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Fuseau horaire</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
                        <option>Europe/Paris (UTC+1)</option>
                        <option>Europe/London (UTC+0)</option>
                        <option>America/New_York (UTC-5)</option>
                    </select>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                    >
                        <Save size={18} />
                        <span>Enregistrer les préférences</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
