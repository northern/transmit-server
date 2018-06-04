
var config = require('./webpack.config')

config['externals'] = ['express'];

module.exports = config;
