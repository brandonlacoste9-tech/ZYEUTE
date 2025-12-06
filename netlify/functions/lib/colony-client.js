/**
 * Colony OS Client Library for Netlify Functions
 * 
 * Provides functions to submit tasks to Colony OS Server
 * 
 * SECURITY NOTE (MVP):
 * Currently using simplified HMAC-SHA256 signatures for MVP.
 * Colony OS expects Ed25519 cryptographic signatures in production.
 * 
 * TODO (Phase 2.2 Security Hardening):
 * - Implement proper Ed25519 signature generation
 * - Use @noble/ed25519 or similar library
 * - Match Colony OS signature verification exactly
 * 
 * See: colony-crypto.js for upgrade path
 */

import crypto from 'crypto';

/**
 * Submit a task to Colony OS Server
 * 
 * @param {Object} funcSpec - Function specification
 * @param {string} funcSpec.funcname - Function name (e.g., 'validate_revenue')
 * @param {Array} funcSpec.args - Function arguments
 * @param {number} funcSpec.priority - Task priority (1-10, higher = more urgent)
 * @param {number} funcSpec.maxexectime - Maximum execution time in seconds
 * @param {string} serverHost - Colony OS Server host URL
 * @param {string} colonyName - Colony name
 * @param {string} userPrvkey - User private key for signing
 * @param {number} timeout - Request timeout in milliseconds (default: 5000)
 * @returns {Promise<Object>} - Response from Colony OS Server
 */
async function submitTask(funcSpec, serverHost, colonyName, userPrvkey, timeout = 5000) {
  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Construct the full function spec
    const fullSpec = {
      funcname: funcSpec.funcname,
      args: funcSpec.args || [],
      priority: funcSpec.priority || 5,
      maxexectime: funcSpec.maxexectime || 30,
      colonyname: colonyName,
      ...funcSpec
    };

    // Sign the request (simplified - in production use pycolonies crypto)
    // For now, we'll use a basic signature approach
    const timestamp = Date.now();
    const payload = JSON.stringify(fullSpec);
    const signature = crypto
      .createHmac('sha256', userPrvkey)
      .update(payload + timestamp)
      .digest('hex');

    // Submit to Colony OS Server with timeout
    const response = await fetch(`${serverHost}/api/v1/functions/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Colony-Signature': signature,
        'X-Colony-Timestamp': timestamp.toString(),
      },
      body: payload,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Colony OS submission failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Task submitted to Colony OS:', result.processid || result.id);
    
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('❌ Colony OS submission timeout after', timeout, 'ms');
      throw new Error(`Colony OS submission timeout after ${timeout}ms`);
    }
    console.error('❌ Error submitting to Colony OS:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Get task status from Colony OS Server
 * 
 * @param {string} processId - Process ID
 * @param {string} serverHost - Colony OS Server host URL
 * @param {string} userPrvkey - User private key for signing
 * @param {number} timeout - Request timeout in milliseconds (default: 3000)
 * @returns {Promise<Object>} - Task status
 */
async function getTaskStatus(processId, serverHost, userPrvkey, timeout = 3000) {
  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const timestamp = Date.now();
    const signature = crypto
      .createHmac('sha256', userPrvkey)
      .update(processId + timestamp)
      .digest('hex');

    const response = await fetch(`${serverHost}/api/v1/processes/${processId}`, {
      method: 'GET',
      headers: {
        'X-Colony-Signature': signature,
        'X-Colony-Timestamp': timestamp.toString(),
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to get task status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('❌ Task status check timeout after', timeout, 'ms');
      throw new Error(`Task status check timeout after ${timeout}ms`);
    }
    console.error('❌ Error getting task status:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export { submitTask, getTaskStatus };

