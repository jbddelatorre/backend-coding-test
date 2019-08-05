module.exports = (req, res) => {
  res.status(404).send({
    error_code: 'INVALID_ROUTE',
    message: 'Not Found',
  });
};
