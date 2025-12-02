/**
 * Colony OS Client Library for Netlify Functions
 * 
 * Provides functions to submit tasks to Colony OS Server
 */

const crypto = require('crypto');

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
 * @returns {Promise<Object>} - Response from Colony OS Server
 */
async function submitTask(funcSpec, serverHost, colonyName, userPrvkey) {
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

    // Submit to Colony OS Server
    const response = await fetch(`${serverHost}/api/v1/functions/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Colony-Signature': signature,
        'X-Colony-Timestamp': timestamp.toString(),
      },
      body: payload,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Colony OS submission failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Task submitted to Colony OS:', result.processid || result.id);
    
    return result;
  } catch (error) {
    console.error('❌ Error submitting to Colony OS:', error);
    throw error;
  }
}

/**
 * Get task status from Colony OS Server
 * 
 * @param {string} processId - Process ID
 * @param {string} serverHost - Colony OS Server host URL
 * @param {string} userPrvkey - User private key for signing
 * @returns {Promise<Object>} - Task status
 */
async function getTaskStatus(processId, serverHost, userPrvkey) {
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
    });

    if (!response.ok) {
      throw new Error(`Failed to get task status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error getting task status:', error);
    throw error;
  }
}

module.exports = {
  submitTask,
  getTaskStatus,
};

