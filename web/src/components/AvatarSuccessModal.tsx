import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface AvatarSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
    videoUrl?: string | null;
    avatar?: any; // Legacy prop support
}

export const AvatarSuccessModal: React.FC<AvatarSuccessModalProps> = ({ isOpen, onClose, onContinue, videoUrl, avatar }) => {
    // const navigate = useNavigate();

    // Fallback if using legacy avatar prop
    const finalVideoUrl = videoUrl || avatar?.videoUrl;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg overflow-hidden bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Avatar Généré !</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 transition-colors rounded-lg hover:text-white hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <p className="text-gray-400">
                                Votre présentateur virtuel est prêt.
                            </p>

                            <div className="relative overflow-hidden rounded-xl bg-white/5 aspect-square group">
                                {finalVideoUrl ? (
                                    <video
                                        src={finalVideoUrl}
                                        controls
                                        autoPlay
                                        loop
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                                        <div className="animate-pulse w-full h-full bg-white/5" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5 bg-white/2">
                            <Button variant="outline" onClick={onClose}>
                                Fermer
                            </Button>

                            <Button variant="primary" onClick={onContinue}>
                                Générer les slides
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
