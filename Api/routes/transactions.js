const express = require('express');
const controller = require('../controllers/transactions');
const { isAuth } = require('../middlewares/isAuth');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router
  .route('/')
  .get(isAuth, controller.get)
  .post(validator({ body: 'createTransaction' }), isAuth, controller.create);

router
  .route('/:id')
  .all(validator({ params: 'id' }), isAuth)
  .get(controller.getById)
  .patch(validator({ body: 'updateTransaction' }), controller.update)
  .delete(controller.delete);

module.exports = router;
