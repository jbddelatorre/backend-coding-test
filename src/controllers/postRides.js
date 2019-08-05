const {
  insertRideAsync,
} = require('./sqlite_async');

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
    *           500:
    *               description: Server error. Unknown error.
    */

module.exports = async (req, res) => {
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
      message: 'Driver name must be a non empty string',
    });
  }

  if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
    return res.status(422).send({
      error_code: 'VALIDATION_ERROR',
      message: 'Driver vehicle must be a non empty string',
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

  const sql = 'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)';

  try {
    const rows = await insertRideAsync(sql, values);
    return res.status(200).send(rows);
  } catch (err) {
    return res.status(500).send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error',
    });
  }
};
