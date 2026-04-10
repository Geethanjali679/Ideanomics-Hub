const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createIdea, getIdeas, getIdeaById, updateIdea, deleteIdea,
  getMyIdeas, unlockIdea, getIdeaInvestors
} = require('../controllers/ideas');

router.get('/', protect, getIdeas);
// Any logged-in non-admin user can submit ideas (creators AND investors)
router.post('/', protect, authorize('creator', 'investor'), createIdea);
router.get('/my', protect, authorize('creator', 'investor'), getMyIdeas);
router.get('/:id', protect, getIdeaById);
router.put('/:id', protect, authorize('creator', 'investor', 'admin'), updateIdea);
router.delete('/:id', protect, authorize('creator', 'investor', 'admin'), deleteIdea);
// Only investors need to unlock — creators and admin always see their own / all
router.post('/:ideaId/unlock', protect, authorize('investor'), unlockIdea);
router.get('/:id/investors', protect, authorize('creator', 'investor', 'admin'), getIdeaInvestors);

module.exports = router;
