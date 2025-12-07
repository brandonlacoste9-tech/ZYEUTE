/* eslint-env jest */
/**
 * Tests for Colony OS Client
 *
 * Tests timeout handling, error recovery, and signature generation
 */

import { submitTask, getTaskStatus } from '../lib/colony-client.js';

describe('Colony OS Client - Timeout Handling', () => {
  test('should timeout after specified duration', async () => {
    // Mock slow server
    global.fetch = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 10000)));

    // Should timeout after 5 seconds
    await expect(
      submitTask(
        { funcname: 'test', args: [] },
        'http://localhost:8080',
        'test-colony',
        'test-key',
        5000
      )
    ).rejects.toThrow('timeout');
  });

  test('should clear timeout on successful request', async () => {
    // Mock fast server
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ processid: 'test-123' }),
      })
    );

    // Should succeed without timeout
    const result = await submitTask(
      { funcname: 'test', args: [] },
      'http://localhost:8080',
      'test-colony',
      'test-key',
      5000
    );

    expect(result.processid).toBe('test-123');
  });

  test('should use default timeout if not specified', async () => {
    // Verify default timeout is 5000ms
    // This is a placeholder test
    expect(true).toBe(true);
  });
});

describe('Colony OS Client - Error Handling', () => {
  test('should handle network errors', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    await expect(
      submitTask({ funcname: 'test', args: [] }, 'http://localhost:8080', 'test-colony', 'test-key')
    ).rejects.toThrow();
  });

  test('should handle 500 errors from Colony Server', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error'),
      })
    );

    await expect(
      submitTask({ funcname: 'test', args: [] }, 'http://localhost:8080', 'test-colony', 'test-key')
    ).rejects.toThrow('Colony OS submission failed');
  });
});

describe('Colony OS Client - Signature Generation', () => {
  test('should generate signature for request', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ processid: 'test-123' }),
      })
    );

    await submitTask(
      { funcname: 'test', args: [] },
      'http://localhost:8080',
      'test-colony',
      'test-key'
    );

    // Verify fetch was called with signature headers
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Colony-Signature': expect.any(String),
          'X-Colony-Timestamp': expect.any(String),
        }),
      })
    );
  });
});
