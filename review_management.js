const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

router.post('/:listingId', authenticateToken, async (req, res) => {
  const { listingId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  const newReview = new Review({
    rating,
    comment,
    owner: userId,
    listing: listingId,
  });

  try {
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:listingId', async (req, res) => {
  const { listingId } = req.params;

  try {
    const reviews = await Review.find({ listing: listingId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!checkRoleAccess(req.user.role, 'update')) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true }
    );
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!checkRoleAccess(req.user.role, 'delete')) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    await Review.findByIdAndDelete(id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});