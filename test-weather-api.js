// Test script to check NEA Weather APIs
const https = require('https');

// Test different NEA weather endpoints
const endpoints = [
    'https://api.data.gov.sg/v1/environment/24-hour-weather-forecast',
    'https://api.data.gov.sg/v1/environment/4-day-weather-forecast',
    'https://api.data.gov.sg/v1/environment/realtime-weather-readings',
    'https://api.data.gov.sg/v1/environment/air-temperature',
    'https://api.data.gov.sg/v1/environment/rainfall'
];

async function testAPI(url) {
    return new Promise((resolve, reject) => {
        console.log(`\n🧪 Testing: ${url}`);
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log(`✅ Success! Status: ${res.statusCode}`);
                    console.log(`📊 Data structure:`, Object.keys(json));
                    if (json.items && json.items[0]) {
                        console.log(`📈 Sample data keys:`, Object.keys(json.items[0]));
                    }
                    resolve({ url, success: true, data: json });
                } catch (e) {
                    console.log(`❌ Parse error:`, e.message);
                    resolve({ url, success: false, error: e.message });
                }
            });
        }).on('error', (err) => {
            console.log(`❌ Request error:`, err.message);
            resolve({ url, success: false, error: err.message });
        });
    });
}

async function testAllAPIs() {
    console.log('🌤️  Testing Singapore NEA Weather APIs...\n');
    
    for (const endpoint of endpoints) {
        await testAPI(endpoint);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    }
    
    console.log('\n✅ Testing complete!');
}

testAllAPIs();
