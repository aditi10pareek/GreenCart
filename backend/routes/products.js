const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }
    const products = await Product.find(filters);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed data
router.post('/seed', async (req, res) => {
  try {
    const products = req.body; // Can accept an array of products
    await Product.insertMany(products);
    res.status(201).json({ message: 'Products seeded successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
