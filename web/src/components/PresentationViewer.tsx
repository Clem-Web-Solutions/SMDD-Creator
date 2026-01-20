import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

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
    onClose: () => void;
}

export function PresentationViewer({ slides, sections, videoUrl, onClose }: PresentationViewerProps) {
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
        <div className="fixed inset-0 bg-black z-50 overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black z-0" />

            {/* Controls */}
            <div className="absolute top-4 right-4 z-50 flex gap-4">
                <button
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Slides Container */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-8 md:p-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="w-full max-w-6xl h-full flex flex-col md:flex-row gap-8 items-center"
                    >
                        {/* Slide Content */}
                        <div className="flex-1 text-left space-y-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold tracking-wider">
                                SLIDE {currentSlide + 1} / {totalSlides}
                            </span>

                            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-tight">
                                {slideContent.title}
                            </h1>

                            <div className="space-y-4">
                                {slideContent.content.map((point: string, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (idx * 0.1) }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-2 h-2 mt-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                                        <p className="text-xl text-slate-300 leading-relaxed">
                                            {point}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Script Teleprompter (New Feature) */}
                            {scriptContent && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-8 p-6 bg-black/40 border border-white/10 rounded-xl backdrop-blur-sm"
                                >
                                    <p className="text-slate-400 text-sm italic mb-2">Script Narrateur :</p>
                                    <p className="text-lg text-white font-medium leading-relaxed">
                                        "{scriptContent}"
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Visual / Image Placeholder */}
                        <div className="flex-1 w-full h-[300px] md:h-[500px] bg-gradient-to-tr from-slate-800 to-slate-700 rounded-2xl border border-slate-700/50 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                            {/* Decorative elements */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/20 blur-3xl rounded-full" />
                            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/20 blur-3xl rounded-full" />

                            <p className="relative z-10 text-slate-500 text-center px-6 italic">
                                « {slideContent.imagePrompt || "Visual placeholder"} »
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Avatar Bubble (Bottom Right) */}
            {videoUrl && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    className="absolute bottom-8 right-8 z-40 w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden bg-black"
                >
                    <video
                        src={videoUrl}
                        autoPlay
                        // loop // Don't loop presentation video?
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="p-4 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-full transition-all"
                >
                    <ChevronLeft className="text-white" />
                </button>
                <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                    />
                </div>
                <button
                    onClick={nextSlide}
                    disabled={currentSlide === totalSlides - 1}
                    className="p-4 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-full transition-all"
                >
                    <ChevronRight className="text-white" />
                </button>
            </div>
        </div>
    );
}
