const health = require('./health.js');
const postRides = require('./postRides.js');
const getRides = require('./getRides.js');
const getRidesDetail = require('./getRidesDetail.js');
const docs = require('./docs');

module.exports = {
  health,
  postRides,
  getRides,
  getRidesDetail,
  ...docs,
};
