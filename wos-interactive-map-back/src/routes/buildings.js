import express from 'express';
import Building from '../models/Building.js';

const router = express.Router();

// Add a building
router.post('/', async (req, res) => {
    const { location, size, type, addedBy,alliance, extraData } = req.body;

    try {
        const building = new Building({ location, size, type, addedBy,alliance, extraData: extraData || {} });
        await building.save();
        res.status(201).json({ success: true, building });
    } catch (err) {
        console.error('Error adding building:', err);
        res.status(400).json({ success: false, message: 'Error adding building' });
    }
});


// Get all buildings
router.get('/', async (req, res) => {
  try {
    // Populate the alliance/guild field
    const buildings = await Building.find()
      .populate('alliance', 'Nom acronym color'); // only include these fields

    res.json({ success: true, buildings });
  } catch (err) {
    console.error('Error fetching buildings:', err);
    res.status(500).json({ success: false, message: 'Error fetching buildings' });
  }
});


// Delete a building by ID
router.delete('/:id', async (req, res) => {
    try {
        await Building.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting building:', err);
        res.status(400).json({ success: false, message: 'Error deleting building' });
    }
});

// Update a building by ID
router.put('/:id', async (req, res) => {
    const { location, size, type, addedBy,alliance, extraData } = req.body;

    try {
        const updatedBuilding = await Building.findByIdAndUpdate(
            req.params.id,
            { location, size, type, addedBy,alliance, extraData },
            { new: true, runValidators: true }
        );

        if (!updatedBuilding) {
            return res.status(404).json({ success: false, message: 'Building not found' });
        }

        res.json({ success: true, building: updatedBuilding });
    } catch (err) {
        console.error('Error updating building:', err);
        res.status(400).json({ success: false, message: 'Error updating building' });
    }
});

export default router;