module.exports = {
  createTransaction: {
    $id: 'createTransaction',
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['income', 'expense'] },
      category: { type: 'string', isNotEmpty: true },
      amount: { type: 'number', minimum: 0 },
      date: { type: 'string', format: 'date-time' },
      description: { type: 'string' }
    },
    required: ['type', 'category', 'amount'],
    additionalProperties: false
  },
  updateTransaction: {
    $id: 'updateTransaction',
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['income', 'expense'] },
      category: { type: 'string', isNotEmpty: true },
      amount: { type: 'number', minimum: 0 },
      date: { type: 'string', format: 'date-time' },
      description: { type: 'string' }
    },
    additionalProperties: false
  }
};
