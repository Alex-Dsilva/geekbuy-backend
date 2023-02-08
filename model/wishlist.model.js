const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

const wishlistSchema = new mongoose.Schema({
  items: [itemSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema );

module.exports = Wishlist;