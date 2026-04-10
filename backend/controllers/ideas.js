const Idea = require('../models/Idea');
const User = require('../models/User');
const Like = require('../models/Like');
const Comment = require('../models/Comment');

// Any logged-in user (creator, investor, admin) can create ideas
exports.createIdea = async (req, res) => {
  try {
    const { title, shortDescription, fullDescription, category, tags } = req.body;
    if (!title || !shortDescription || !fullDescription || !category) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }
    const idea = await Idea.create({
      title,
      shortDescription,
      fullDescription,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      creator: req.user.id
    });
    res.status(201).json({ success: true, idea });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getIdeas = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Idea.countDocuments(query);
    const ideas = await Idea.find(query)
      .populate('creator', 'name avatar role')
      .populate('likesCount')
      .populate('commentsCount')
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    let ideasWithStatus = ideas;
    if (req.user) {
      const ideaIds = ideas.map(i => i._id);
      const userLikes = await Like.find({ userId: req.user.id, ideaId: { $in: ideaIds } });
      const likedSet = new Set(userLikes.map(l => l.ideaId.toString()));
      const currentUser = await User.findById(req.user.id).select('unlockedIdeas');
      const unlockedSet = new Set((currentUser?.unlockedIdeas || []).map(id => id.toString()));

      ideasWithStatus = ideas.map(idea => {
        const obj = idea.toObject();
        obj.isLiked = likedSet.has(idea._id.toString());
        // Determine unlock status for display
        const isOwner = idea.creator._id.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        obj.isUnlocked = isAdmin || isOwner || unlockedSet.has(idea._id.toString());
        return obj;
      });
    }

    res.json({
      success: true,
      ideas: ideasWithStatus,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('creator', 'name avatar bio role')
      .populate('likesCount')
      .populate('commentsCount');

    if (!idea || !idea.isActive) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }

    let isUnlocked = false;
    let isLiked = false;
    let isOwner = false;

    if (req.user) {
      const user = await User.findById(req.user.id);
      isOwner = idea.creator._id.toString() === req.user.id;

      if (req.user.role === 'admin') {
        isUnlocked = true;
      } else if (isOwner) {
        isUnlocked = true;
      } else {
        isUnlocked = user.unlockedIdeas.some(id => id.toString() === idea._id.toString());
      }

      const likeDoc = await Like.findOne({ ideaId: idea._id, userId: req.user.id });
      isLiked = !!likeDoc;

      // Unique view count: only increment if this user hasn't viewed before
      const alreadyViewed = idea.viewedBy.some(uid => uid.toString() === req.user.id);
      if (!alreadyViewed) {
        await Idea.findByIdAndUpdate(req.params.id, {
          $inc: { viewCount: 1 },
          $addToSet: { viewedBy: req.user.id }
        });
        idea.viewCount = (idea.viewCount || 0) + 1;
      }
    }

    const ideaObj = idea.toObject();
    if (!isUnlocked) {
      delete ideaObj.fullDescription;
    }

    res.json({ success: true, idea: ideaObj, isUnlocked, isLiked, isOwner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.unlockIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const user = await User.findById(req.user.id);
    const idea = await Idea.findById(ideaId).populate('creator', 'name');

    if (!idea || !idea.isActive) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }

    // Owner can always see their own idea
    if (idea.creator._id.toString() === req.user.id) {
      return res.json({ success: true, message: 'This is your idea', isOwner: true });
    }

    // Already unlocked
    if (user.unlockedIdeas.some(id => id.toString() === ideaId)) {
      return res.json({ success: true, message: 'Already unlocked' });
    }

    // Check access tiers
    if (!user.freeTrialUsed) {
      user.freeTrialUsed = true;
      user.freeTrialIdeaId = ideaId;
      user.unlockedIdeas.push(ideaId);
      await user.save();
      await Idea.findByIdAndUpdate(ideaId, { $inc: { unlockCount: 1 } });
      return res.json({ success: true, message: 'Free trial used! Idea unlocked.', usedFreeTrial: true });
    } else if (user.isPremium) {
      user.unlockedIdeas.push(ideaId);
      await user.save();
      await Idea.findByIdAndUpdate(ideaId, { $inc: { unlockCount: 1 } });
      return res.json({ success: true, message: 'Idea unlocked with premium access.' });
    } else {
      return res.status(403).json({ success: false, message: 'Premium access required', requiresPremium: true });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });
    if (idea.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { title, shortDescription, fullDescription, category, tags } = req.body;
    const updateData = { title, shortDescription, fullDescription, category };
    if (tags !== undefined) {
      updateData.tags = typeof tags === 'string'
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : tags;
    }
    const updated = await Idea.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, idea: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });
    if (idea.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Idea.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Idea deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ creator: req.user.id, isActive: true })
      .populate('likesCount')
      .populate('commentsCount')
      .sort({ createdAt: -1 });
    res.json({ success: true, ideas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getIdeaInvestors = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });
    if (idea.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const unlockers = await User.find({
      unlockedIdeas: req.params.id
    }).select('name email createdAt isPremium role');
    res.json({ success: true, investors: unlockers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
