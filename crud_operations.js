const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

router.post('/', authenticateToken, async (req, res) => {
  const { name, phone, city, address, images } = req.body;
  const userId = req.user._id;

  if (!checkRoleAccess(req.user.role, 'create')) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const newListing = new Listing({
    name,
    phone,
    city,
    address,
    images,
    owner: userId,
  });

  try {
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, phone, city, address, images } = req.body;

  if (!checkRoleAccess(req.user.role, 'update')) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { name, phone, city, address, images },
      { new: true }
    );
    res.json(updatedListing);
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
    await Listing.findByIdAndDelete(id);
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});