import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, PlayCircle, Download } from 'lucide-react';

interface Slide {
    title: string;
    content: string[];
    imagePrompt: string;
}

interface Section {
    type: 'intro' | 'content' | 'outro';
    title: string;
    script: string;
    slide: Slide;
}

interface PresentationViewerProps {
    slides?: Slide[]; // Legacy support
    sections?: Section[]; // New structured content
    videoUrl?: string;
    error?: string;
    onClose: () => void;
}

export function PresentationViewer({ slides, sections, videoUrl, error, onClose }: PresentationViewerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Derive active content from either sections or slides
    const activeData = sections || slides?.map(s => ({ slide: s, script: '' })) || [];
    const totalSlides = activeData.length;

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide, totalSlides]);

    if (!activeData || activeData.length === 0) {
        return <div className="text-white">Aucune slide disponible.</div>;
    }

    const currentItem = activeData[currentSlide];
    // If using sections, slide content is in item.slide, otherwise item itself is the slide
    const slideContent = (currentItem as Section).slide || (currentItem as any); // fallback for simplistic mapping above
    const scriptContent = (currentItem as Section).script || "";

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-hidden font-sans text-slate-900">
            {/* Controls */}
            <div className="absolute top-6 right-6 z-50 flex gap-4">
                <button
                    onClick={onClose}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-900 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Split Layout Container */}
            <div className="w-full h-full flex flex-col md:flex-row">

                {/* LEFT SIDE: Content & Typography */}
                <div className="w-full md:w-3/5 h-2/3 md:h-full p-8 md:p-20 flex flex-col justify-center bg-white relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-8 max-w-3xl"
                        >
                            {/* Category / Header Tag */}
                            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                                SLIDE {currentSlide + 1} / {totalSlides}
                            </span>

                            {/* Main Title - Big & Bold like reference */}
                            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
                                {slideContent.title}
                            </h1>

                            {/* Separator Line */}
                            <div className="w-24 h-2 bg-blue-600 rounded-full" />

                            {/* Bullet Points */}
                            <div className="space-y-6 pt-4">
                                {slideContent.content.map((point: string, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (idx * 0.1) }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-1.5 h-1.5 mt-2.5 rounded-full bg-blue-600 flex-shrink-0" />
                                        <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
                                            {point}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Script / Context (Subtle footer) */}
                            {scriptContent && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="pt-12 mt-auto"
                                >
                                    <p className="text-sm text-slate-400 italic font-medium border-l-2 border-slate-200 pl-4 py-1">
                                        "{scriptContent}"
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons (Left aligned, bottom) */}
                    <div className="absolute bottom-12 left-8 md:left-20 flex items-center gap-4">
                        <button
                            onClick={prevSlide}
                            disabled={currentSlide === 0}
                            className="p-3 border border-slate-200 hover:bg-slate-50 disabled:opacity-30 rounded-full transition-all text-slate-900"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            disabled={currentSlide === totalSlides - 1}
                            className="p-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-full transition-all text-white shadow-lg shadow-slate-900/20"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE: Avatar Video (Full Height) */}
                <div className="w-full md:w-2/5 h-1/3 md:h-full bg-white border-l border-slate-100 relative overflow-hidden flex items-center justify-center">
                    {/* Gradient Mask for seamless blending */}
                    <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

                    {videoUrl ? (
                        <VideoPlayer videoUrl={videoUrl} activeData={activeData} onTimeUpdate={(idx) => setCurrentSlide(idx)} />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-6" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Génération de la vidéo en cours...</h3>
                            <p className="text-slate-500 max-w-xs">
                                Cela peut prendre 2 à 5 minutes pour un rendu haute qualité.
                                <br />Vous pouvez quitter cette page, la génération continuera.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

// Sub-component for Video Logic to allow cleaner useRef usage
function VideoPlayer({ videoUrl, activeData, onTimeUpdate }: { videoUrl: string, activeData: any[], onTimeUpdate: (i: number) => void }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [startFailed, setStartFailed] = useState(false);
    const videoRef = useState<HTMLVideoElement | null>(null);

    // Handlers
    const togglePlay = () => {
        const vid = document.getElementById('avatar-video') as HTMLVideoElement;
        if (!vid) return;

        if (vid.paused) {
            vid.play().then(() => {
                setIsPlaying(true);
                setStartFailed(false);
            }).catch(e => console.error("Play failed", e));
        } else {
            vid.pause();
            setIsPlaying(false);
        }
    };

    const downloadVideo = (e: React.MouseEvent) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `Formation-Video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Autoplay effect
    useEffect(() => {
        const vid = document.getElementById('avatar-video') as HTMLVideoElement;
        if (vid) {
            // Attempt autoplay
            vid.play()
                .then(() => setIsPlaying(true))
                .catch((err) => {
                    console.warn("Autoplay blocked by browser:", err);
                    setStartFailed(true);
                    setIsPlaying(false);
                });
        }
    }, [videoUrl]);

    return (
        <div className="relative w-full h-full group cursor-pointer" onClick={togglePlay}>
            <video
                id="avatar-video"
                src={videoUrl}
                playsInline
                className="w-full h-full object-cover scale-105"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    const progress = video.currentTime / video.duration;

                    if (activeData.length > 0 && video.duration) {
                        const totalChars = activeData.reduce((acc, item) => acc + (item.script?.length || 0), 0);
                        let charCountSoFar = 0;

                        for (let i = 0; i < activeData.length; i++) {
                            const sectionLength = activeData[i].script?.length || 0;
                            const sectionStartRatio = charCountSoFar / totalChars;
                            const sectionEndRatio = (charCountSoFar + sectionLength) / totalChars;

                            if (progress >= sectionStartRatio && progress < sectionEndRatio) {
                                onTimeUpdate(i);
                                break;
                            }
                            charCountSoFar += sectionLength;
                        }
                    }
                }}
            />

            {/* Controls Overlay */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100 bg-black/20' : 'opacity-100 bg-black/40'}`}>

                {/* PDF/Video Download Button (Top Right of Video) */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={downloadVideo}
                        className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur rounded-lg text-white transition-colors flex items-center gap-2"
                        title="Télécharger la vidéo"
                    >
                        <Download size={20} />
                        <span className="text-sm font-medium">Télécharger</span>
                    </button>
                </div>

                {/* Big Play Button */}
                <div className="transform transition-transform duration-200 hover:scale-110">
                    <div className="w-20 h-20 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-xl">
                        {isPlaying ? (
                            <div className="w-8 h-8 flex gap-2 justify-center items-center">
                                <div className="w-2.5 h-full bg-slate-900 rounded-sm" />
                                <div className="w-2.5 h-full bg-slate-900 rounded-sm" />
                            </div>
                        ) : (
                            <PlayCircle size={48} className="text-slate-900 ml-2" />
                        )}
                    </div>
                </div>

                {startFailed && !isPlaying && (
                    <p className="mt-4 text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                        Cliquez pour démarrer la vidéo
                    </p>
                )}
            </div>
        </div>
    );
}
