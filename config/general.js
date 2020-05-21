const config = {
  app: {
    NAME: process.env.APP_NAME,
    PORT: process.env.APP_PORT,
  },
  mongo: {
    HOST: process.env.MONGO_HOST,
    DATABASE: process.env.MONGO_DATABASE,
    PORT: process.env.MONGO_PORT,
    USERNAME: process.env.MONGO_USERNAME,
    PASSWORD: process.env.MONGO_PASSWORD,
    ENABLE_SSL: Number(process.env.MONGO_ENABLE_SSL),
  },
  rito:{
    API_KEY: process.env.RITO_API_KEY,
    USER_URL: process.env.RITO_USER_URL,
    USER_FULL_URL: process.env.RITO_USER_FULL_URL
  }

};

module.exports = config;
