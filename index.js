'use strict';

const express = require('express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

const routes = require('./src/routes')

const {
	infoLogger,
	errorLogger
} = require('./src/config/winstonconfig.js');

db.serialize(() => {
    buildSchemas(db);
    global.db = db

    app.use(infoLogger);
    app.use(jsonParser);
    app.use(routes);
    app.use(errorLogger);

    const server = app.listen(port, () => console.log(`App started and listening on port ${port}`));

    module.exports = {
		app,
		closeServer: () => server.close()
	}
});
