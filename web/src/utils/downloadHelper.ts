import { saveAs } from 'file-saver';
// @ts-ignore
import html2canvas from 'html2canvas';

interface Slide {
    title: string;
    content: string[];
    imagePrompt?: string;
    script?: string; // Added script field
}

export const downloadFormationPackage = async (
    title: string,
    slides: Slide[],
    videoUrl: string | undefined
) => {
    if (!slides || slides.length === 0 || !videoUrl) {
        alert("Contenu manquant (slides ou vidéo) pour le téléchargement.");
        return;
    }

    try {
        // 1. Get Video Duration
        const videoDuration = await new Promise<number>((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => resolve(video.duration);
            video.onerror = () => reject("Impossible de charger les métadonnées vidéo");
            video.src = videoUrl;
        });

        // 2. Calculate Durations
        const slideWeights = slides.map(s => {
            // Heuristic: Title + Content points length
            return s.title.length + s.content.join('').length + (s.script?.length || 0);
        });
        const totalWeight = slideWeights.reduce((a, b) => a + b, 0);

        const calculatedDurations = slideWeights.map(w => (w / totalWeight) * videoDuration);

        // 3. Capture Slides...
        const slideImages: { image: string, duration: number }[] = [];

        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '1920px'; // 1080p
        container.style.height = '1080px';
        container.style.background = '#ffffff';
        container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        container.style.zIndex = '-9999';
        container.style.letterSpacing = 'normal';

        document.body.appendChild(container);

        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];

            // Generate Bullets HTML matching Preview style (flex with dot)
            const pointsHtml = slide.content.map(p => `
                <div style="display: flex; align-items: flex-start; margin-bottom: 25px;">
                    <div style="width: 8px; height: 8px; margin-top: 10px; border-radius: 50%; background-color: #2563eb; flex-shrink: 0; margin-right: 20px;"></div>
                    <p style="font-size: 26px; color: #475569; font-weight: 500; line-height: 1.5; margin: 0; font-family: inherit;">
                        ${p}
                    </p>
                </div>`).join('');

            // Script/Quote at bottom
            const scriptHtml = slide.script ? `
                <div style="margin-top: auto; padding-top: 40px; border-left: 4px solid #e2e8f0; padding-left: 20px;">
                     <p style="font-size: 16px; color: #94a3b8; font-style: italic; font-weight: 500; margin: 0; line-height: 1.6;">
                        "${slide.script}"
                     </p>
                </div>
            ` : '';

            // Layout
            container.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; overflow: hidden;">
                    <!-- Left Content Area (55% width) -->
                    <div style="width: 55%; height: 100%; padding: 80px 100px; box-sizing: border-box; display: flex; flex-direction: column;">
                        
                        <!-- Top Content Wrapper (Centered Vertically in available space) -->
                        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                            <!-- Header Tag -->
                            <div style="font-size: 14px; color: #94a3b8; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 25px; font-weight: 700;">
                                SLIDE ${i + 1} / ${slides.length}
                            </div>

                            <!-- Title -->
                            <h1 style="font-size: 64px; font-weight: 800; color: #0f172a; margin-bottom: 35px; line-height: 1.1; letter-spacing: -1px;">
                                ${slide.title}
                            </h1>

                            <!-- Blue Separator -->
                            <div style="width: 80px; height: 8px; background: #2563eb; margin-bottom: 40px; border-radius: 4px;"></div>

                            <!-- Bullets -->
                            <div>
                                ${pointsHtml}
                            </div>
                        </div>

                        <!-- Script Footer (Stays at bottom) -->
                        ${scriptHtml}
                    </div>

                    <!-- Right Area (45%) -->
                    <div style="width: 45%; height: 100%;"></div>
                </div>
            `;

            const canvas = await html2canvas(container, {
                scale: 1, // Reset to 1 (1080p native)
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imageData = canvas.toDataURL('image/png', 1.0);

            slideImages.push({
                image: imageData,
                duration: calculatedDurations[i] || (videoDuration / slides.length)
            });
        }

        document.body.removeChild(container);

        // 4. Send to Backend
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/formation/download-composite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ videoUrl, slides: slideImages })
        });

        if (response.ok) {
            const blob = await response.blob();
            saveAs(blob, `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`);
        } else {
            console.error("Composite download error", response.status);
            alert("Erreur lors de la création de la vidéo compositée.");
        }

    } catch (error) {
        console.error("Download failed:", error);
        alert("Erreur lors du téléchargement.");
    }
};
