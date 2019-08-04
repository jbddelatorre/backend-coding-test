const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    name: 'Rides API',
    info: {
      title: 'Rides API',
      description: 'This is an API for creating and fetching rides. \n \n To make changes in the documentation, just update content found under @swagger decorator found in each route. \n \n For more information on syntax, visit: https://swagger.io/docs/specification/basic-structure/',
      version: '1.0.0',
    },
  },
  // Path to the API docs
  apis: ['src/controllers/**/*.js'],
};

module.exports = swaggerJSDoc(options);
