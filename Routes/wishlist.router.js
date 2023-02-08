const express = require('express');
const Wishlist = require('../model/wishlist.model');
const WishlistRouter = express.Router();



WishlistRouter.get('/wishlist/:userId', async(req, res, next) => {
  Wishlist.find({ user: req.params.userId }).populate('items.product')
    .then(userWishlist => res.status(200).json({ wishlist: userWishlist }))
    .catch(error => next(error));
});

WishlistRouter.post('/wishlist/:userId', async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.params.userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        items: [],
        user: req.params.userId
      });
    }

    const productIndex = wishlist.items.findIndex(item => item.product.toString() === req.body.product);

    if (productIndex === -1) {
      wishlist.items.push({ product: req.body.product, quantity: req.body.quantity });
    } else {
      wishlist.items.splice(productIndex, 1);
    }

    await wishlist.save();
    res.status(201).send(wishlist);
  } catch (error) {
    res.status(400).send(error);
  }
});




WishlistRouter.delete('/:userId/:productId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).send('Wishlist not found');

    const itemIndex = wishlist.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).send('Item not found in wishlist');

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    res.status(200).send({ message: 'Item removed from wishlist', wishlist });
  } catch (error) {
    res.status(400).send(error);
  }
});






module.exports = {WishlistRouter};
