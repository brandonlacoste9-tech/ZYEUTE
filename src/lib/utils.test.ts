/**
 * Unit tests for utility functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  formatNumber,
  formatDuration,
  getTimeAgo,
  isValidPostalCode,
  extractHashtags,
  truncate,
  generateId,
  isUserOnline,
  extractSupabaseProjectRef,
  validateSupabaseUrl,
} from './utils';

describe('cn (className merger)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('should handle Tailwind conflicts', () => {
    // twMerge should handle Tailwind class conflicts
    const result = cn('px-2', 'px-4');
    expect(result).toContain('px-4');
    expect(result).not.toContain('px-2');
  });
});

describe('formatNumber', () => {
  it('should format numbers under 1000 with spaces', () => {
    expect(formatNumber(123)).toBe('123');
    expect(formatNumber(999)).toBe('999');
  });

  it('should format thousands with K suffix', () => {
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(42000)).toBe('42.0K');
  });

  it('should format millions with M suffix', () => {
    expect(formatNumber(2500000)).toBe('2.5M');
    expect(formatNumber(10000000)).toBe('10.0M');
  });

  it('should handle edge cases', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1000000)).toBe('1.0M');
  });
});

describe('formatDuration', () => {
  it('should format seconds into MM:SS', () => {
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(125)).toBe('2:05');
  });

  it('should format hours into H:MM:SS', () => {
    expect(formatDuration(3665)).toBe('1:01:05');
    expect(formatDuration(7200)).toBe('2:00:00');
  });

  it('should handle edge cases', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(59)).toBe('0:59');
    expect(formatDuration(60)).toBe('1:00');
  });
});

describe('getTimeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return "À l\'instant" for recent times', () => {
    const date = new Date('2024-01-15T11:59:30Z'); // 30 seconds ago
    expect(getTimeAgo(date)).toBe('À l\'instant');
  });

  it('should return minutes ago', () => {
    const date = new Date('2024-01-15T11:55:00Z'); // 5 minutes ago
    expect(getTimeAgo(date)).toBe('Il y a 5 minutes');
  });

  it('should return hours ago', () => {
    const date = new Date('2024-01-15T10:00:00Z'); // 2 hours ago
    expect(getTimeAgo(date)).toBe('Il y a 2 heures');
  });

  it('should return days ago', () => {
    const date = new Date('2024-01-13T12:00:00Z'); // 2 days ago
    expect(getTimeAgo(date)).toBe('Il y a 2 jours');
  });

  it('should handle singular forms', () => {
    const oneMinuteAgo = new Date('2024-01-15T11:59:00Z');
    expect(getTimeAgo(oneMinuteAgo)).toBe('Il y a 1 minute');
  });
});

describe('isValidPostalCode', () => {
  it('should validate Quebec postal codes', () => {
    expect(isValidPostalCode('H2X 1Y7')).toBe(true);
    expect(isValidPostalCode('G1A 0A1')).toBe(true);
    expect(isValidPostalCode('J5R 4P3')).toBe(true);
  });

  it('should reject non-Quebec postal codes', () => {
    expect(isValidPostalCode('K1A 0B1')).toBe(false); // Ottawa (K)
    expect(isValidPostalCode('M5H 2N2')).toBe(false); // Toronto (M)
  });

  it('should handle postal codes without spaces', () => {
    expect(isValidPostalCode('H2X1Y7')).toBe(true);
  });

  it('should reject invalid formats', () => {
    expect(isValidPostalCode('123456')).toBe(false);
    expect(isValidPostalCode('ABC DEF')).toBe(false);
    expect(isValidPostalCode('')).toBe(false);
  });
});

describe('extractHashtags', () => {
  it('should extract hashtags from text', () => {
    const text = 'Check out #Montreal and #Poutine!';
    expect(extractHashtags(text)).toEqual(['#Montreal', '#Poutine']);
  });

  it('should handle Quebec French characters', () => {
    const text = 'Le #Québec est #malade!';
    expect(extractHashtags(text)).toEqual(['#Québec', '#malade']);
  });

  it('should return empty array when no hashtags', () => {
    expect(extractHashtags('No hashtags here')).toEqual([]);
  });

  it('should handle multiple hashtags', () => {
    const text = '#MTL #QC #514 #FretteEnEstie';
    expect(extractHashtags(text)).toHaveLength(4);
  });
});

describe('truncate', () => {
  it('should truncate long text', () => {
    const text = 'This is a very long text that needs truncation';
    expect(truncate(text, 20)).toBe('This is a very long...');
  });

  it('should not truncate short text', () => {
    const text = 'Short text';
    expect(truncate(text, 20)).toBe('Short text');
  });

  it('should handle exact length', () => {
    const text = 'Exactly 20 chars txt';
    expect(truncate(text, 20)).toBe(text);
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should generate IDs of consistent format', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]+$/);
  });
});

describe('isUserOnline', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return true for recent activity', () => {
    const recentTime = new Date('2024-01-15T11:58:00Z'); // 2 minutes ago
    expect(isUserOnline(recentTime)).toBe(true);
  });

  it('should return false for old activity', () => {
    const oldTime = new Date('2024-01-15T11:50:00Z'); // 10 minutes ago
    expect(isUserOnline(oldTime)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isUserOnline(null)).toBe(false);
  });

  it('should handle edge case at 5 minutes', () => {
    const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z');
    expect(isUserOnline(fiveMinutesAgo)).toBe(false);
  });
});

describe('extractSupabaseProjectRef', () => {
  it('should extract project ref from valid URLs', () => {
    const url = 'https://vuanulvyqkfefmjcikfk.supabase.co';
    expect(extractSupabaseProjectRef(url)).toBe('vuanulvyqkfefmjcikfk');
  });

  it('should handle .in domains', () => {
    const url = 'https://projectref.supabase.in';
    expect(extractSupabaseProjectRef(url)).toBe('projectref');
  });

  it('should return null for invalid URLs', () => {
    expect(extractSupabaseProjectRef('https://invalid-url.com')).toBeNull();
    expect(extractSupabaseProjectRef('not a url')).toBeNull();
  });

  it('should handle http and https', () => {
    expect(extractSupabaseProjectRef('http://test.supabase.co')).toBe('test');
    expect(extractSupabaseProjectRef('https://test.supabase.co')).toBe('test');
  });
});

describe('validateSupabaseUrl', () => {
  let consoleLogSpy: any;
  let consoleWarnSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should log success for correct project', () => {
    validateSupabaseUrl('https://vuanulvyqkfefmjcikfk.supabase.co');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('✅ Using correct Supabase project')
    );
  });

  it('should error for wrong project', () => {
    validateSupabaseUrl('https://kihxqurnmyxnsyqgpdaw.supabase.co');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ WRONG SUPABASE PROJECT DETECTED')
    );
  });

  it('should warn for demo URL', () => {
    validateSupabaseUrl('https://demo.supabase.co');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('⚠️ Using demo Supabase URL')
    );
  });

  it('should warn for unexpected project', () => {
    validateSupabaseUrl('https://someother.supabase.co');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('⚠️ Using unexpected Supabase project')
    );
  });

  it('should warn for invalid URL format', () => {
    validateSupabaseUrl('https://invalid-url.com');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('⚠️ Supabase URL format is unexpected')
    );
  });
});
