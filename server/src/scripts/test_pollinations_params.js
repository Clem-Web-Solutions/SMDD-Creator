import axios from 'axios';

async function testEndpoint(url, name) {
    try {
        console.log(`Testing ${name}: ${url}`);
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        console.log(`${name} Status: ${response.status}`);
        console.log(`${name} Size: ${response.data.length} bytes`);
    } catch (error) {
        console.error(`${name} Error: ${error.message}`);
    }
}

async function run() {
    const prompt = "business meeting";

    // 1. The one that worked before
    await testEndpoint(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true`,
        "Basic (Worked)"
    );

    // 2. The one currently in the app (with width/height/seed)
    await testEndpoint(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&width=1024&height=1024&seed=123`,
        "With Params"
    );
}

run();
