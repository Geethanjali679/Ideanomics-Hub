import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Chip, Button, Card, CardContent, TextField,
  CircularProgress, Divider, Avatar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  FavoriteBorder, Favorite, Comment, LockOpen, Lock, ArrowBack,
  Delete, Star, Send, Visibility, Edit
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from 'notistack';
import DashboardPage from '../../components/layout/DashboardPage';

const catColors = {
  Technology: '#6366F1', AI: '#8B5CF6', Healthcare: '#EC4899',
  Agriculture: '#10B981', Education: '#F59E0B', Finance: '#06B6D4', Other: '#6B7280'
};

const IdeaDetailPage = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [idea, setIdea] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [premiumDialog, setPremiumDialog] = useState(false);

  const fetchIdea = useCallback(async () => {
    try {
      const { data } = await API.get(`/ideas/${id}`);
      setIdea(data.idea);
      setIsUnlocked(data.isUnlocked);
      setIsOwner(data.isOwner || false);
      setIsLiked(data.isLiked);
      setLikesCount(data.idea.likesCount || 0);
    } catch {
      enqueueSnackbar('Idea not found', { variant: 'error' });
      navigate('/browse');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, enqueueSnackbar]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await API.get(`/comments/${id}`);
      setComments(data.comments);
    } catch {}
  }, [id]);

  useEffect(() => { fetchIdea(); fetchComments(); }, [fetchIdea, fetchComments]);

  const handleLike = async () => {
    try {
      const { data } = await API.post(`/likes/${id}`);
      setIsLiked(data.liked);
      setLikesCount(data.count);
    } catch { enqueueSnackbar('Failed to update like', { variant: 'error' }); }
  };

  const handleUnlock = async () => {
    setUnlocking(true);
    try {
      const { data } = await API.post(`/ideas/${id}/unlock`);
      if (data.success) {
        enqueueSnackbar(data.message, { variant: 'success' });
        if (refreshUser) await refreshUser();
        await fetchIdea();
      }
    } catch (err) {
      if (err.response?.data?.requiresPremium) {
        setPremiumDialog(true);
      } else {
        enqueueSnackbar(err.response?.data?.message || 'Failed to unlock', { variant: 'error' });
      }
    } finally {
      setUnlocking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const { data } = await API.post(`/comments/${id}`, { commentText });
      setComments([data.comment, ...comments]);
      setCommentText('');
    } catch { enqueueSnackbar('Failed to add comment', { variant: 'error' }); }
    finally { setSubmittingComment(false); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch { enqueueSnackbar('Failed to delete comment', { variant: 'error' }); }
  };

  const getEditPath = () => {
    if (!user || !isOwner) return null;
    if (user.role === 'creator') return `/creator/ideas/${id}/edit`;
    if (user.role === 'investor') return `/investor/ideas/${id}/edit`;
    return null;
  };

  if (loading) return (
    <DashboardPage>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box>
    </DashboardPage>
  );

  if (!idea) return null;

  const catColor = catColors[idea.category] || '#6B7280';
  const editPath = getEditPath();
  const showUnlockButton = user?.role === 'investor' && !isUnlocked && !isOwner;
  const showLockedPlaceholder = !isUnlocked && !isOwner && user?.role !== 'admin';

  return (
    <DashboardPage>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/browse')} variant="outlined" size="small">
          Back to Browse
        </Button>
        {editPath && (
          <Button startIcon={<Edit />} onClick={() => navigate(editPath)} variant="outlined" size="small" color="secondary">
            Edit Idea
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Chip label={idea.category} size="small" sx={{ bgcolor: catColor + '18', color: catColor, fontWeight: 700 }} />
                {isOwner && <Chip label="Your Idea" size="small" color="primary" />}
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Poppins", sans-serif', mb: 2, fontSize: { xs: '1.5rem', md: '1.9rem' }, lineHeight: 1.3 }}>
                {idea.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Avatar sx={{ width: 28, height: 28, fontSize: '0.72rem', fontWeight: 700 }}>
                  {idea.creator?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  By <strong>{idea.creator?.name}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">·</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(idea.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                  <Visibility sx={{ fontSize: 14 }} />
                  <Typography variant="caption">{idea.viewCount || 0} views</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
              <Button
                variant={isLiked ? 'contained' : 'outlined'} color={isLiked ? 'error' : 'inherit'}
                startIcon={isLiked ? <Favorite /> : <FavoriteBorder />}
                onClick={handleLike} size="small"
              >
                {likesCount}
              </Button>
              <Button variant="outlined" startIcon={<Comment />} size="small" color="inherit">
                {comments.length}
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: '"Poppins", sans-serif' }}>Overview</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.9 }}>
            {idea.shortDescription}
          </Typography>

          {!showLockedPlaceholder ? (
            <>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: '"Poppins", sans-serif' }}>Full Details</Typography>
              <Box sx={{
                p: 3, borderRadius: 10, mb: 3,
                background: 'rgba(108,99,255,0.04)',
                border: '1px solid rgba(108,99,255,0.1)',
              }}>
                <Typography variant="body1" sx={{ lineHeight: 2, whiteSpace: 'pre-wrap' }}>
                  {idea.fullDescription}
                </Typography>
              </Box>
              {idea.tags?.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {idea.tags.map(tag => <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />)}
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ p: 4, borderRadius: 2, textAlign: 'center', border: '2px dashed', borderColor: 'divider', background: 'rgba(108,99,255,0.03)' }}>
              <Lock sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: '"Poppins", sans-serif' }}>Full Details Locked</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                {user?.role === 'investor'
                  ? 'Unlock this idea to see the complete details, implementation plan, and business model.'
                  : 'Only investors can unlock idea details.'}
              </Typography>
              {showUnlockButton && (
                <Button variant="contained" startIcon={<LockOpen />} onClick={handleUnlock} disabled={unlocking} size="large">
                  {unlocking ? 'Unlocking...' : 'Unlock This Idea'}
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: '"Poppins", sans-serif' }}>
            Comments ({comments.length})
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box component="form" onSubmit={handleComment} sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'flex-start' }}>
            <Avatar sx={{ fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, width: 32, height: 32 }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <TextField fullWidth multiline rows={2} size="small" placeholder="Share your thoughts..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
            <Button variant="contained" type="submit" disabled={submittingComment || !commentText.trim()} sx={{ minWidth: 44, px: 1.5, flexShrink: 0 }}>
              <Send fontSize="small" />
            </Button>
          </Box>
          {comments.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4} variant="body2">No comments yet. Be the first!</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {comments.map((comment) => (
                <Box key={comment._id} sx={{ display: 'flex', gap: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                    {comment.userId?.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, p: 2, borderRadius: 10, background: 'rgba(108,99,255,0.04)', border: '1px solid rgba(108,99,255,0.08)', minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>{comment.userId?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </Typography>
                      </Box>
                      {(user?.role === 'admin' || user?._id === comment.userId?._id) && (
                        <IconButton size="small" color="error" onClick={() => handleDeleteComment(comment._id)} sx={{ flexShrink: 0 }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.7 }}>{comment.commentText}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog open={premiumDialog} onClose={() => setPremiumDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}>Upgrade to Premium</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Star sx={{ fontSize: 56, color: '#F59E0B', mb: 2 }} />
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: '"Poppins", sans-serif' }}>Free trial used</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Get Premium for ₹500 and unlock unlimited ideas instantly.</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setPremiumDialog(false)} variant="outlined">Later</Button>
          <Button variant="contained" onClick={() => { setPremiumDialog(false); navigate('/investor/payment'); }}>
            Get Premium — ₹500
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardPage>
  );
};

export default IdeaDetailPage;
