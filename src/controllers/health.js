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

module.exports = (req, res) => res.status(200).send('Healthy');
