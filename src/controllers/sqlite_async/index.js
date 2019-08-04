/* global db */

const getAsync = sql => new Promise(((resolve, reject) => {
  db.all(sql, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
}));

const insertRideAsync = (sql, values) => new Promise(((resolve, reject) => {
  db.run(sql, values, function (err) {
    if (err) reject(err);
    else {
      db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }
  });
}));

module.exports = {
  getAsync,
  insertRideAsync,
};
