/**
 * OAuth Configuration Verification Script
 * 
 * This script verifies:
 * 1. Environment variables are set correctly
 * 2. Supabase client configuration
 * 3. OAuth redirect URL format
 * 4. Expected configuration values
 * 
 * Run with: node scripts/verify-oauth-config.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 OAuth Configuration Verification\n');
console.log('=' .repeat(60));

// Expected values
const EXPECTED_SUPABASE_PROJECT = 'vuanulvyqkfefmjcikfk';
const EXPECTED_SUPABASE_URL = `https://${EXPECTED_SUPABASE_PROJECT}.supabase.co`;
const PRODUCTION_DOMAIN = 'https://zyeute.com';
const VERCEL_DOMAIN = 'https://zyeute.vercel.app';
const EXPECTED_CALLBACK_PATH = '/auth/callback';
const EXPECTED_GOOGLE_CALLBACK = `${EXPECTED_SUPABASE_URL}/auth/v1/callback`;

// Check environment variables
console.log('\n📋 1. Environment Variables Check');
console.log('-'.repeat(60));

const envFiles = ['.env.local', '.env', '.env.production'];
let envVars = {};

for (const envFile of envFiles) {
  const envPath = path.join(__dirname, '..', envFile);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        envVars[key] = value;
      }
    }
    console.log(`✅ Found ${envFile}`);
  }
}

const supabaseUrl = envVars.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl) {
  console.log(`\n📍 Supabase URL: ${supabaseUrl}`);
  if (supabaseUrl.includes(EXPECTED_SUPABASE_PROJECT)) {
    console.log('✅ Correct Supabase project ID');
  } else {
    console.log(`❌ WRONG PROJECT! Expected: ${EXPECTED_SUPABASE_PROJECT}`);
    console.log(`   Found: ${supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'unknown'}`);
  }
} else {
  console.log('❌ VITE_SUPABASE_URL not found');
}

if (supabaseKey) {
  console.log(`\n🔑 Supabase Anon Key: ${supabaseKey.substring(0, 20)}...`);
  console.log('✅ Anon key is set');
} else {
  console.log('❌ VITE_SUPABASE_ANON_KEY not found');
}

// Check code configuration
console.log('\n📋 2. Code Configuration Check');
console.log('-'.repeat(60));

const supabaseTsPath = path.join(__dirname, '..', 'src', 'lib', 'supabase.ts');
if (fs.existsSync(supabaseTsPath)) {
  const content = fs.readFileSync(supabaseTsPath, 'utf-8');
  
  // Check redirectTo configuration
  if (content.includes('redirectTo')) {
    const redirectMatch = content.match(/redirectTo:\s*[`'"]([^`'"]+)[`'"]/);
    if (redirectMatch) {
      const redirectUrl = redirectMatch[1];
      console.log(`\n📍 OAuth redirectTo: ${redirectUrl}`);
      
      if (redirectUrl.includes(EXPECTED_CALLBACK_PATH)) {
        console.log('✅ Callback path is correct');
      } else {
        console.log(`❌ Callback path should include: ${EXPECTED_CALLBACK_PATH}`);
      }
      
      if (redirectUrl.includes('window.location.origin')) {
        console.log('✅ Using dynamic origin (good for production)');
      } else if (redirectUrl.includes('localhost')) {
        console.log('⚠️  Using localhost (needs update for production)');
      }
    }
  }
  
  // Check detectSessionInUrl
  if (content.includes('detectSessionInUrl: true')) {
    console.log('✅ detectSessionInUrl is enabled');
  } else {
    console.log('⚠️  detectSessionInUrl might not be enabled');
  }
  
  console.log('✅ supabase.ts file found and readable');
} else {
  console.log('❌ supabase.ts not found');
}

// Check AuthCallback route
console.log('\n📋 3. Route Configuration Check');
console.log('-'.repeat(60));

const appTsxPath = path.join(__dirname, '..', 'src', 'App.tsx');
if (fs.existsSync(appTsxPath)) {
  const content = fs.readFileSync(appTsxPath, 'utf-8');
  
  if (content.includes('/auth/callback')) {
    console.log('✅ /auth/callback route is registered');
  } else {
    console.log('❌ /auth/callback route not found in App.tsx');
  }
  
  if (content.includes('AuthCallback')) {
    console.log('✅ AuthCallback component is imported');
  } else {
    console.log('❌ AuthCallback component not imported');
  }
} else {
  console.log('❌ App.tsx not found');
}

// Expected configuration summary
console.log('\n📋 4. Expected Configuration Summary');
console.log('-'.repeat(60));
console.log('\n🔧 Supabase Dashboard Settings:');
console.log(`   Site URL: ${PRODUCTION_DOMAIN}`);
console.log(`   Redirect URLs:`);
console.log(`     - ${PRODUCTION_DOMAIN}`);
console.log(`     - ${PRODUCTION_DOMAIN}${EXPECTED_CALLBACK_PATH}`);
console.log(`     - ${PRODUCTION_DOMAIN}/**`);
console.log(`     - ${VERCEL_DOMAIN}`);
console.log(`     - ${VERCEL_DOMAIN}${EXPECTED_CALLBACK_PATH}`);
console.log(`     - ${VERCEL_DOMAIN}/**`);
console.log(`     - http://localhost:5173${EXPECTED_CALLBACK_PATH} (for dev)`);
console.log(`     - http://localhost:5173/** (for dev)`);
console.log(`\n   ⚠️  Remove any temporary preview deployment URLs (e.g., brandonlacoste9-tech-zyeute-xyz.vercel.app)`);

console.log('\n🔧 Google Cloud Console Settings:');
console.log(`   Authorized redirect URIs:`);
console.log(`     - ${EXPECTED_GOOGLE_CALLBACK}`);

console.log('\n📋 5. Verification Checklist');
console.log('-'.repeat(60));
console.log('\nPlease verify these in Supabase Dashboard:');
console.log('□ Site URL is set to:', PRODUCTION_DOMAIN);
console.log('□ Redirect URLs include:', `${PRODUCTION_DOMAIN}${EXPECTED_CALLBACK_PATH}`);
console.log('□ Redirect URLs include:', `${PRODUCTION_DOMAIN}/**`);
console.log('□ Redirect URLs include:', `${VERCEL_DOMAIN}${EXPECTED_CALLBACK_PATH}`);
console.log('□ Redirect URLs include:', `${VERCEL_DOMAIN}/**`);
console.log('□ ALL old deployment URLs removed from Redirect URLs');
console.log('□ Google OAuth provider is enabled');
console.log('\nPlease verify these in Google Cloud Console:');
console.log('□ Authorized redirect URI:', EXPECTED_GOOGLE_CALLBACK);
console.log('□ OAuth 2.0 Client ID is configured in Supabase');

console.log('\n' + '='.repeat(60));
console.log('✅ Verification complete!');
console.log('\nIf any checks failed, please:');
console.log('1. Update environment variables in Vercel');
console.log('2. Verify Supabase Dashboard → Authentication → URL Configuration');
console.log('3. Verify Google Cloud Console → OAuth 2.0 Client → Authorized redirect URIs');

