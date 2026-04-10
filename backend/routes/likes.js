const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { toggleLike, getLikes } = require('../controllers/likes');

router.post('/:ideaId', protect, toggleLike);
router.get('/:ideaId', protect, getLikes);

module.exports = router;
