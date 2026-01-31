import { useState, useEffect, useRef } from 'react';
import { Check, Mic, Play, Pause, Loader2 } from 'lucide-react';

interface Voice {
    voice_id: string;
    name: string;
    gender: string;
    preview_url: string;
    category?: string;
}

interface VoiceSelectorProps {
    onSelect: (voiceId: string) => void;
    initialGender?: 'Masculin' | 'Féminin';
}

export function VoiceSelector({ onSelect, initialGender = 'Masculin' }: VoiceSelectorProps) {
    const [voices, setVoices] = useState<{ masculine: Voice[], feminine: Voice[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentGender, setCurrentGender] = useState<'Masculin' | 'Féminin'>(initialGender);
    const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        fetchVoices();
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    async function fetchVoices() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/voices', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setVoices(data.voices);
            }
        } catch (error) {
            console.error("Failed to fetch voices", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handlePlay = (e: React.MouseEvent, previewUrl: string, voiceId: string) => {
        e.stopPropagation(); // Don't select when clicking play

        if (playingPreview === voiceId && audioRef.current) {
            audioRef.current.pause();
            setPlayingPreview(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(previewUrl);
        audioRef.current = audio;
        audio.play();
        setPlayingPreview(voiceId);

        audio.onended = () => {
            setPlayingPreview(null);
        };
    };

    const handleSelect = (voiceId: string) => {
        setSelectedVoiceId(voiceId);
        onSelect(voiceId);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-slate-500">
                <Loader2 className="animate-spin mb-2" size={24} />
                <p className="text-sm">Chargement des voix...</p>
            </div>
        );
    }

    const displayedVoices = currentGender === 'Masculin' ? voices?.masculine : voices?.feminine;

    return (
        <div className="space-y-4">
            <h3 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mic size={18} />
                Choix de la Voix
            </h3>

            {/* Gender Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                    onClick={() => setCurrentGender('Féminin')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-sm font-semibold transition-all ${currentGender === 'Féminin'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    Féminin
                </button>
                <button
                    onClick={() => setCurrentGender('Masculin')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-sm font-semibold transition-all ${currentGender === 'Masculin'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    Masculin
                </button>
            </div>

            {/* Voice Grid */}
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                {displayedVoices?.map((voice) => (
                    <div
                        key={voice.voice_id}
                        onClick={() => handleSelect(voice.voice_id)}
                        className={`relative group rounded-xl border-2 transition-all cursor-pointer p-3 flex items-center justify-between
                            ${selectedVoiceId === voice.voice_id
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                            }`}
                    >
                        <div className="flex-1 min-w-0 mr-2">
                            <p className={`font-semibold text-sm truncate ${selectedVoiceId === voice.voice_id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>
                                {voice.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {voice.category || 'Standard'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {voice.preview_url && (
                                <button
                                    onClick={(e) => handlePlay(e, voice.preview_url, voice.voice_id)}
                                    className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                                >
                                    {playingPreview === voice.voice_id ? <Pause size={14} /> : <Play size={14} />}
                                </button>
                            )}

                            {selectedVoiceId === voice.voice_id && (
                                <div className="text-blue-600 dark:text-blue-400">
                                    <Check size={18} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {(!displayedVoices || displayedVoices.length === 0) && (
                <p className="text-center text-sm text-slate-500 py-4">Aucune voix disponible pour cette catégorie.</p>
            )}
        </div>
    );
}
