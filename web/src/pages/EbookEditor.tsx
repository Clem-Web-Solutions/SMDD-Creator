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
    Image,
    Link as LinkIcon,
    ChevronDown,
    Settings,
    Plus,
    Sparkles,
    ImageIcon,
    Loader2
} from 'lucide-react';

// @ts-ignore
import html2pdf from 'html2pdf.js';
import { NoCreditsModal } from '../components/NoCreditsModal';

const TEMPLATES: Record<string, { name: string; bg: string; text: string; border: string; prose: string; style?: React.CSSProperties; decoration?: React.ReactNode }> = {
    modern: {
        name: "Minimaliste",
        bg: "bg-white",
        text: "text-slate-900",
        border: "border-slate-200",
        prose: "prose-slate",
        style: {}
    },
    luxury: {
        name: "Luxe & Doré",
        bg: "bg-[#FAFAFA]",
        text: "text-slate-900 font-serif",
        border: "border-amber-200",
        prose: "prose-serif prose-slate",
        decoration: (
            <div className="absolute inset-0 pointer-events-none border-[16px] border-double border-amber-100/50 m-8" />
        )
    },
    tech: {
        name: "Tech & Grid",
        bg: "bg-[#0F172A]",
        text: "text-cyan-50 font-mono",
        border: "border-cyan-900",
        prose: "prose-invert prose-code:text-cyan-300",
        style: {
            backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px), radial-gradient(#1e293b 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 10px 10px",
        },
        decoration: (
            <>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-600" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
            </>
        )
    },
    creative: {
        name: "Créatif & Vibrant",
        bg: "bg-white",
        text: "text-slate-900",
        border: "border-purple-200",
        prose: "prose-slate",
        style: {
            backgroundImage: "linear-gradient(135deg, #fff 0%, #f3e8ff 100%)"
        },
        decoration: (
            <>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/20 rounded-bl-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300/20 rounded-tr-full blur-2xl" />
            </>
        )
    },
    classic: {
        name: "Manuscrit",
        bg: "bg-[#fdfbf7]", // Warm paper
        text: "text-serif text-slate-900",
        border: "border-[#e8e4dc]",
        prose: "prose-serif prose-slate"
    }
};

