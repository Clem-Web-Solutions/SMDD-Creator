import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import https from 'https';

/**
 * Downloads a file from a URL to a local path.
 * @param {string} url 
 * @param {string} dest 
 * @returns {Promise<void>}
 */
const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

/**
 * Creates a video from slide images.
 * @param {Array<{path: string, duration: number}>} slides 
 * @param {string} outputPath 
 * @returns {Promise<string>}
 */
const createSlideshow = (slides, outputPath) => {
    return new Promise((resolve, reject) => {
        // Create a temporary concat file
        // Format:
        // file '/path/to/image1.png'
        // duration 5
        // file '/path/to/image2.png'
        // duration 3
        const concatFilePath = path.join(path.dirname(outputPath), 'slides_concat.txt');
        const concatContent = slides.map(s => `file '${s.path}'\nduration ${s.duration}`).join('\n');

        // FFMPEG concat requires the last file to be repeated without duration or just handled correctly
        // Actually for images:
        // file 'img1.png'
        // duration 5
        // file 'img2.png'
        // duration 5
        // file 'img2.png' (repeated to ensure last frame holds?) - Standard pattern involves repeating last image potentially, 
        // but let's try standard concat demuxer.
        // Important: concat demuxer allows "duration" directive.

        // Fix: The duration directive applies to the file BEFORE it. 
        // Wait, standard usage is:
        // file 'image.png'
        // duration 5

        fs.writeFileSync(concatFilePath, concatContent);

        ffmpeg()
            .input(concatFilePath)
            .inputOptions(['-f concat', '-safe 0'])
            .outputOptions(['-pix_fmt yuv420p']) // Ensure compatibility
            .save(outputPath)
            .on('end', () => {
                fs.unlinkSync(concatFilePath); // Cleanup
                resolve(outputPath);
            })
            .on('error', (err) => {
                if (fs.existsSync(concatFilePath)) fs.unlinkSync(concatFilePath);
                reject(err);
            });
    });
};

/**
 * Composes the final video: Slides (left) + Avatar (right/overlay).
 * Since we want a specific layout (like the screenshot), we'll do:
 * - Base Canvas: 1920x1080 White
 * - Slides Video: Scaled to fit left area (e.g., 60-70% width), centered vertically? 
 *   or just Full Height on left?
 *   In screenshot: Slides are on left, Avatar on right.
 *   Let's assume 1920x1080.
 *   Avatar is usually 9:16 or square transparent?
 *   If HeyGen returns a rectangular video with background, we might need to crop or just place it.
 *   
 *   STRATEGY:
 *   1. Create Slideshow Video (Variable frame rate is fine, or fixed).
 *   2. Take Avatar Video.
 *   3. Complex Filter:
 *      [0:v] (Slides) scale=1280:720 [slides]; (Resize slides to fit nice area, e.g. 2/3 width)
 *      [1:v] (Avatar) scale=640:-1 [avatar]; (Resize avatar to 1/3 width)
 *      [color=white:s=1920x1080] [base];
 *      [base][slides] overlay=50:180 [tmp1]; (Position slides with some padding)
 *      [tmp1][avatar] overlay=1300:180; (Position avatar on right)
 *   4. Mix Audio? Slides usually have no audio. Avatar has audio.
 *      So take audio from Avatar.
 * 
 * @param {string} avatarVideoUrl 
 * @param {Array<{path: string, duration: number}>} slides 
 * @param {string} outputDir 
 * @returns {Promise<string>} Path to final video
 */
export const composeVideo = async (avatarVideoUrl, slides, outputDir) => {
    const timestamp = Date.now();
    const avatarPath = path.join(outputDir, `avatar_${timestamp}.mp4`);
    const finalPath = path.join(outputDir, `composite_${timestamp}.mp4`);

    try {
        // 1. Download Avatar Video
        console.log("Downloading avatar video...");
        await downloadFile(avatarVideoUrl, avatarPath);

        const avatarStats = fs.statSync(avatarPath);
        console.log(`[DEBUG] Avatar file size: ${avatarStats.size} bytes`);
        if (avatarStats.size < 1000) {
            console.warn("[WARNING] Avatar video seems empty or corrupt!");
        }

        // 2. Prepare Inputs
        const slidesVideoPath = path.join(outputDir, `slides_${timestamp}.mp4`);
        console.log("Creating slides video...");
        await createSlideshow(slides, slidesVideoPath);

        // 3. Compose (Using HSTACK for safety: Slides Left | Avatar Right)
        console.log("Composing final video...");
        return new Promise((resolve, reject) => {
            ffmpeg()
                .input(slidesVideoPath)
                .input(avatarPath)
                .complexFilter([
                    // 1. Slides Layer (Left Side)
                    // Original is 1920x1080. We kept text in left 60%.
                    // We crop exactly the left 1120px to form the left panel.
                    '[0:v]crop=1120:1080:0:0[left_panel]',

                    // 2. Avatar Layer (Right Side)
                    // Scale/Crop to 800x1080.
                    // Add background color to prove panel existence if input is weird.
                    '[1:v]scale=800:1080:force_original_aspect_ratio=increase,crop=800:1080:(iw-800)/2:(ih-1080)/2[avatar_raw];color=c=#f1f5f9:s=800x1080[avatar_bg];[avatar_bg][avatar_raw]overlay=shortest=1[right_panel]',

                    // 3. Stack Horizontal
                    '[left_panel][right_panel]hstack=inputs=2[outv]'
                ])
                .outputOptions(['-map [outv]']) // Map ONLY the composite video
                .outputOptions(['-map 1:a?'])   // Map Audio from Avatar if exists
                .outputOptions([
                    '-c:v libx264',
                    '-preset ultrafast',
                    '-c:a copy',
                    '-shortest'
                ])
                // Actually complex filter output is the default stream if not named? 
                // No, we should map the filter output.
                // But fluent-ffmpeg usually handles single filter graph output auto mapping.
                // Let's rely on auto or explicitly map.
                // If we use complexFilter string array, usually it maps the last output.

                .on('progress', (progress) => {
                    console.log(`[FFmpeg] Processing: ${progress.percent ? Math.round(progress.percent) + '%' : 'N/A'} (Time: ${progress.timemark})`);
                })
                .save(finalPath)
                .on('end', () => {
                    // Cleanup intermediate files
                    fs.unlinkSync(avatarPath);
                    fs.unlinkSync(slidesVideoPath);
                    // Also cleanup slide images? No, caller handles that?
                    // Caller should handle slide cleanup.
                    resolve(finalPath);
                })
                .on('error', (err) => {
                    console.error("FFmpeg Error:", err);
                    reject(err);
                });
        });

    } catch (error) {
        console.error("Composition failed:", error);
        throw error;
    }
};
