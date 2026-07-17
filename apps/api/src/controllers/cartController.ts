import { Response } from 'express';
import { Cart } from '../models/Cart';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private/Customer
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user?._id }).populate('items.product', 'name price thumbnail vendor stock');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user?._id, items: [], totalPrice: 0 });
    }

    res.json({ status: 'success', data: cart });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private/Customer
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity, price } = req.body;
    let cart = await Cart.findOne({ user: req.user?._id });

    if (!cart) {
      cart = new Cart({
        user: req.user?._id,
        items: [{ product: productId, quantity, price }],
        totalPrice: price * quantity
      });
    } else {
      const itemIndex = cart.items.findIndex((p: any) => p.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price });
      }

      // Recalculate total price
      cart.totalPrice = cart.items.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0);
    }

    await cart.save();
    res.json({ status: 'success', data: cart });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private/Customer
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id });

    if (cart) {
      cart.items = cart.items.filter((item: any) => item.product.toString() !== req.params.productId);
      
      // Recalculate total price
      cart.totalPrice = cart.items.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0);
      
      await cart.save();
      res.json({ status: 'success', data: cart });
    } else {
      res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private/Customer
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id });

    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
      res.json({ status: 'success', message: 'Cart cleared' });
    } else {
      res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
