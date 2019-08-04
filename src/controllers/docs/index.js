const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../../config/swaggerconfig.js');

const apiDocsJson = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  return res.send(swaggerSpecs);
};

/**
* @swagger
* /api-docs:
*   get:
*       summary: Documentation for the api
*       description: Rides API documentation
*       responses:
*           200:
*               description: Returns documentation
*/
const apiDocs = swaggerUi.setup(swaggerSpecs);

module.exports = {
  apiDocsJson,
  apiDocs,
};
