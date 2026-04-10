import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, Typography, Box, Chip, Button,
  IconButton, Avatar
} from '@mui/material';
import { FavoriteBorder, Favorite, Comment, LockOpen, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../utils/api';
import { useSnackbar } from 'notistack';

const catColors = {
  Technology: '#6366F1', AI: '#8B5CF6', Healthcare: '#EC4899',
  Agriculture: '#10B981', Education: '#F59E0B', Finance: '#06B6D4', Other: '#6B7280'
};

const IdeaCard = ({ idea, onLikeUpdate }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [liked, setLiked] = useState(idea.isLiked || false);
  const [likesCount, setLikesCount] = useState(idea.likesCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    setLikeLoading(true);
    try {
      const { data } = await API.post(`/likes/${idea._id}`);
      setLiked(data.liked);
      setLikesCount(data.count);
      if (onLikeUpdate) onLikeUpdate(idea._id, data);
    } catch { enqueueSnackbar('Failed to update like', { variant: 'error' }); }
    finally { setLikeLoading(false); }
  };

  const catColor = catColors[idea.category] || '#6B7280';
  const creatorName = idea.creator?.name || 'Unknown';
  const initials = creatorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const isOwner = user && idea.creator?._id && (
    idea.creator._id === user._id || idea.creator._id === user.id
  );

  return (
    <Card
      sx={{
        height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer',
        borderRadius: 3,
        '&:hover': { transform: 'translateY(-3px)' },
      }}
      onClick={() => navigate(`/ideas/${idea._id}`)}
    >
      <CardContent sx={{ flex: 1, p: 2.5, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Chip
            label={idea.category} size="small"
            sx={{ bgcolor: catColor + '18', color: catColor, fontWeight: 700, fontSize: '0.7rem', height: 22, borderRadius: 1 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: 'text.secondary' }}>
            <Visibility sx={{ fontSize: 13 }} />
            <Typography variant="caption" fontSize="0.7rem" fontWeight={600}>{idea.viewCount || 0}</Typography>
          </Box>
        </Box>

        <Typography
          variant="subtitle1" fontWeight={800}
          sx={{
            mb: 1, lineHeight: 1.35, fontFamily: '"Poppins", sans-serif',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            fontSize: '0.93rem',
          }}
        >
          {idea.title}
        </Typography>

        <Typography
          variant="body2" color="text.secondary"
          sx={{
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', mb: 2, fontSize: '0.81rem', lineHeight: 1.65,
            fontFamily: '"Nunito", sans-serif',
          }}
        >
          {idea.shortDescription}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 22, height: 22, bgcolor: catColor + '80', fontSize: '0.62rem', fontWeight: 700 }}>
            {initials}
          </Avatar>
          <Typography variant="caption" color="text.secondary" fontWeight={600} noWrap>
            {creatorName}
          </Typography>
          {isOwner && (
            <Chip label="You" size="small" color="primary" sx={{ fontSize: '0.6rem', height: 16, px: 0.2, borderRadius: 1 }} />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2, pt: 0, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <IconButton
              size="small" onClick={handleLike} disabled={likeLoading}
              sx={{ color: liked ? 'error.main' : 'text.secondary', p: 0.4 }}
            >
              {liked ? <Favorite sx={{ fontSize: 15 }} /> : <FavoriteBorder sx={{ fontSize: 15 }} />}
            </IconButton>
            <Typography variant="caption" fontWeight={700} color="text.secondary">{likesCount}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: 'text.secondary' }}>
            <Comment sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={700}>{idea.commentsCount || 0}</Typography>
          </Box>
        </Box>

        <Button
          size="small" variant="outlined" color="primary"
          startIcon={<LockOpen sx={{ fontSize: '13px !important' }} />}
          onClick={(e) => { e.stopPropagation(); navigate(`/ideas/${idea._id}`); }}
          sx={{ fontSize: '0.72rem', py: 0.4, px: 1.2, minWidth: 0, borderRadius: 2 }}
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
};

export default IdeaCard;
