import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PresentationViewer } from '../components/PresentationViewer';

export function Presentation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [slides, setSlides] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isFormatted = true;

        const fetchPresentation = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token || !id) return;

                const response = await fetch(`http://localhost:3001/api/formation/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setSlides(data.slides || []);
                        setSections(data.sections || []);

                        // If video is ready, set URL. If not, URL might be null.
                        if (data.videoUrl) {
                            setVideoUrl(data.videoUrl);
                        } else if (data.status === 'failed') {
                            // Handle failure: Stop polling, show error
                            setVideoUrl(null);
                            setError("La génération a échoué. Veuillez réessayer.");
                        } else if (data.status === 'pending' || !data.videoUrl) {
                            // Poll if pending (slower interval to avoid spam)
                            setTimeout(fetchPresentation, 15000);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load presentation", error);
                setError("Erreur de connexion au serveur.");
            } finally {
                if (isFormatted) setLoading(false);
            }
        };

        if (id) fetchPresentation();

        return () => { isFormatted = false; };
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
            error={error || undefined}
            onClose={() => navigate('/dashboard')}
        />
    );
}
