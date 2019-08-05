'use strict';

const request = require('supertest');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// const routes = require('../src/routes')
const { app, closeServer } = require('../index');
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('GET /rides', () => {
        it('should return 404', (done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(404, done);
        });
    });

    describe('GET /rides/:id', () => {
        it('should return 404', (done) => {
            request(app)
                .get('/rides/99')
                .expect('Content-Type', /json/)
                .expect(404, done);
        });
    });

    const POST_RIDES_TEST_DATA = [
        {
            'body': {
                "start_lat": -66.5,
                "end_lat": -80,
                "start_long": 12.3,
                "end_long": 40,
                "rider_name": "Rider Jason",
                "driver_name": "Driver Jason",
                "driver_vehicle": "Nissan Sentra"
            },
            'response': 200
        },
        {
            'body': {
                "start_lat": -66.5,
                "end_lat": -1000,
                "start_long": 12.3,
                "end_long": 40,
                "rider_name": "Rider Jason",
                "driver_name": "Driver Jason",
                "driver_vehicle": "Nissan Sentra"
            },
            'response': 422
        },
        {
            'body': {
                "start_lat": -660.5,
                "end_lat": -100,
                "start_long": 12.3,
                "end_long": 40,
                "rider_name": "Rider Jason",
                "driver_name": "Driver Jason",
                "driver_vehicle": "Nissan Sentra"
            },
            'response': 422
        },
        {
            'body': {
                "start_lat": -66.5,
                "end_lat": -20,
                "start_long": 1012.3,
                "end_long": 40,
                "rider_name": "Rider Jason",
                "driver_name": "Driver Jason",
                "driver_vehicle": "Nissan Sentra"
            },
            'response': 422
        },
        {
            'body': {
                "start_lat": -66.5,
                "end_lat": -20,
                "start_long": 12.3,
                "end_long": 200,
                "rider_name": "Rider Jason",
                "driver_name": "Driver Jason",
                "driver_vehicle": "Nissan Sentra"
            },
            'response': 422
        },
        {
            'body': {
                "start_lat": -66.5,
                "end_lat": -90,
                "start_long": 12.3,
                "end_long": 40,
                "rider_name": "",
                "driver_name": "Driver Jason",
                "driver_vehicle": "Nissan Sentra"
            },
            'response': 422
        },
        {
            'body': {
                "start_lat": -66.5,
                "end_lat": -90,
                "start_long": 12.3,
                "end_long": 40,
                "rider_name": "Rider Jason",
                "driver_name": "",
                "driver_vehicle": "Nissan Sentra"
            },
            'response': 422
        },
        {
            'body': {
                "start_lat": -66.5,
                "end_lat": -90,
                "start_long": 12.3,
                "end_long": 40,
                "rider_name": "Rider Jason",
                "driver_name": "Driver Jason",
                "driver_vehicle": ""
            },
            'response': 422
        },
        {
            'body': {
                "start_lat": -66.5,
                "end_lat": -90,
                "start_long": 12.3,
                "end_long": 40,
                "rider_name": "'driver jason'",
                "driver_name": "Driver Jason",
                "driver_vehicle": "car"
            },
            'response': 200
        },
    ]

    POST_RIDES_TEST_DATA.forEach(test => {
        describe('POST /rides', () => {
            it('create new ride', (done) => {
                request(app)
                    .post('/rides')
                    .send(test.body)
                    .expect('Content-Type', /json/)
                    .expect(test.response, done);
            });
        });
    })

    describe('GET /rides', () => {
        it('should return all rides', (done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    const PAGINATE_TEST_DATA = [
        {
            'query': {
                "page": 1,
                "size": 3
            },
            response: 200
        },
        {
            'query': {
                "page": 'one',
                "size": 3
            },
            response: 422
        },
        {
            'query': {
                "page": 2,
                "size": false
            },
            response: 422
        },
        {
            'query': {
                "page": '',
                "size": ''
            },
            response: 422
        },
        {
            'query': {
                "page": 1.3,
                "size": 3.2
            },
            response: 422
        },
    ]

    PAGINATE_TEST_DATA.forEach(test => {
        describe('GET /rides', () => {
            it('should return paginated rides', (done) => {
                request(app)
                    .get('/rides')
                    .query(test.query)
                    .expect('Content-Type', /json/)
                    .expect(test.response, done);
            });
        });
    })

    describe('GET /rides', () => {
        it('prevent sql injection', (done) => {
            request(app)
                .get('/rides')
                .query({
                    size: "3;--"
                })
                .expect('Content-Type', /json/)
                .expect(422, done);
        });
    });

    describe('GET /rides/:id', () => {
        it('should return rides detail', (done) => {
            request(app)
                .get('/rides/1')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /rides/:id', () => {
        it('should return rides detail', (done) => {
            request(app)
                .get('/rides/999')
                .expect('Content-Type', /json/)
                .expect(404, done);
        });
    });
    

    describe('GET /rides/:id', () => {
        it('prevent sql injection', (done) => {
            request(app)
                .get("/rides/1' OR '1=1")
                .expect('Content-Type', /json/)
                .expect(422, done)
        });
    });


    describe('GET /api-docs.json', () => {
        it('should return api-docs json', (done) => {
            request(app)
                .get('/api-docs.json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('POST /rides/:id', () => {
        it('should return 404', (done) => {
            request(app)
                .post('/rides/1')
                .send({
                    test: 'no post method'
                })
                .expect('Content-Type', /json/)
                .expect(404, done);
        });
    });

    closeServer()
});