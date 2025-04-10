import express from 'express';
import Guild from '../models/Guild.js';

const router = express.Router();

// Add a guild
router.post('/', async (req, res) => {
    const { Nom, acronym, color } = req.body;

    try {
        const guild = new Guild({ Nom, acronym, color });
        await guild.save();
        res.status(201).json({ success: true, guild });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la guild :', err);
        res.status(400).json({ success: false, message: 'Erreur lors de l\'ajout de la guild' });
    }
});

// Get all guilds
router.get('/', async (req, res) => {
    try {
        const guilds = await Guild.find();
        res.json({ success: true, guilds });
    } catch (err) {
        console.error('Erreur lors de la récupération des guilds :', err);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des guilds' });
    }
});

// Delete a guild by ID
router.delete('/:id', async (req, res) => {
    try {
        await Guild.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error('Erreur lors de la suppression de la guild :', err);
        res.status(400).json({ success: false, message: 'Erreur lors de la suppression de la guild' });
    }
});

export default router;