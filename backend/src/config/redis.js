const { createClient } = require('redis');
const config = require('./index');

const redisClient = createClient({ url: config.redisUrl });
redisClient.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

module.exports = { redisClient, connectRedis };
