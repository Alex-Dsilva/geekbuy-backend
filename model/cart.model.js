const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  items: [itemSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = {Cart};