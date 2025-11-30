/**
 * Shared Type Definitions
 * TypeScript-like interfaces for Zyeuté × Colony OS integration
 * 
 * Note: This is JavaScript, but we document types for clarity
 */

/**
 * @typedef {Object} QuebecTask
 * @property {string} description - Task description in Joual or English
 * @property {Object} requirements - Task requirements
 * @property {string[]} constraints - Task constraints
 * @property {number} priority - Priority (1-10, higher = more important)
 * @property {number} timeout - Timeout in milliseconds
 * @property {string[]} tags - Tags for categorization
 */

/**
 * @typedef {Object} SwarmResult
 * @property {boolean} success - Whether task succeeded
 * @property {string} taskId - Colony OS task ID
 * @property {Object} result - Task result data
 * @property {string[]} agents - Agent IDs that worked on task
 * @property {Object} metadata - Additional metadata
 * @property {string} [error] - Error message if failed
 */

/**
 * @typedef {Object} SwarmResponse
 * @property {boolean} success - Whether consultation succeeded
 * @property {string} reply - Synthesized response in Joual
 * @property {Object} insights - Insights from different agents
 * @property {string[]} agents - Agent IDs consulted
 * @property {number} confidence - Confidence score (0-1)
 * @property {string} [error] - Error message if failed
 */

/**
 * @typedef {Object} RegionalData
 * @property {string} region - Region identifier ('quebec')
 * @property {string} language - Language code ('joual')
 * @property {string} culture - Culture identifier ('quebecois')
 * @property {string[]} cities - Major cities in region
 * @property {Object[]} sharedKnowledge - Knowledge from The Hive
 * @property {string} lastSync - ISO timestamp of last sync
 */

/**
 * @typedef {Object} SwarmConnection
 * @property {boolean} connected - Connection status
 * @property {string} agentId - TI-Guy agent ID in Colony OS
 * @property {Map} beeAgents - Map of available bee agents
 * @property {RegionalData} regionalData - Quebec regional context
 */

export default {
  // Types are documented above for JSDoc/TypeScript compatibility
};

