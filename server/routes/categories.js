const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all categories for a user
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new category
router.post('/', auth, async (req, res) => {
  try {
    const { name, type } = req.body;

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      name,
      type,
      userId: req.user._id
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      type,
      userId: req.user._id
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a category
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type } = req.body;
    
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, type },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
