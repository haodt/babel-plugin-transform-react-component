const babel = require('@babel/core');

module.exports = {
  presets: [['@babel/preset-env', {
    modules: false
  }], '@babel/preset-react'],
  plugins: [babel.createConfigItem(require('./src/index'))],
};
