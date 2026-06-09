const Transaction = require('../models/transaction');
const { SendData, ServerError, NotFound, Unauthorized } = require('../helpers/response');
const getter = require('../helpers/getter');

const transactionQuery = (userId, { type, category }) => {
  const query = { user: userId };

  if (type) {
    query.type = type;
  }
  if (category) {
    query.category = new RegExp(category, 'i');
  }

  return query;
};

module.exports.get = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const query = transactionQuery(user.id, req.query);
    const data = await getter(Transaction, query, req, res, Transaction.getFields('listing'));

    return next(SendData(data));
  } catch (err) {
    return next(ServerError(err));
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return next(NotFound());

    // Check ownership
    if (transaction.user.toString() !== user.id.toString()) {
      return next(Unauthorized());
    }

    return next(SendData(transaction.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const transaction = new Transaction({
      ...req.body,
      user: user.id
    });

    await transaction.save();
    return next(SendData(transaction.response('cp'), 201));
  } catch (err) {
    return next(ServerError(err));
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return next(NotFound());

    // Check ownership
    if (transaction.user.toString() !== user.id.toString()) {
      return next(Unauthorized());
    }

    Object.assign(transaction, req.body);
    await transaction.save();

    return next(SendData(transaction.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return next(NotFound());

    // Check ownership
    if (transaction.user.toString() !== user.id.toString()) {
      return next(Unauthorized());
    }

    await transaction.softDelete();
    return next(SendData({ message: 'Transaction deleted successfully' }));
  } catch (err) {
    return next(ServerError(err));
  }
};
