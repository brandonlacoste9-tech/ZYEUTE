#!/usr/bin/env node

/**
 * Database Setup Script for Zyeuté
 * 
 * This script helps automate the database migration process by:
 * 1. Listing all migration files in order
 * 2. Providing instructions for manual execution in Supabase SQL Editor
 * 3. Validating migration file naming conventions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const migrationsDir = path.join(projectRoot, 'supabase', 'migrations');

// Expected migration order
const EXPECTED_MIGRATIONS = [
  '001_moderation_system.sql',
  '002_achievements.sql',
  '003_creator_subscriptions.sql',
  '004_live_streaming.sql',
  '005_daily_challenges.sql',
  '006_marketplace.sql',
  '007_email_system.sql',
  '007_fix_rls_001_critical.sql', // Security fix
];

function getMigrationFiles() {
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  return files;
}

function validateMigrations(foundFiles) {
  const missing = EXPECTED_MIGRATIONS.filter(expected => 
    !foundFiles.includes(expected)
  );
  
  const extra = foundFiles.filter(found => 
    !EXPECTED_MIGRATIONS.includes(found)
  );

  return { missing, extra };
}

function printMigrationInstructions(files) {
  console.log('\n📋 Database Migration Instructions\n');
  console.log('='.repeat(60));
  console.log('\n1. Open your Supabase Dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Run each migration file in the following order:\n');

  files.forEach((file, index) => {
    const filePath = path.join(migrationsDir, file);
    const exists = fs.existsSync(filePath);
    const marker = exists ? '✅' : '❌';
    console.log(`   ${marker} ${index + 1}. ${file}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Tip: Copy and paste each SQL file content into the SQL Editor');
  console.log('   and execute them one at a time.\n');
}

function main() {
  console.log('🗄️  Zyeuté Database Setup Script\n');
  console.log(`📁 Migrations directory: ${migrationsDir}\n`);

  const foundFiles = getMigrationFiles();
  console.log(`✅ Found ${foundFiles.length} migration file(s)\n`);

  const { missing, extra } = validateMigrations(foundFiles);

  if (missing.length > 0) {
    console.warn('⚠️  Missing expected migrations:');
    missing.forEach(file => console.warn(`   - ${file}`));
    console.log('');
  }

  if (extra.length > 0) {
    console.log('ℹ️  Additional migration files found:');
    extra.forEach(file => console.log(`   + ${file}`));
    console.log('');
  }

  printMigrationInstructions(foundFiles);

  console.log('📚 For detailed setup instructions, see:');
  console.log('   - SETUP_GUIDE.md');
  console.log('   - supabase/README.md\n');

  console.log('🔐 Security Note:');
  console.log('   Migration 007_fix_rls_001_critical.sql enables Row Level Security.');
  console.log('   This is critical for production security.\n');
}

main();

