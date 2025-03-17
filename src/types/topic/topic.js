
/**
 * @typedef {(
 *  'today' |
 *  'yesterday' |
 *  'week' |
 *  'month' |
 *  `${number}-${string}` |
 *  `${number}`
 * )} TimeGroupId
 */

/**
 * @enum {string}
 */
export const TopicDisplayMode = {
  ByTime: 'byTime',
  Flat: 'flat',
  // AscMessages: 'ascMessages',
  // DescMessages: 'descMessages'
};

/**
 * @typedef {Object} GroupedTopic
 * @property {ChatTopic[]} children
 * @property {string} id
 * @property {string} [title]
 */

/**
 * @typedef {Object} ChatTopicMetadata
 * @property {string} [model]
 * @property {string} [provider]
 */

/**
 * @typedef {Object} ChatTopicSummary
 * @property {string} content
 * @property {string} model
 * @property {string} provider
 */

/**
 * @typedef {Object.<string, ChatTopic>} ChatTopicMap
 */

/**
 * @typedef {Object} TopicRankItem
 * @property {number} count
 * @property {string} id
 * @property {string|null} sessionId
 * @property {string|null} title
 */
