const Dotenv = require('dotenv-webpack');

module.exports = {
  configureWebpack: {
    plugins: [new Dotenv()],
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
      .loader('vue-svg-inline-loader')
      .options({
        /* ... */
      });
  },
};
