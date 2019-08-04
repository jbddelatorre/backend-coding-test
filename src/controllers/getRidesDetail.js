const {
  getAsync,
} = require('./sqlite_async');

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
    *             schema:
    *               type: integer
    *             description: The ride ID
    *             example: 11
    *       responses:
    *           200:
    *               description: Returns details of ridesss
    *               schema:
    *                   type: object
    *                   properties:
    *                       start_lat:
    *                           type: number
    *                           format: float
    *                           description: The starting latitude
    *                           example: 23
    *                       end_lat:
    *                           type: number
    *                           format: float
    *                           description: The ending latitude
    *                           example: 62.5
    *                       start_long:
    *                           type: number
    *                           format: float
    *                           description: The starting longitude
    *                           example: -2.5
    *                       end_long:
    *                           type: number
    *                           format: float
    *                           description: The ending longitude
    *                           example: 73
    *                       rider_name:
    *                           type: string
    *                           description: The rider name
    *                           example: Rider Jason
    *                       driver_name:
    *                           type: string
    *                           description: The driver name
    *                           example: Driver Jason
    *                       driver_vehicle:
    *                           type: string
    *                           description: The driver vehicle
    *                           example: Mazda
    *           404:
    *               description: Could not find requested data
    *           500:
    *               description: Server Error. Unknown Error.
    */

module.exports = async (req, res) => {
  const sql = `SELECT * FROM Rides WHERE rideID='${req.params.id}'`;

  try {
    const rows = await getAsync(sql);

    if (rows.length === 0) {
      return res.status(404).send({
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides',
      });
    }

    return res.status(200).send(rows);
  } catch (err) {
    return res.status(500).send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error',
    });
  }
};
