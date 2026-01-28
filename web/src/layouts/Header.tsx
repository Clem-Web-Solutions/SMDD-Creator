import { Bell, Search, Menu } from 'lucide-react';

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userName = userInfo.name || 'Thomas M.';
    const userPlan = userInfo.plan === 'free' ? 'Plan Gratuit' : 'Plan Pro';

    // Get initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const userInitials = userInfo.name ? getInitials(userInfo.name) : 'TM';

    return (
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 backdrop-blur-sm">

            {/* Mobile Menu Button & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
                >
                    <Menu size={24} />
                </button>

                {/* Search Bar */}
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 w-full max-w-sm items-center gap-3 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all hidden sm:flex">
                    <Search size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        className="bg-transparent border-none outline-none w-full text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                </div>
                {/* Mobile Search Icon only */}
                <button className="sm:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <Search size={24} />
                </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-6 pl-4">
                <div className="flex items-center gap-2 sm:gap-4">
                    <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-800 cursor-pointer group">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{userName}</p>
                            <p className="text-xs text-slate-500">{userPlan}</p>
                        </div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-slate-900 group-hover:ring-blue-500 transition-all text-sm sm:text-base">
                            {userInitials}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
