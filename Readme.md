# Rides API

This a node-express server that allows to fetch and create rides to be stored in an in-memory database.

## Dependencies

To run the server, the following are needed:

`Node (>8.6 and <= 10)`

`npm`

## Getting Started

After cloning the repo to your local machine, the following steps are:

1. Run `npm install` to install all dependencies needed for the server
2. Run `npm start` to start the server, or you may run `npm run dev` to run the server with hot-reload

## Features

* Create new rides entry
* Fetch rides entry, with optional query for pagination
* Fetch detail of specific ride based on ID
* Endpoint to check server health
* Web format documentation for api endpoints
* Implemented protection for SQL injections
* ES2017 implementation of async/await

## Tests

To run the series of tests, run `npm test`. 

```
npm test
```

The tests used are the following. You may also run tests individually.

* `mocha` - Create test cases for api
    - run `npm run mocha` to run api tests
* `eslint` - Linting uses airbnb standard
    - run `npm run lint` to run linter, and `npm run lint:fix` to apply automated lint fixes
* `nyc` - Code coverage of greater than `80%` for lines, statements, and branches
    - run `npm run coverage` to run test coverage

Load testing is also supported with the use `artillery` and `forever`. Load test will start a daemon to run tests in the background. 

```
npm run test:load
```

To stop the daemon, run the command `npm run test:load:stop`. Results will be found in `out.log`

You may also run the test without the daemon using `npm run load`. Config for the load testing can be found at `artillery.yaml`

## Git hooks

The git hook pre-push is also installed. Tests will run before being able to successfully push.

## Logs

Server interactions are also logged with the used of `winston`. All error logs will be found in `error.log`, while informational logs will be found at `info.log`

## Documentation

API documentation can be found at localhost:8010/api-docs

To make updates to the documentation, just update the content under @swagger decorator found in each of the api route

# Xendit Coding Exercise

The goal of these exercises are to assess your proficiency in software engineering that is related to the daily work that we do at Xendit. Please follow the instructions below to complete the assessment.

## Setup

1. Fork this repository to your own github profile
2. Ensure `node (>8.6 and <= 10)` and `npm` are installed
3. Run `npm install`
4. Run `npm test`
5. Run `npm start`
6. Hit the server to test health `curl localhost:8010/health` and expect a `200` response 

## Tasks

Below will be your set of tasks to accomplish. Please work on each of these tasks in order. Success criteria will be defined clearly for each task

1. [Documentation](#documentation)
2. [Implement Tooling](#implement-tooling)
3. [Implement Pagination](#implement-pagination)
4. [Refactoring](#refactoring)
5. [Security](#security)
6. [Load Testing](#load-testing)

### Documentation

Please deliver documentation of the server that clearly explains the goals of this project and clarifies the API response that is expected.

#### Success Criteria

1. A pull request against `master` of your fork with a clear description of the change and purpose and merge it
3. **[BONUS]** Create an easy way to deploy and view the documentation in a web format and include instructions to do so

### Implement Tooling

Please implement the following tooling:

1. `eslint` - for linting
2. `nyc` - for code coverage
3. `pre-push` - for git pre push hook running tests
4. `winston` - for logging

#### Success Criteria

1. Create a pull request against `master` of your fork with the new tooling and merge it
    1. `eslint` should have an opinionated format
    2. `nyc` should aim for test coverage of `80%` across lines, statements, and branches
    3. `pre-push` should run the tests before allowing pushing using `git`
    4. `winston` should be used to replace console logs and all errors should be logged as well. Logs should go to disk.
2. Ensure that tooling is connected to `npm test`
3. Create a separate pull request against `master` of your fork with the linter fixes and merge it
4. Create a separate pull request against `master` of your fork to increase code coverage to acceptable thresholds and merge it
5. **[BONUS]** Add integration to CI such as Travis or Circle
6. **[BONUS]** Add Typescript support

### Implement Pagination

Please implement pagination to retrieve pages of the resource `rides`.

1. Create a pull request against `master` with your changes to the `GET /rides` endpoint to support pagination including:
    1. Code changes
    2. Tests
    3. Documentation
2. Merge the pull request

### Refactoring

Please implement the following refactors of the code:

1. Convert callback style code to use `async/await`
2. Reduce complexity at top level control flow logic and move logic down and test independently
3. **[BONUS]** Split between functional and imperative function and test independently

#### Success Criteria

1. A pull request against `master` of your fork for each of the refactors above with:
    1. Code changes
    2. Tests

### Security

Please implement the following security controls for your system:

1. Ensure the system is not vulnerable to [SQL injection](https://www.owasp.org/index.php/SQL_Injection)
2. **[BONUS]** Implement an additional security improvement of your choice

#### Success Criteria

1. A pull request against `master` of your fork with:
    1. Changes to the code
    2. Tests ensuring the vulnerability is addressed

### Load Testing

Please implement load testing to ensure your service can handle a high amount of traffic

#### Success Criteria

1. Implement load testing using `artillery`
    1. Create a PR against `master` of your fork including artillery
    2. Ensure that load testing is able to be run using `npm test:load`. You can consider using a tool like `forever` to spin up a daemon and kill it after the load test has completed.
    3. Test all endpoints under at least `100 rps` for `30s` and ensure that `p99` is under `50ms`
