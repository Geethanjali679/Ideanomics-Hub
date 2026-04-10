import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, CircularProgress, Chip, Avatar } from '@mui/material';
import { Add, Lightbulb, Favorite, Comment, TrendingUp, ArrowForward, EmojiObjects } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardPage from '../../components/layout/DashboardPage';
import API from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const GlassStatCard = ({ title, value, icon, gradient, subtitle }) => (
  <Card sx={{
    background: 'transparent',
    position: 'relative', overflow: 'hidden',
    '&::before': {
      content: '""', position: 'absolute', inset: 0,
      background: gradient, opacity: 0.08, borderRadius: 'inherit',
    },
    border: '1px solid', borderColor: 'rgba(108,99,255,0.12)',
  }}>
    <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</Typography>
          <Typography variant="h3" fontWeight={800} sx={{ fontFamily: '"Poppins", sans-serif', lineHeight: 1.1, mb: 0.5 }}>{value}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
        <Box sx={{
          width: 50, height: 50, borderRadius: 2.5,
          background: gradient, opacity: 0.85,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 6px 18px rgba(108,99,255,0.25)`,
          flexShrink: 0,
        }}>
          {React.cloneElement(icon, { sx: { color: 'white', fontSize: 22 } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/ideas/my').then(({ data }) => setIdeas(data.ideas)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalLikes = ideas.reduce((s, i) => s + (i.likesCount || 0), 0);
  const totalComments = ideas.reduce((s, i) => s + (i.commentsCount || 0), 0);
  const totalViews = ideas.reduce((s, i) => s + (i.viewCount || 0), 0);

  return (
    <DashboardPage>
      {/* Welcome Header */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        mb: 3.5, flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Poppins", sans-serif', mb: 0.5 }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </Typography>
          <Typography color="text.secondary" variant="body2">Here's an overview of your creative journey</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/creator/submit')} sx={{ boxShadow: '0 4px 15px rgba(108,99,255,0.35)' }}>
          New Idea
        </Button>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {[
          { title: 'Total Ideas', value: ideas.length, icon: <EmojiObjects />, gradient: 'linear-gradient(135deg, #6C63FF, #8B84FF)', subtitle: 'Published' },
          { title: 'Total Likes', value: totalLikes, icon: <Favorite />, gradient: 'linear-gradient(135deg, #EC4899, #F472B6)', subtitle: 'Across all ideas' },
          { title: 'Comments', value: totalComments, icon: <Comment />, gradient: 'linear-gradient(135deg, #10B981, #34D399)', subtitle: 'Across all ideas' },
          { title: 'Total Views', value: totalViews, icon: <TrendingUp />, gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)', subtitle: 'Across all ideas' },
        ].map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.title}>
            <GlassStatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Ideas */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Poppins", sans-serif' }}>Recent Ideas</Typography>
            <Button size="small" variant="outlined" endIcon={<ArrowForward sx={{ fontSize: 14 }} />} onClick={() => navigate('/creator/ideas')}>
              View All
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress size={32} /></Box>
          ) : ideas.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Box sx={{
                width: 70, height: 70, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(0,212,170,0.08))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
              }}>
                <Lightbulb sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
              <Typography color="text.secondary" variant="body2" mb={2}>No ideas yet. Share your first idea!</Typography>
              <Button variant="contained" size="small" onClick={() => navigate('/creator/submit')}>Submit Idea</Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {ideas.slice(0, 5).map((idea) => (
                <Box key={idea._id} sx={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  p: 2, borderRadius: 2.5,
                  background: 'rgba(108,99,255,0.04)',
                  border: '1px solid rgba(108,99,255,0.08)',
                  flexWrap: 'wrap', gap: 1.5,
                  transition: 'all 0.15s',
                  '&:hover': { background: 'rgba(108,99,255,0.07)', borderColor: 'rgba(108,99,255,0.15)' },
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                    <Avatar sx={{ width: 36, height: 36, fontSize: '0.8rem', background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', flexShrink: 0 }}>
                      {idea.title?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ fontSize: '0.9rem' }}>{idea.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {idea.likesCount || 0} likes · {idea.commentsCount || 0} comments · {idea.viewCount || 0} views
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
                    <Chip label={idea.category} size="small" />
                    <Button size="small" variant="outlined" onClick={() => navigate(`/creator/ideas/${idea._id}/edit`)}>Edit</Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </DashboardPage>
  );
};

export default CreatorDashboard;
