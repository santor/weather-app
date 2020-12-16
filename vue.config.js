const Dotenv = require('dotenv-webpack');

module.exports = {
  configureWebpack: {
    plugins: [new Dotenv()],
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/weather-app/' : '/',
};
