import { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    trend: string;
    trendUp: boolean;
    iconBg: string;
    iconColor: string;
}

function StatCard({ icon: Icon, title, value, trend, trendUp, iconBg, iconColor }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group shadow-sm hover:shadow-md dark:shadow-none">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>
                    <Icon size={24} className="opacity-90" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                    {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend}
                </div>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{value}</p>
        </div>
    );
}

export function DashboardStats() {
    // Get user info from localStorage
    const [user, setUser] = useState<any>(() => {
        const userInfoStr = localStorage.getItem('userInfo');
        return userInfoStr ? JSON.parse(userInfoStr) : null;
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:3001/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Merge with existing token
                    const updatedUser = { ...data, token };
                    localStorage.setItem('userInfo', JSON.stringify(updatedUser)); // Update local storage
                    setUser(updatedUser); // Update state
                    window.dispatchEvent(new Event('userDataUpdated')); // Sync Sidebar
                }
            } catch (error) {
                console.error("Failed to sync user data", error);
            }
        };

        fetchUserData();
    }, []);

    // Determine max credits based on plan
    let maxCredits = 300;
    if (user?.plan === 'pro') maxCredits = 1500;
    if (user?.plan === 'enterprise') maxCredits = 5000;

    const currentCredits = user?.credits || 0;
    const percentage = (currentCredits / maxCredits) * 100;

    const stats = [
        {
            title: 'Mes Ebooks',
            value: '12',
            trend: '+2 ce mois',
            trendUp: true,
            iconBg: 'bg-blue-100 dark:bg-blue-500/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
            icon: BookOpen,
        },
        {
            title: 'Formations en cours',
            value: '3',
            trend: '1 terminée',
            trendUp: true,
            iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            icon: GraduationCap,
        },
        {
            title: 'Crédits IA',
            value: `${currentCredits}`,
            trend: `${Math.round(percentage)}% restants`,
            trendUp: percentage > 20,
            iconBg: 'bg-purple-100 dark:bg-purple-500/20',
            iconColor: 'text-purple-600 dark:text-purple-400',
            icon: Sparkles,
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    icon={stat.icon}
                    title={stat.title}
                    value={stat.value}
                    trend={stat.trend}
                    trendUp={stat.trendUp}
                    iconBg={stat.iconBg}
                    iconColor={stat.iconColor}
                />
            ))}
        </div>
    );
}
