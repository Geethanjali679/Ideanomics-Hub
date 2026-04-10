const Comment = require('../models/Comment');
const Idea = require('../models/Idea');
const { createNotification } = require('./notifications');

exports.addComment = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { commentText } = req.body;
    if (!commentText || !commentText.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }
    const comment = await Comment.create({
      ideaId,
      userId: req.user.id,
      commentText: commentText.trim(),
    });
    const populated = await Comment.findById(comment._id).populate('userId', 'name avatar role');

    // Notify idea creator (not if they commented on their own idea)
    const idea = await Idea.findById(ideaId).select('creator title');
    if (idea && idea.creator.toString() !== req.user.id) {
      await createNotification(
        idea.creator,
        'comment',
        'New comment on your idea',
        `${req.user.name} commented on "${idea.title}": "${commentText.trim().slice(0, 60)}${commentText.trim().length > 60 ? '...' : ''}"`,
        `/ideas/${ideaId}`
      );
    }

    res.status(201).json({ success: true, comment: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const comments = await Comment.find({ ideaId, isDeleted: false })
      .populate('userId', 'name avatar role')
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (req.user.role !== 'admin' && comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    comment.isDeleted = true;
    await comment.save();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
