// Health Check Script
// Run via: npm run health-check
// Or: node scripts/health-check.js

const https = require('https');

const FUNCTION_URL = process.env.SUPABASE_FUNCTION_URL || 
  'https://vuanulvyqkfefmjcikfk.supabase.co/functions/v1/daily-health-check';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const url = new URL(FUNCTION_URL);

const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  },
};

console.log(`🔍 Running health check: ${FUNCTION_URL}`);

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`📊 HTTP Status: ${res.statusCode}`);
    
    try {
      const result = JSON.parse(data);
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('✅ Health check passed');
        console.log(`Overall Status: ${result.overall_status || 'N/A'}`);
        console.log(`Summary: ${result.summary?.passed || 0} passed, ${result.summary?.warnings || 0} warnings, ${result.summary?.failures || 0} failures`);
        
        if (process.env.VERBOSE === 'true') {
          console.log('\nFull Response:');
          console.log(JSON.stringify(result, null, 2));
        }
        
        process.exit(0);
      } else {
        console.error('❌ Health check failed');
        console.error('Response:', data);
        process.exit(1);
      }
    } catch (e) {
      console.error('❌ Failed to parse response:', e.message);
      console.error('Raw response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  process.exit(1);
});

req.write(JSON.stringify({}));
req.end();

