import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Save,
    Download,
    ArrowLeft,
    MoreVertical,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Image,
    Link as LinkIcon,
    ChevronDown,
    Settings,
    Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export function EbookEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeChapter, setActiveChapter] = useState(0);

    // Mock data for the ebook structure
    const chapters = [
        { id: 0, title: "Introduction" },
        { id: 1, title: "Chapitre 1 : Les Fondamentaux" },
        { id: 2, title: "Chapitre 2 : Stratégies Avancées" },
        { id: 3, title: "Chapitre 3 : Outils & Ressources" },
        { id: 4, title: "Conclusion" },
    ];

    return (
        <div className="h-[calc(100vh-theme(spacing.20))] flex overflow-hidden bg-slate-50 dark:bg-[#020617]">
            {/* Sidebar - Chapter Navigation */}
            <div className="w-80 bg-white dark:bg-[#0B1121] border-r border-slate-200 dark:border-slate-800 flex flex-col z-10">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <ChevronDown size={18} />
                        Plan du document
                    </h2>
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">
                        <Plus size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {chapters.map((chapter, index) => (
                        <button
                            key={chapter.id}
                            onClick={() => setActiveChapter(index)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${activeChapter === index
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <span className="truncate">{chapter.title}</span>
                            {activeChapter === index && (
                                <div className="opacity-0 group-hover:opacity-100">
                                    <MoreVertical size={14} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">Statistiques</div>
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-500">
                        <span>Mots</span>
                        <span>12,450</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-500 mt-1">
                        <span>Temps de lecture</span>
                        <span>45 min</span>
                    </div>
                </div>
            </div>

            {/* Main Editing Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0F172A]">
                {/* Toolbar */}
                <div className="h-14 bg-white dark:bg-[#0B1121] border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between shrink-0">
                    <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-4 mr-4">
                        <button
                            onClick={() => navigate('/ebooks')}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 mr-2"
                            title="Retour"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                            Guide Marketing Digital 2024
                        </h1>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ml-2">
                            Enregistré
                        </span>
                    </div>

                    {/* Formatting Tools */}
                    <div className="flex items-center gap-1 flex-1 overflow-x-auto">
                        <select className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1 mr-2">
                            <option>Normal text</option>
                            <option>Heading 1</option>
                            <option>Heading 2</option>
                            <option>Heading 3</option>
                        </select>

                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><Bold size={18} /></button>
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><Italic size={18} /></button>
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><Underline size={18} /></button>

                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><AlignLeft size={18} /></button>
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><AlignCenter size={18} /></button>
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><AlignRight size={18} /></button>

                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><Image size={18} /></button>
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><LinkIcon size={18} /></button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800 ml-4">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Save size={16} />
                            <span className="hidden lg:inline">Sauvegarder</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm">
                            <Download size={16} />
                            <span className="hidden lg:inline">Exporter</span>
                        </button>
                    </div>
                </div>

                {/* Editor Surface */}
                <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-100/50 dark:bg-[#0F172A]">
                    <div className="w-full max-w-[850px] bg-white dark:bg-[#1E293B] min-h-[1000px] shadow-sm border border-slate-200 dark:border-slate-800 p-12 md:p-16 rounded-sm">
                        {/* Editor Content Simulation */}
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h1>Les Fondamentaux du Marketing Digital</h1>
                            <p className="lead">
                                Le marketing digital n'est pas seulement une question d'outils, c'est avant tout une question de stratégie et de compréhension du comportement humain à l'ère du numérique.
                            </p>
                            <h2>1. Comprendre son audience</h2>
                            <p>
                                Avant même de lancer votre première campagne, vous devez savoir à qui vous vous adressez. C'est l'étape la plus cruciale et pourtant la plus souvent négligée.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <blockquote>
                                "Le marketing ne consiste plus à vendre ce que vous fabriquez, mais à fabriquer ce que vous pouvez vendre."
                            </blockquote>
                            <h3>Les 3 piliers de la réussite</h3>
                            <ul>
                                <li>La pertinence du contenu</li>
                                <li>La régularité de la distribution</li>
                                <li>L'analyse des données</li>
                            </ul>
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Settings (Optional, simplified) */}
            <div className="w-72 bg-white dark:bg-[#0B1121] border-l border-slate-200 dark:border-slate-800 hidden xl:flex flex-col z-10 p-4">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Settings size={16} />
                    Propriétés
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-slate-500 uppercase mb-1.5 block">Style de police</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none">
                            <option>Inter</option>
                            <option>Merriweather</option>
                            <option>Roboto</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-500 uppercase mb-1.5 block">Taille</label>
                        <div className="flex bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <button className="flex-1 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-sm">-</button>
                            <div className="flex-1 p-1 text-center text-sm border-x border-slate-200 dark:border-slate-700 flex items-center justify-center">11</div>
                            <button className="flex-1 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-sm">+</button>
                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <div>
                        <label className="text-xs font-medium text-slate-500 uppercase mb-1.5 block">Notes IA</label>
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-3">
                            <p className="text-xs text-blue-800 dark:text-blue-300">
                                Ce paragraphe semble un peu long. Vous pourriez le diviser pour améliorer la lisibilité.
                            </p>
                            <button className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-2 hover:underline">
                                Reformuler avec l'IA
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
