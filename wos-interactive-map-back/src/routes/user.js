import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Add a user
router.post('/', async (req, res) => {
    const { Nom, id, avatar } = req.body;

    try {
        const user = new User({ Nom, id,kid, avatar });
        await user.save();
        res.status(201).json({ success: true, user });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', err);
        res.status(400).json({ success: false, message: 'Erreur lors de l\'ajout de l\'utilisateur' });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, users });
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des utilisateurs' });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', err);
        res.status(400).json({ success: false, message: 'Erreur lors de la récupération de l\'utilisateur' });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    const { nom, avatar, lvl, power, rallie } = req.body;

    if (!nom || !avatar || !lvl || isNaN(power) || isNaN(rallie)) {
        return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs correctement.' });
    }

    try {
        const updateData = { nom, avatar, lvl, power, rallie };
        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', err);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur lors de la mise à jour de l\'utilisateur' });
    }
});

router.patch('/:id/power', async (req, res) => {
  const { power, rallie } = req.body;
  if (power === undefined || rallie === undefined || isNaN(power) || isNaN(rallie)) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir des valeurs numériques valides pour power et rallie.'
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { power, rallie } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur :', err);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur lors de la mise à jour de l\'utilisateur'
    });
  }
});



// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            res.status(204).send();
        } else {
            res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', err);
        res.status(400).json({ success: false, message: 'Erreur lors de la suppression de l\'utilisateur' });
    }
});

// GET /api/users/byfid/:fid
router.get('/byfid/:fid', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.fid });
    if (user) {
      return res.json({ success: true, user });
    }
    return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur :', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});


export default router;