export function EbookEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeChapter, setActiveChapter] = useState(0);
    const [ebook, setEbook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [isGeneratingCover, setIsGeneratingCover] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof TEMPLATES>('modern');
    const [showNoCreditsModal, setShowNoCreditsModal] = useState(false);
    const [insufficientCreditDetails, setInsufficientCreditDetails] = useState({ required: 50, current: 0 });

    const handleGenerateCover = async () => {
        if (!ebook) return;

        setIsGeneratingCover(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/generate/cover', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ebookId: id,
                    title: ebook.title,
                    subtitle: ebook.subject, // Using subject as subtitle context
                    style: TEMPLATES[selectedTemplate].name, // Use current template style as hint
                    colors: selectedTemplate === 'modern' ? 'Minimalist' : selectedTemplate,
                    audience: ebook.tone // Using tone as audience hint
                })
            });

            if (response.status === 403) {
                const errorData = await response.json();
                setInsufficientCreditDetails({
                    required: errorData.required || 50,
                    current: errorData.current || 0
                });
                setShowNoCreditsModal(true);
                return;
            }

            const data = await response.json();

            if (data.success && data.imageUrl) {
                setEbook((prev: any) => ({ ...prev, coverUrl: data.imageUrl }));

                // Refresh credits
                const token = localStorage.getItem('token');
                fetch("http://localhost:3001/api/auth/me", {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                    .then(res => res.json())
                    .then(userData => {
                        const updatedUser = { ...userData, token };
                        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                        window.dispatchEvent(new Event('userDataUpdated'));
                    });

            } else {
                alert(data.error || "Erreur lors de la génération de la couverture");
            }
        } catch (error) {
            console.error("Cover generation error:", error);
            alert("Erreur technique lors de la génération");
        } finally {
            setIsGeneratingCover(false);
        }
    };

    const handleDownloadCover = async () => {
        if (!ebook?.coverUrl) return;
        try {
            const token = localStorage.getItem('token');
            // We use fetch with blob to handle auth header if needed, but for a protected route we need to pass the token.
            // Since it's a GET request for a download, using window.location or <a> tag directly won't pass the Bearer token easily unless we use cookies or query param.
            // For now, let's use fetch + blob again, but hitting OUR proxy which avoids CORS.

            const response = await fetch(`http://localhost:3001/api/generate/cover/download/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `cover-${ebook.title || 'ebook'}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed', error);
            alert("Erreur lors du téléchargement");
        }
    };

    const handleExport = () => {
        setIsExporting(true);
        // Target the specific content div we gave an ID to
        const element = document.getElementById('ebook-content-to-export');

        if (!element) {
            console.error("Element to export not found");
            setIsExporting(false);
            return;
        }

        const opt: any = {
            margin: 0,
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
                <div className="bg-white dark:bg-[#0B1121] border-b border-slate-200 dark:border-slate-800 shrink-0 flex flex-col">
                    {/* Top Row: Navigation & Actions */}
                    <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate('/ebooks')}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
                                title="Retour"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                            <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[300px]">
                                {ebook?.title || 'Ebook sans titre'}
                            </h1>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ml-2">
                                {ebook?.status === 'completed' ? 'Enregistré' : 'Brouillon'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <Save size={16} />
                                <span className="hidden sm:inline">Sauvegarder</span>
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
                                <span className="hidden sm:inline">{isExporting ? 'Export...' : 'Exporter'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row: Formatting Tools */}
                    <div className="h-11 flex items-center px-4 gap-1 overflow-x-auto no-scrollbar bg-slate-50/50 dark:bg-[#0B1121]">
                        <div className="flex items-center">
                            <span className="text-xs text-slate-400 font-medium mr-2 uppercase tracking-wide">Thème</span>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value as any)}
                                className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500/20"
                            >
                                {Object.entries(TEMPLATES).map(([key, tpl]) => (
                                    <option key={key} value={key}>{tpl.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-3" />

                        <select className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1 mr-2">
                            <option>Normal text</option>
                            <option>Heading 1</option>
                            <option>Heading 2</option>
                            <option>Heading 3</option>
                        </select>

                        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-2" />

                        <div className="flex items-center gap-0.5">
                            <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 transition-colors"><Bold size={16} /></button>
                            <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 transition-colors"><Italic size={16} /></button>
                            <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 transition-colors"><Underline size={16} /></button>
                        </div>

                        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-2" />

                        <div className="flex items-center gap-0.5">
                            <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 transition-colors"><AlignLeft size={16} /></button>
                            <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 transition-colors"><AlignCenter size={16} /></button>
                            <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 transition-colors"><AlignRight size={16} /></button>
                        </div>

                        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-2" />

                        <div className="flex items-center gap-0.5">
                            <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 transition-colors"><Image size={16} /></button>
                            <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 transition-colors"><LinkIcon size={16} /></button>
                        </div>
                    </div>
                </div>

                {/* Editor Surface */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-100/50 dark:bg-[#0F172A] scroll-smooth" id="editor-scroll-container">
                    <div id="ebook-content-to-export" className="max-w-[850px] mx-auto space-y-8">
                        {chapters.map((chapter: any, index: number) => (
                            <div
                                key={index}
                                id={`chapter-${index}`}
                                className={`w-full relative overflow-hidden ${TEMPLATES[selectedTemplate].bg} ${TEMPLATES[selectedTemplate].text} shadow-sm border ${TEMPLATES[selectedTemplate].border} p-12 md:p-16 rounded-sm min-h-[1100px] transition-all`}
                                style={TEMPLATES[selectedTemplate].style}
                            >
                                {TEMPLATES[selectedTemplate].decoration}
                                <div className={`relative z-10 prose ${TEMPLATES[selectedTemplate].prose} max-w-none focus:outline-none mb-8`}>
                                    <h1 className="text-4xl font-bold mb-6">{chapter.title}</h1>
                                </div>
                                <div
                                    className={`relative z-10 prose ${TEMPLATES[selectedTemplate].prose} max-w-none focus:outline-none`}
                                    contentEditable
                                    suppressContentEditableWarning
                                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                                />
                                {/* Page Number Footer Simulation */}
                                <div className={`relative z-10 mt-16 pt-8 border-t ${TEMPLATES[selectedTemplate].border} flex justify-center text-xs opacity-50`}>
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
                        <label className="text-xs font-medium text-slate-500 uppercase mb-1.5 block">Couverture</label>
                        <div className="aspect-[2/3] bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center gap-2 p-4 text-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors group relative overflow-hidden">
                            {ebook?.coverUrl ? (
                                <img src={ebook.coverUrl} alt="Cover" className="w-full h-full object-cover rounded-md" />
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                        <ImageIcon size={20} />
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">Aucune couverture</span>
                                </>
                            )}
                        </div>
                        <button
                            onClick={handleGenerateCover}
                            disabled={isGeneratingCover}
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingCover ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                            {isGeneratingCover ? 'Génération...' : "Générer avec l'IA (50 crédits)"}
                        </button>

                        {ebook?.coverUrl && (
                            <button
                                onClick={handleDownloadCover}
                                className="w-full mt-2 flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-3 rounded-lg shadow-sm transition-all"
                            >
                                <Download size={14} />
                                Télécharger image
                            </button>
                        )}
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

            <NoCreditsModal
                isOpen={showNoCreditsModal}
                onClose={() => setShowNoCreditsModal(false)}
                required={insufficientCreditDetails.required}
                current={insufficientCreditDetails.current}
            />
        </div>
    );
}
