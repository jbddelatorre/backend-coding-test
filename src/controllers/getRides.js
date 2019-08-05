const {
  getAsync,
} = require('./sqlite_async');

/**
    * @swagger
    * /rides:
    *   get:
    *       summary: Fetches rides
    *       description: Fetches entries of rides.
    *                    Pagination is supported. Passing no parameters will return all data.
    *       parameters:
    *         - in: query
    *           name: page
    *           schema:
    *             type: integer
    *           description: The page number of the query requested
    *         - in: query
    *           name: size
    *           schema:
    *             type: integer
    *           description: The size of data to be returned
    *       responses:
    *           200:
    *               description: Returns an array of all rides
    *           422:
    *               description: Bad Request, Validation Error.
    *               schema:
    *                   type: object
    *                   properties:
    *                       error_code:
    *                           type: string
    *                           description: The error code identifier
    *                       message:
    *                           type: string
    *                           description: The message for the error
    *           404:
    *               description: Could not find requested data
    *           500:
    *               description: Server Error. Unknown Error.
    */


module.exports = async (req, res) => {
  const page = Number(req.query.page);
  const size = Number(req.query.size);
  const noPaginate = !('page' in req.query) && !('size' in req.query);

  let sqlQuery = 'SELECT * FROM Rides';
  let values = [];

  if (!noPaginate) {
    if (page <= 0 || !Number.isInteger(page)) {
      return res.status(422).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Page must be an integer greater than or equal to 1.',
      });
    }

    if (page <= 0 || !Number.isInteger(size)) {
      return res.status(422).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Size must be an integer greater than or equal to 1.',
      });
    }

    const offset = page - 1;
    sqlQuery = 'SELECT * FROM Rides LIMIT ? OFFSET ?';
    values = [size, offset * size];
  }

  try {
    const rows = await getAsync(sqlQuery, values);

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
