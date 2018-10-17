'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  // NODE_ENV: '"http://192.168.8.93:8080"'
   NODE_ENV: '"http://localhost:8080"'

})
