import { useState, useEffect } from 'react';
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
// @ts-ignore
import html2pdf from 'html2pdf.js';

export function EbookEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeChapter, setActiveChapter] = useState(0);
    const [ebook, setEbook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        // Target the specific content div we gave an ID to
        const element = document.getElementById('ebook-content-to-export');

        const opt: any = {
            margin: 0.5,
            filename: `${ebook?.title || 'ebook'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            setIsExporting(false);
        }).catch((err: any) => {
            console.error("Export error:", err);
            setIsExporting(false);
            alert("Erreur lors de l'export PDF.");
        });
    };

    useEffect(() => {
        const fetchEbook = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:3001/api/ebooks/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setEbook(data);
                } else {
                    console.error("Failed to fetch ebook");
                    // Optionally handle 401/404
                }
            } catch (error) {
                console.error("Error fetching ebook:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEbook();
        }
    }, [id, navigate]);

    // Derived state or fallback
    // If ebook has structured chapters, use them.
    // If not (legacy/flat content), wrap the content in a single "chapter" so the UI still works.
    const hasChapters = ebook?.chapters && ebook.chapters.length > 0;
    const chapters = hasChapters
        ? ebook.chapters
        : [{ title: ebook?.title || "Introduction", content: ebook?.content || "<p>Contenu vide.</p>" }];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!ebook) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 flex-col gap-4">
                <p className="text-slate-500">Ebook introuvable ou erreur de chargement.</p>
                <button onClick={() => navigate('/ebooks')} className="text-blue-600 hover:underline">Retour à mes ebooks</button>
            </div>
        );
    }

    if (chapters.length === 0) {
        // Handle case with no chapters (legacy ebook?)
        return (
            <div className="h-screen bg-slate-50 dark:bg-[#020617] p-8">
                <button onClick={() => navigate('/ebooks')} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Retour</button>
                <div className="bg-white dark:bg-slate-800 p-8 rounded shadow">
                    <h1 className="text-2xl font-bold mb-4">{ebook.title}</h1>
                    <div className="prose dark:prose-invert">
                        <p>Cet ebook ne contient pas de chapitres structurés (ancien format ou erreur de génération).</p>
                        {ebook.content && (
                            <div dangerouslySetInnerHTML={{ __html: ebook.content }} /> // Fallback for legacy text content
                        )}
                    </div>
                </div>
            </div>
        );
    }

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
                    {chapters.map((chapter: any, index: number) => (
                        <button
                            key={index}
                            onClick={() => {
                                setActiveChapter(index);
                                document.getElementById(`chapter-${index}`)?.scrollIntoView({ behavior: 'smooth' });
                            }}
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
                            {ebook?.title || 'Ebook sans titre'}
                        </h1>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ml-2">
                            {ebook?.status === 'completed' ? 'Enregistré' : 'Brouillon'}
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
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExporting ? (
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Download size={16} />
                            )}
                            <span className="hidden lg:inline">{isExporting ? 'Export...' : 'Exporter'}</span>
                        </button>
                    </div>
                </div>

                {/* Editor Surface */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-100/50 dark:bg-[#0F172A] scroll-smooth" id="editor-scroll-container">
                    <div id="ebook-content-to-export" className="max-w-[850px] mx-auto space-y-8">
                        {chapters.map((chapter: any, index: number) => (
                            <div
                                key={index}
                                id={`chapter-${index}`}
                                className="w-full bg-white dark:bg-[#1E293B] shadow-sm border border-slate-200 dark:border-slate-800 p-12 md:p-16 rounded-sm min-h-[1100px]" // A4-ish ratio
                            >
                                <div className="prose prose-slate dark:prose-invert max-w-none focus:outline-none mb-8">
                                    <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-gray-100">{chapter.title}</h1>
                                </div>
                                <div
                                    className="prose prose-slate dark:prose-invert max-w-none focus:outline-none"
                                    contentEditable
                                    suppressContentEditableWarning
                                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                                />
                                {/* Page Number Footer Simulation */}
                                <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-center text-xs text-slate-400">
                                    Page {index + 1}
                                </div>
                            </div>
                        ))}
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
