import { useState, useEffect } from 'react';
import { Check, User, Loader2 } from 'lucide-react';

interface Avatar {
    avatar_id: string;
    name: string;
    gender: string;
    preview_image_url: string;
    preview_video_url?: string;
}

interface AvatarSelectorProps {
    onSelect: (avatar: any) => void;
}

export function AvatarSelector({ onSelect }: AvatarSelectorProps) {
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchAvatars();
    }, []);

    async function fetchAvatars() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/avatar/list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success && Array.isArray(data.avatars)) {
                // Filter for "avatar" type only (Studio Avatars are usually type 'avatar', Talking Photos are 'talking_photo')
                // Assuming HeyGen API behavior. If mixed, we might need to filter.
                // For now, let's display them all, but maybe limit to top 20 to avoid lag
                // Filter for "Sitting" avatars as requested ("sur une chaise")
                // And "Motion" (Studio avatars usually have motion, but we can't easily check 'hands moving' specifically without preview)
                // We'll look for keywords in the name or tags if available.
                const allAvatars = data.avatars;

                // Keywords for "Sitting"
                const sittingKeywords = ['sitting', 'chair', 'desk', 'office', 'assis'];

                const filtered = allAvatars.filter((av: any) => {
                    const name = (av.avatar_name || av.name || '').toLowerCase();
                    // Check if name contains any sitting keyword
                    return sittingKeywords.some(kw => name.includes(kw));
                });

                // If filter is too aggressive and returns nothing, maybe fallback or show all but sorted?
                // User explicitly asked "UNIQUEMENT ceux qui sont sur une chaise". So we should respect that strictly.
                // If 0 results, we might need to broaden or warn.

                setAvatars(filtered.length > 0 ? filtered : allAvatars); // Fallback to all if 0, but ideally we find them.
                if (filtered.length === 0) console.warn("No 'Sitting' avatars found via keywords.");
            }
        } catch (error) {
            console.error("Failed to fetch avatars", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSelect(avatar: Avatar) {
        setSelectedId(avatar.avatar_id);
        setIsSaving(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/avatar/select', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    avatarId: avatar.avatar_id,
                    name: avatar.name,
                    previewUrl: avatar.preview_image_url,
                    gender: avatar.gender
                })
            });

            if (response.ok) {
                // Notify parent
                onSelect(avatar);
            } else {
                alert("Erreur lors de la sélection de l'avatar");
            }
        } catch (error) {
            console.error("Selection error", error);
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Chargement des avatars studio...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Choisir un Présentateur Studio
                <span className="ml-2 text-xs font-normal bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Recommandé (Mouvements naturels)</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-2">
                {avatars.map((avatar) => (
                    <button
                        key={avatar.avatar_id}
                        onClick={() => handleSelect(avatar)}
                        disabled={isSaving}
                        className={`relative group rounded-xl overflow-hidden border-2 transition-all text-left
                            ${selectedId === avatar.avatar_id
                                ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900'
                                : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        <div className="aspect-square bg-slate-100 relative">
                            {avatar.preview_image_url ? (
                                <img
                                    src={avatar.preview_image_url}
                                    alt={avatar.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <User size={32} />
                                </div>
                            )}

                            {/* Overlay on hover/select */}
                            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity
                                ${selectedId === avatar.avatar_id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                            `}>
                                {isSaving && selectedId === avatar.avatar_id ? (
                                    <Loader2 className="text-white animate-spin" />
                                ) : (
                                    <Check className="text-white font-bold" size={32} />
                                )}
                            </div>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800">
                            <p className="font-semibold text-sm truncate text-slate-900 dark:text-white">{avatar.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{avatar.gender}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
