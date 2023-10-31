const Cart = require("../models/Cart");
const Product = require("../models/Products");

module.exports = {
  addToCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { cartItem, quantity } = req.body;

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, products: [] });
      }

      const existingProduct = cart.products.find(
        (product) => product.cartItem.toString() === cartItem
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ cartItem, quantity });
      }

      await cart.save();
      res.status(200).json("Product added to cart");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({ userId }).populate(
        "products.cartItem",
        "_id title supplier price imageUrl"
      );
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deleteCartItem: async (req, res) => {
    try {
      const cartItemId = req.params.cartItemId;
      const updatedCart = await Cart.findOneAndUpdate(
        { "products._id": cartItemId },
        { $pull: { products: { _id: cartItemId } } },
        { new: true }
      );

      if (!updatedCart) {
        return res.status(404).json("Cart item not found");
      }
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  decrementCartItem: async (req, res) => {
    try {
      const { userId, cartItem } = req.body;
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json("Cart not found");
      }

      const existingProduct = cart.products.find(
        (product) => product.cartItem.toString() === cartItem
      );

      if (!existingProduct) {
        return res.status(404).json("Product not found");
      }

      if (existingProduct.quantity === 1) {
        cart.products = cart.products.filter(
          (product) => product.cartItem.toString() !== cartItem
        );
      } else {
        existingProduct.quantity -= 1;
      }

      await cart.save();

      if (existingProduct.quantity === 0) {
        await Cart.updateOne({ userId }, { $pull: { products: { cartItem } } });
      }
      res.status(200).json("Product updated");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
