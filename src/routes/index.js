const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');

const {
  health,
  postRides,
  getRides,
  getRidesDetail,
  apiDocsJson,
  apiDocs,
} = require('../controllers');

const router = Router({
  mergeParams: true,
});

router.get(
  '/api-docs.json',
  apiDocsJson,
);

router.use(
  '/api-docs',
  swaggerUi.serve,
);

router.get(
  '/api-docs',
  apiDocs,
);

router.get(
  '/health',
  health,
);

router.post(
  '/rides',
  postRides,
);

router.get(
  '/rides',
  getRides,
);

router.get(
  '/rides/:id',
  getRidesDetail,
);

module.exports = router;
