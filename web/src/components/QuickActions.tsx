import { BookOpen, GraduationCap, History, Plus } from 'lucide-react';

export function QuickActions() {
    const actions = [
        {
            title: 'Créer un Ebook',
            desc: "Générer avec l'IA",
            icon: BookOpen,
            iconBg: 'bg-blue-50 text-blue-600'
        },
        {
            title: 'Nouvelle Formation',
            desc: 'Démarrer un cours',
            icon: GraduationCap,
            iconBg: 'bg-gray-100 text-gray-600'
        },
        {
            title: 'Historique',
            desc: 'Voir mes générations',
            icon: History,
            iconBg: 'bg-yellow-50 text-yellow-600'
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full lg:w-96">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Actions Rapides</h2>

            <div className="space-y-4">
                {actions.map((action, index) => (
                    <button key={index} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group bg-white text-left">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.iconBg}`}>
                                <action.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                                <p className="text-sm text-gray-500">{action.desc}</p>
                            </div>
                        </div>
                        <Plus size={20} className="text-gray-400 group-hover:text-blue-500" />
                    </button>
                ))}
            </div>
        </div>
    );
}
