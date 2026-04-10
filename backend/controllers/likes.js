const Like = require('../models/Like');
const Idea = require('../models/Idea');
const { createNotification } = require('./notifications');

exports.toggleLike = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;
    const existing = await Like.findOne({ ideaId, userId });

    if (existing) {
      await Like.deleteOne({ ideaId, userId });
      const count = await Like.countDocuments({ ideaId });
      return res.json({ success: true, liked: false, count });
    } else {
      await Like.create({ ideaId, userId });
      const count = await Like.countDocuments({ ideaId });

      // Notify the idea creator (not if they liked their own idea)
      const idea = await Idea.findById(ideaId).select('creator title');
      if (idea && idea.creator.toString() !== userId) {
        await createNotification(
          idea.creator,
          'like',
          'Someone liked your idea!',
          `${req.user.name} liked your idea "${idea.title}"`,
          `/ideas/${ideaId}`
        );
      }

      return res.json({ success: true, liked: true, count });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const count = await Like.countDocuments({ ideaId });
    let isLiked = false;
    if (req.user) {
      const existing = await Like.findOne({ ideaId, userId: req.user.id });
      isLiked = !!existing;
    }
    res.json({ success: true, count, isLiked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
