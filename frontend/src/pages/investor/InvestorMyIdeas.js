import DashboardPage from '../../components/layout/DashboardPage';
import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Grid,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, CircularProgress
} from '@mui/material';
import { Edit, Delete, Add, Lightbulb, Favorite, Comment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { useSnackbar } from 'notistack';

const catColors = { Technology: '#6366F1', AI: '#8B5CF6', Healthcare: '#EC4899', Agriculture: '#10B981', Education: '#F59E0B', Finance: '#06B6D4', Other: '#6B7280' };

const InvestorMyIdeas = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    API.get('/ideas/my').then(({ data }) => setIdeas(data.ideas)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    try {
      await API.delete(`/ideas/${deleteId}`);
      setIdeas(ideas.filter(i => i._id !== deleteId));
      enqueueSnackbar('Idea deleted', { variant: 'success' });
    } catch { enqueueSnackbar('Failed to delete', { variant: 'error' }); }
    finally { setDeleteId(null); }
  };

  return (
    <DashboardPage>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} fontFamily='"Poppins", sans-serif'>My Posted Ideas</Typography>
            <Typography color="text.secondary">{ideas.length} idea{ideas.length !== 1 ? 's' : ''} posted</Typography>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/investor/submit')}>Post New Idea</Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : ideas.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Lightbulb sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No ideas posted yet</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/investor/submit')}>Post Your First Idea</Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {ideas.map((idea) => {
              const color = catColors[idea.category] || '#6B7280';
              return (
                <Grid item xs={12} md={6} key={idea._id}>
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Chip label={idea.category} size="small" sx={{ bgcolor: color + '20', color, fontWeight: 600 }} />
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => navigate(`/investor/ideas/${idea._id}/edit`)}><Edit fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => setDeleteId(idea._id)}><Delete fontSize="small" /></IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Typography variant="h6" fontWeight={700} gutterBottom>{idea.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{idea.shortDescription}</Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Favorite sx={{ fontSize: 16, color: '#EC4899' }} />
                          <Typography variant="caption" fontWeight={600}>{idea.likesCount || 0}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Comment sx={{ fontSize: 16, color: '#10B981' }} />
                          <Typography variant="caption" fontWeight={600}>{idea.commentsCount || 0}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">{new Date(idea.createdAt).toLocaleDateString('en-IN')}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
          <DialogTitle>Delete Idea</DialogTitle>
          <DialogContent><DialogContentText>Are you sure you want to delete this idea?</DialogContentText></DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </DashboardPage>
  );
};

export default InvestorMyIdeas;
