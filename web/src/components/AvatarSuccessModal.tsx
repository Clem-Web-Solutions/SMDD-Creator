import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Video, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/Button';

interface AvatarSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    avatar: {
        previewUrl?: string;
        videoUrl?: string;
        status?: string;
        description?: string;
        latestFormationId?: string; // New field to link to specific formation
    };
}

export const AvatarSuccessModal: React.FC<AvatarSuccessModalProps> = ({ isOpen, onClose, avatar }) => {
    const navigate = useNavigate();

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
                                Votre avatar a été créé avec succès. Il apparaîtra ici et dans votre profil.
                            </p>

                            <div className="relative overflow-hidden rounded-xl bg-white/5 aspect-video group">
                                {avatar.videoUrl ? (
                                    <video
                                        src={avatar.videoUrl}
                                        controls
                                        autoPlay
                                        loop
                                        className="object-cover w-full h-full"
                                    />
                                ) : avatar.previewUrl ? (
                                    <>
                                        <img
                                            src={avatar.previewUrl}
                                            alt="Avatar Preview"
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <div className="flex flex-col items-center gap-2 p-4 text-center rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                                                <div className="p-3 bg-purple-500/20 rounded-full animate-pulse">
                                                    <Video className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <span className="text-sm font-medium text-white">Vidéo en cours de génération...</span>
                                                <span className="text-xs text-gray-400">Cela peut prendre quelques minutes.</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                                        <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                                        <span>Aperçu indisponible</span>
                                    </div>
                                )}
                            </div>

                            {avatar.description && (
                                <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Prompt / Description</span>
                                    <p className="mt-1 text-sm text-gray-300 line-clamp-2">{avatar.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5 bg-white/2">
                            <Button variant="outline" onClick={onClose}>
                                Fermer
                            </Button>

                            <Button variant="primary" onClick={() => {
                                onClose();
                                if (avatar.latestFormationId) {
                                    navigate(`/presentation/${avatar.latestFormationId}`);
                                } else {
                                    navigate('/formations'); // Fallback to list
                                }
                            }}>
                                Voir la présentation
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
