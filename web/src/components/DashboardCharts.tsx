import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
    { name: 'Jan', ebooks: 45, training: 28 },
    { name: 'Feb', ebooks: 52, training: 35 },
    { name: 'Mar', ebooks: 48, training: 42 },
    { name: 'Apr', ebooks: 70, training: 55 },
    { name: 'May', ebooks: 85, training: 68 },
    { name: 'Jun', ebooks: 94, training: 78 },
    { name: 'Jul', ebooks: 110, training: 95 },
];

export function DashboardCharts() {
    return (
        <div className="space-y-8">
            {/* Main Growth Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Content Growth</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Ebooks & Training modules created</p>
                    </div>
                    <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer">
                        <option>Last 7 months</option>
                        <option>Last year</option>
                    </select>
                </div>
                <div className="h-[350px] w-full min-h-[350px]">
                    <ResponsiveContainer width="99%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEbooks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorTraining" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1e293b" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#1e293b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xl">
                                                <p className="text-slate-600 dark:text-slate-400 text-xs font-medium mb-2">{label}</p>
                                                <div className="space-y-1">
                                                    <p className="text-blue-500 text-sm font-bold flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                        Ebooks: {payload[0].value}
                                                    </p>
                                                    <p className="text-slate-700 dark:text-slate-300 text-sm font-bold flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-slate-700 dark:bg-slate-400"></span>
                                                        Training: {payload[1].value}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                content={({ payload }) => (
                                    <div className="flex justify-center gap-6 mt-4">
                                        {payload?.map((entry, index) => (
                                            <div key={`item-${index}`} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                <span
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: entry.color }}
                                                />
                                                {entry.value}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                            <Area
                                type="monotone"
                                dataKey="ebooks"
                                name="Ebooks"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorEbooks)"
                            />
                            <Area
                                type="monotone"
                                dataKey="training"
                                name="Training"
                                stroke="#1e293b" // Dark slate for light mode
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTraining)"
                                className="stroke-slate-800 dark:stroke-slate-400" // Tailwind class for dark mode stroke override if supported by recharts (often inline styles override classes, so we might need conditional logic or CSS var)
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
