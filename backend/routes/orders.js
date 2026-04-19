const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');

// Create Order
router.post('/', async (req, res) => {
  try {
    const { userId, items, totalPrice, totalCarbonFootprint, deliveryOption } = req.body;
    
    const newOrder = new Order({
      user: userId,
      items,
      totalPrice,
      totalCarbonFootprint,
      deliveryOption
    });
    
    await newOrder.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      // Calculate carbon saved compared to normal products if possible
      // Assuming some simple logic here
      let carbonSaved = 0;
      let ecoPurchases = 0;
      
      // We would check products to see if they are green, etc.
      user.totalCarbonSaved += 5; // Placeholder
      user.ecoFriendlyPurchases += 1; // Placeholder
      await user.save();
    }

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
