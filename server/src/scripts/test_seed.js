import axios from 'axios';

async function testEndpoint(url, name) {
    try {
        console.log(`Testing ${name}: ${url}`);
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        console.log(`${name} Status: ${response.status}`);
        console.log(`${name} Size: ${response.data.length} bytes`); // < 5000 bytes usually means error image
    } catch (error) {
        console.error(`${name} Error: ${error.message}`);
    }
}

async function run() {
    const prompt = "business meeting professional";

    // 1. Clean (Known good from step 1243)
    await testEndpoint(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true`,
        "No Seed"
    );

    // 2. With Seed (Suspected culprit)
    await testEndpoint(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&seed=12345`,
        "With Seed"
    );

    // 3. With Model (Maybe explicit model is better?)
    await testEndpoint(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&model=flux`,
        "With Model Flux"
    );
}

run();
