const app = require('./app');
const config = require('./config');
const { connectRedis } = require('./config/redis');

const start = async () => {
  await connectRedis();
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
};

start().catch((error) => {
  console.error('Startup error', error);
  process.exit(1);
});
