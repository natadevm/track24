const express = require('express');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all transactions for a user with filters
router.get('/', auth, async (req, res) => {
  try {
    const { category, type, startDate, endDate } = req.query;
    
    let query = { userId: req.user._id };
    
    if (category) {
      query.categoryId = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(query)
      .populate('categoryId', 'name type')
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { amount, type, categoryId, description, date } = req.body;

    // Validate category exists and belongs to user
    const category = await Category.findOne({
      _id: categoryId,
      userId: req.user._id
    });

    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const transaction = new Transaction({
      amount,
      type,
      categoryId,
      description,
      date: date || new Date(),
      userId: req.user._id
    });

    await transaction.save();
    await transaction.populate('categoryId', 'name type');
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, type, categoryId, description, date } = req.body;

    // Validate category exists and belongs to user
    const category = await Category.findOne({
      _id: categoryId,
      userId: req.user._id
    });

    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { amount, type, categoryId, description, date },
      { new: true }
    ).populate('categoryId', 'name type');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Total income and expenses
    const incomeAgg = await Transaction.aggregate([
      { $match: { userId, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const expenseAgg = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpense = expenseAgg[0]?.total || 0;
    const balance = totalIncome - totalExpense;

    // Expense breakdown by category
    const expenseByCategory = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Income breakdown by category
    const incomeByCategory = await Transaction.aggregate([
      { $match: { userId, type: 'income' } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Monthly income vs expense
    const monthlyData = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Balance trend over time
    const balanceTrend = await Transaction.aggregate([
      { $match: { userId } },
      { $sort: { date: 1 } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          }
        }
      },
      {
        $addFields: {
          balance: { $subtract: ['$income', '$expense'] }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalIncome,
      totalExpense,
      balance,
      expenseByCategory,
      incomeByCategory,
      monthlyData,
      balanceTrend
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
