import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PresentationViewer } from '../components/PresentationViewer';

export function Presentation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [slides, setSlides] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPresentation = async () => {
            try {
                const token = localStorage.getItem('token');
                // Fetch specific formation by ID
                const response = await fetch(`http://localhost:3001/api/formation/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setSlides(data.slides || []);
                        setSections(data.sections || []);
                        // Support both legacy relative path and full URL if updated
                        const vUrl = data.videoUrl || (data.videoId ? `https://app.heygen.com/videos/${data.videoId}` : null);
                        setVideoUrl(vUrl);
                    }
                }
            } catch (error) {
                console.error("Failed to load presentation", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPresentation();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Chargement...</div>;

    if (!slides || slides.length === 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
                <p>Aucune présentation trouvée.</p>
                <button onClick={() => navigate('/dashboard')} className="text-blue-400 hover:underline">Retour au Dashboard</button>
            </div>
        );
    }

    return (
        <PresentationViewer
            slides={slides}
            sections={sections}
            videoUrl={videoUrl || undefined}
            onClose={() => navigate('/dashboard')}
        />
    );
}
