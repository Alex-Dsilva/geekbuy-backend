const express = require('express');
const { Cart } = require('../model/cart.model');
const cartRouter = express.Router();



cartRouter.get('/cart/:userId', async (req, res, next) => {
  Cart.find({ user: req.params.userId })
    .then(userCart => res.status(200).json({ cart: userCart }))
    .catch(error => next(error));
});


cartRouter.post('/add-to-cart/:userId', async (req, res, next) => {
  const { product, quantity, _id } = req.body;
  // req.params.userId
  // console.log(req.params.userId)
  try {
    let cart = await Cart.findOne({ user: req.params.userId });
    
    if (!cart) {
      cart = new Cart({
        items: [],
        user: req.params.userId
      });
    }
   
    if (_id) {
      const productIndex = cart.items.findIndex(item => item._id.toString() === _id.toString());
      if (productIndex === -1) {
        cart.items.push({ product, quantity });
      } else {
        cart.items[productIndex].quantity += quantity;
      }
    } else {
      cart.items.push({ product, quantity });
    }

    await cart.save();
    res.status(201).send(cart);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});




cartRouter.patch('/:userId', async (req, res) => {
      try {
        const userId = req.params.userId;
        const updatedItems = req.body.items;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).send('Cart not found');

        updatedItems.forEach(updatedItem => {
          const itemIndex = cart.items.findIndex(item => item.product.toString() === updatedItem.product);
          if (itemIndex !== -1) {
            cart.items[itemIndex].quantity = updatedItem.quantity;
          }
        });

        await cart.save();
        
        res.status(200).send({ message: 'Cart updated', cart });
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
    });

    cartRouter.delete('/:userId/:productId', async (req, res) => {
      try {
        const userId = req.params.userId;
        const productId = req.params.productId;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).send('Cart not found');

        const itemIndex = cart.items.findIndex(item => item._id.toString() === productId);
        if (itemIndex === -1) return res.status(404).send('Item not found in cart');

        cart.items.splice(itemIndex, 1);
        await cart.save();

        res.status(200).send({ message: 'Item removed from cart', cart });
      } catch (error) {
        res.status(400).send(error);
      }
    });


    cartRouter.delete('/:userId', async (req, res) => {
      try {
        const userId = req.params.userId;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).send('Cart not found');

        cart.items = [];
        await cart.save();

        res.status(200).send({ message: 'All items removed from cart', cart });
      } catch (error) {
        res.status(400).send(error);
      }
    });



    cartRouter.patch('/:userId/:productId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;
    const updatedQuantity = req.body.quantity;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).send('Cart not found');

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).send('Product not found in cart');

    cart.items[itemIndex].quantity = updatedQuantity;
    await cart.save();

    res.status(200).send({ message: 'Product quantity updated', cart });
  } catch (error) {
    res.status(400).send(error);
    }
  })


    module.exports = { cartRouter };
