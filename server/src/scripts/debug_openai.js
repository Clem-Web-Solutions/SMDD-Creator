import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });
if (!process.env.OPENAI_API_KEY) {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function debugOpenAI() {
    const mainSubject = "La Communication Non Violente";
    const audience = "Managers";
    const tone = "Professionnel";
    const language = "French";
    const slideCount = "3 slides"; // Shorten for debug

    console.log("Testing OpenAI Generation...");
    const systemPrompt = `You are an expert pedagogical designer and scriptwriter for video courses.
Your task is to create a structured video course on: "${mainSubject}".

Target Audience: ${audience}
Tone: ${tone}
Language: ${language} (Must be valid ${language})
Approx Length: ${slideCount}

CRITICAL OUTPUT STRUCTURE:
Return a STRICT JSON object containing a single array named 'sections'.
Each item in 'sections' represents ONE video scene (one slide + its specific script).

Structure for each section:
{
  "type": "intro" | "content" | "outro",
  "title": "Short Section Title",
  "script": "The spoken narration for this specific slide. Must be oral style, natural, short sentences, suitable for an AI avatar. Avoid 'In this slide...'. max 40 words.",
  "slide": {
    "title": "Slide Headline",
    "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
    "imagePrompt": "Abstract, modern, minimalist background description related to the topic. High quality, 4k."
  }
}

REQUIREMENTS:
1. "script" must be perfectly synchronized with the "slide" content.
2. The "intro" section should welcome the viewer.
3. The "outro" section should summarize and thank the viewer.
4. Total sections should match the requested length (~${slideCount}).
5. Ensure smooth transitions between sections in the script.
`;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt }
            ],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        console.log("Raw Output:", content.substring(0, 200) + "...");
        const generatedData = JSON.parse(content);

        if (!generatedData.sections || !Array.isArray(generatedData.sections)) {
            throw new Error("Invalid structure: missing sections array");
        }

        console.log(`Success! Generated ${generatedData.sections.length} sections.`);
        console.log("First Section:", JSON.stringify(generatedData.sections[0], null, 2));

    } catch (error) {
        console.error("OpenAI Error:", error.message);
        if (error.response) console.error(error.response.data);
    }
}

debugOpenAI();
