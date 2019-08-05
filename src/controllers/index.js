const health = require('./health.js');
const postRides = require('./postRides.js');
const getRides = require('./getRides.js');
const getRidesDetail = require('./getRidesDetail.js');
const invalidRoute = require('./invalidRoute.js');
const docs = require('./docs');

module.exports = {
  health,
  postRides,
  getRides,
  getRidesDetail,
  invalidRoute,
  ...docs,
};
