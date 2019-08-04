

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const winston = require('winston');

const expressWinston = require('express-winston');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../swaggerconfig.js');


app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
  ],
}));

module.exports = (db) => {
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.send(swaggerSpecs);
  });

  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpecs));

  /**
    * @swagger
    * /health:
    *   get:
    *       summary: Check server health
    *       description: Endpoint to check server
    *       responses:
    *           200:
    *               description: Returns string 'Healthy'
    */
  app.get('/health', (req, res) => res.status(200).send('Healthy'));

  /**
    * @swagger
    * /rides:
    *   post:
    *       summary: Create a new ride
    *       consumes: application/json
    *       parameters:
    *           -   in: body
    *               name: ride
    *               description: The ride to be created
    *               schema:
    *                   type: object
    *                   required:
    *                       - start_lat
    *                       - end_lat
    *                       - start_long
    *                       - end_long
    *                       - rider_name
    *                       - driver_name
    *                       - driver_vehicle
    *                   properties:
    *                       start_lat:
    *                           type: number
    *                           format: float
    *                           minimum: -90
    *                           maximum: 90
    *                           example: 34.5
    *                           description: The starting latitude
    *                       end_lat:
    *                           type: number
    *                           format: float
    *                           minimum: -90
    *                           maximum: 90
    *                           example: 80
    *                           description: The ending latitude
    *                       start_long:
    *                           type: number
    *                           format: float
    *                           minimum: -180
    *                           maximum: 180
    *                           example: -121
    *                           description: The starting longitude
    *                       end_long:
    *                           type: number
    *                           format: float
    *                           minimum: -180
    *                           maximum: 180
    *                           example: -142.2
    *                           description: The ending longitude
    *                       rider_name:
    *                           type: string
    *                           minLength: 1
    *                           example: Rider Jason
    *                           description: The rider name
    *                       driver_name:
    *                           type: string
    *                           minLength: 1
    *                           example: Driver Jason
    *                           description: The driver name
    *                       driver_vehicle:
    *                           type: string
    *                           minLength: 1
    *                           example: Toyota Vios
    *                           description: The driver vehicle
    *       responses:
    *           200:
    *               description: Successfully created. Returns created entry
    *           422:
    *               description: Bad Request, Validation error
    *               schema:
    *                   type: object
    *                   properties:
    *                       error_code:
    *                           type: string
    *                           description: The error code identifier
    *                       message:
    *                           type: string
    *                           description: The message for the error
    *               type: object
    *               items:
    *
    *           500:
    *               description: Server error. Unknown error.
    */

  app.post('/rides', jsonParser, (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (
      startLatitude < -90
      || startLatitude > 90
      || startLongitude < -180
      || startLongitude > 180
    ) {
      return res.status(422).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (
      endLatitude < -90
      || endLatitude > 90
      || endLongitude < -180
      || endLongitude > 180
    ) {
      return res.status(422).send({
        error_code: 'VALIDATION_ERROR',
        message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
      return res.status(422).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      return res.status(422).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      return res.status(422).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    const values = [
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      riderName,
      driverName,
      driverVehicle,
    ];

    db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
      if (err) {
        return res.status(500).send(500, {
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, (err, rows) => {
        if (err) {
          return res.status(500).send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          });
        }

        return res.status(200).send(rows);
      });

      return undefined;
    });

    return undefined;
  });

  /**
    * @swagger
    * /rides:
    *   get:
    *       summary: Fetch all rides
    *       description: Fetches all entries of ride
    *       responses:
    *           200:
    *               description: Returns an array of all rides
    *           404:
    *               description: Could not find requested data
    *           500:
    *               description: Server Error. Unknown Error.
    */

  app.get('/rides', (req, res) => {
    db.all('SELECT * FROM Rides', (err, rows) => {
      if (err) {
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.status(404).send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      return res.status(200).send(rows);
    });
  });

  /**
    * @swagger
    * /rides/:id:
    *   get:
    *       summary: Fetch details on a ride
    *       description: Fetches a specific ride based on id
    *       parameters:
    *           - in: path
    *             name: id
    *             required: true
    *             description: The ride ID
    *             example: 11
    *       responses:
    *           200:
    *               description: Returns details of ride
    *               schema:
    *                   type: object
    *                   properties:
    *                       start_lat:
    *                           type: number
    *                           format: float
    *                           description: The starting latitude
    *                       end_lat:
    *                           type: number
    *                           format: float
    *                           description: The ending latitude
    *                       start_long:
    *                           type: number
    *                           format: float
    *                           description: The starting longitude
    *                       end_long:
    *                           type: number
    *                           format: float
    *                           description: The ending longitude
    *                       rider_name:
    *                           type: string
    *                           description: The rider name
    *                       driver_name:
    *                           type: string
    *                           description: The driver name
    *                       driver_vehicle:
    *                           type: string
    *                           description: The driver vehicle
    *           404:
    *               description: Could not find requested data
    *           500:
    *               description: Server Error. Unknown Error.
    */

  app.get('/rides/:id', (req, res) => {
    db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, (err, rows) => {
      if (err) {
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.status(404).send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      return res.status(200).send(rows);
    });
  });

  app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log' }),
    ],
  }));

  return app;
};
