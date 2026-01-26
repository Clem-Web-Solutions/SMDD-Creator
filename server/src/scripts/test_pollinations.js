import axios from 'axios';
import fs from 'fs';

async function testEndpoint(url, name) {
    try {
        console.log(`Testing ${name}: ${url}`);
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        console.log(`${name} Status: ${response.status}`);
        console.log(`${name} Size: ${response.data.length} bytes`);
        // If size is small/constant, it might be the error image.
        // real images are usually variable.
    } catch (error) {
        console.error(`${name} Error: ${error.message}`);
    }
}

async function run() {
    const prompt = "sunset over mountains";
    await testEndpoint(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true`, "Old Endpoint");
    await testEndpoint(`https://pollinations.ai/p/${encodeURIComponent(prompt)}?nologo=true`, "Short Endpoint");
    // Some sources suggest this new one:
    await testEndpoint(`https://pollinations.ai/prompt/${encodeURIComponent(prompt)}`, "Root Prompt Endpoint");
}

run();
