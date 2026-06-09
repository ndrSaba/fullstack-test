const mongoose = require('mongoose');
const softDelete = require('../helpers/softDelete');
const dbFields = require('../helpers/dbFields');

const { Schema } = mongoose;

const schema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

schema.plugin(softDelete);
schema.plugin(dbFields, {
  fields: {
    public: ['_id', 'type', 'category', 'amount', 'date', 'description', 'createdAt'],
    listing: ['_id', 'type', 'category', 'amount', 'date', 'description', 'createdAt'],
    cp: ['_id', 'type', 'category', 'amount', 'date', 'description', 'updatedAt', 'createdAt']
  }
});

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', schema);
