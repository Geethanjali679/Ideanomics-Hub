const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addComment, getComments, deleteComment } = require('../controllers/comments');

router.post('/:ideaId', protect, addComment);
router.get('/:ideaId', protect, getComments);
router.delete('/:commentId', protect, deleteComment);

module.exports = router;
