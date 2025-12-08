/**
 * Verify Supabase Project Configuration
 * 
 * This script checks which Supabase project your app is actually using
 * and warns if it's pointing to the wrong project.
 */

import { createClient } from '@supabase/supabase-js';

const EXPECTED_PROJECT_ID = 'vuanulvyqkfefmjcikfk';
const EXPECTED_PROJECT_URL = `https://${EXPECTED_PROJECT_ID}.supabase.co`;
const WRONG_PROJECT_IDS = ['kihxqurnmyxnsyqgpdaw', 'qnookjbtudghzzizofxy', 'ubgrkqdjsnaqmvbyrykn'];

// Get from environment or use defaults
const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Supabase Project Verification\n');
console.log('='.repeat(60));

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('\n📍 Current Configuration:');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);

// Extract project ID from URL
const projectIdMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
const actualProjectId = projectIdMatch ? projectIdMatch[1] : 'unknown';

console.log(`\n🔍 Detected Project ID: ${actualProjectId}`);

// Check if it's the correct project
if (actualProjectId === EXPECTED_PROJECT_ID) {
  console.log('✅ CORRECT PROJECT! Using Zyeuté project');
} else if (WRONG_PROJECT_IDS.includes(actualProjectId)) {
  console.error(`❌ WRONG PROJECT! Using ${actualProjectId} instead of ${EXPECTED_PROJECT_ID}`);
  console.error('   This is likely Krypttrac or another project!');
  console.error('\n🔧 Fix: Update VITE_SUPABASE_URL in Vercel environment variables to:');
  console.error(`   ${EXPECTED_PROJECT_URL}`);
} else {
  console.warn(`⚠️  Unknown project ID: ${actualProjectId}`);
  console.warn(`   Expected: ${EXPECTED_PROJECT_ID}`);
}

// Test connection
console.log('\n🧪 Testing Connection...');
const supabase = createClient(supabaseUrl, supabaseKey);

supabase.auth.getUser()
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Connection test failed:', error.message);
    } else {
      console.log('✅ Connection successful!');
      if (data.user) {
        console.log(`   Logged in as: ${data.user.email || 'Unknown'}`);
      } else {
        console.log('   Not logged in (expected)');
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Verification complete!');
    
    if (actualProjectId !== EXPECTED_PROJECT_ID) {
      console.error('\n⚠️  ACTION REQUIRED: Update Supabase URL to correct project!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Connection test exception:', error);
    process.exit(1);
  });

