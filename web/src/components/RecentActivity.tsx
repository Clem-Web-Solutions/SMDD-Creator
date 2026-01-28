import { CheckCircle2, Clock, Loader2 } from 'lucide-react';

export function RecentActivity() {
    const activities = [
        {
            title: 'Marketing Strategies Ebook',
            time: '2 min ago',
            status: 'Completed',
            credits: '45 credits',
            icon: CheckCircle2,
            color: 'text-green-500',
            bgConfig: 'bg-green-50'
        },
        {
            title: 'Sales Training Module 3',
            time: 'Just now',
            status: 'Processing',
            credits: '120 credits',
            icon: Loader2,
            color: 'text-blue-500',
            bgConfig: 'bg-blue-50'
        },
        {
            title: 'Product Launch Guide',
            time: '15 min ago',
            status: 'Completed',
            credits: '78 credits',
            icon: CheckCircle2,
            color: 'text-green-500',
            bgConfig: 'bg-green-50'
        },
        {
            title: 'Customer Success Playbook',
            time: '1 hour ago',
            status: 'Completed',
            credits: '95 credits',
            icon: CheckCircle2,
            color: 'text-green-500',
            bgConfig: 'bg-green-50'
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="text-blue-500" />
                    <h2 className="text-lg font-bold text-gray-800">Mes Générations IA</h2>
                </div>
                <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    Voir tout
                </button>
            </div>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.bgConfig}`}>
                                <activity.icon size={20} className={activity.color} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">{activity.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock size={12} />
                                    <span>{activity.time}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-1 ${activity.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                }`}>
                                {activity.status}
                            </div>
                            <p className="text-xs text-gray-400">{activity.credits}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    );
}
