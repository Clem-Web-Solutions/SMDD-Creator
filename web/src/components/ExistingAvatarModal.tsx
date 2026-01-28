import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trash2, User } from 'lucide-react';
import { Button } from './ui/Button';

interface ExistingAvatarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void; // Generate slides
    onReset: () => void; // Delete/Modify avatar
    avatar: any;
}

export const ExistingAvatarModal: React.FC<ExistingAvatarModalProps> = ({
    isOpen,
    // onClose,
    onContinue,
    onReset,
    avatar
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg overflow-hidden bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl shadow-blue-500/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <User className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Avatar Existant Détecté</h3>
                            </div>
                            {/* Close button is technically optional if we want to force a choice, but good for UX */}
                            {/* <button onClick={onClose} ... /> */}
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <p className="text-gray-400">
                                Vous avez déjà un avatar généré. Que souhaitez-vous faire ?
                            </p>

                            <div className="relative overflow-hidden rounded-xl bg-white/5 aspect-video group border border-white/10">
                                {avatar?.videoUrl ? (
                                    <video
                                        src={avatar.videoUrl}
                                        controls
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                                        <User size={48} className="mb-2 opacity-50" />
                                        <p>Aperçu indisponible</p>
                                    </div>
                                )}
                            </div>

                            {avatar?.style && (
                                <div className="flex gap-2 text-sm text-gray-400">
                                    <span className="px-2 py-1 bg-white/5 rounded-md border border-white/10">{avatar.gender}</span>
                                    <span className="px-2 py-1 bg-white/5 rounded-md border border-white/10">{avatar.age}</span>
                                    <span className="px-2 py-1 bg-white/5 rounded-md border border-white/10">{avatar.style}</span>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 p-6 border-t border-white/5 bg-white/2">
                            <button
                                onClick={onReset}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                                <span>Supprimer & Créer un nouveau</span>
                            </button>

                            <div className="flex-1" />

                            <Button
                                variant="primary"
                                onClick={onContinue}
                                className="w-full sm:w-auto"
                            >
                                <Play size={18} className="mr-2 fill-current" />
                                Générer les slides
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
