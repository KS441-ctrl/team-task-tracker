const { redisClient } = require('../config/redis');

const buildTaskCacheKey = ({ assigneeId, status, priority, page, limit }) => {
  const parts = ['tasks', 'assignee', assigneeId || 'all', 'status', status || 'any', 'priority', priority || 'any', 'page', page, 'limit', limit];
  return parts.join(':');
};

const getCachedTasks = async (key) => {
  const raw = await redisClient.get(key);
  return raw ? JSON.parse(raw) : null;
};

const setCachedTasks = async (key, data) => {
  await redisClient.set(key, JSON.stringify(data), { EX: 120 });
};

const clearTaskCacheForAssignee = async (assigneeId) => {
  const stream = redisClient.scanIterator({ MATCH: `tasks:assignee:${assigneeId}:*` });
  for await (const key of stream) {
    await redisClient.del(key);
  }
};

const clearAllTaskCache = async () => {
  const stream = redisClient.scanIterator({ MATCH: 'tasks:assignee:*' });
  for await (const key of stream) {
    await redisClient.del(key);
  }
};

module.exports = { buildTaskCacheKey, getCachedTasks, setCachedTasks, clearTaskCacheForAssignee, clearAllTaskCache }; 
