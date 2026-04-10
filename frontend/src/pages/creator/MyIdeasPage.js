import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Chip, Grid, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@mui/material';
import { Edit, Delete, Add, Lightbulb, People, Favorite, Comment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardPage from '../../components/layout/DashboardPage';
import API from '../../utils/api';
import { useSnackbar } from 'notistack';

const catColors = { Technology: '#6366F1', AI: '#8B5CF6', Healthcare: '#EC4899', Agriculture: '#10B981', Education: '#F59E0B', Finance: '#06B6D4', Other: '#6B7280' };

const MyIdeasPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [investorsDialog, setInvestorsDialog] = useState({ open: false, investors: [] });

  useEffect(() => {
    API.get('/ideas/my').then(({ data }) => setIdeas(data.ideas)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    try {
      await API.delete(`/ideas/${deleteId}`);
      setIdeas(ideas.filter(i => i._id !== deleteId));
      enqueueSnackbar('Idea deleted', { variant: 'success' });
    } catch { enqueueSnackbar('Failed to delete idea', { variant: 'error' }); }
    finally { setDeleteId(null); }
  };

  const handleViewInvestors = async (ideaId) => {
    try {
      const { data } = await API.get(`/ideas/${ideaId}/investors`);
      setInvestorsDialog({ open: true, investors: data.investors });
    } catch { enqueueSnackbar('Failed to load investors', { variant: 'error' }); }
  };

  return (
    <DashboardPage>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} fontFamily='"Poppins", sans-serif'>My Ideas</Typography>
          <Typography color="text.secondary" variant="body2">{ideas.length} idea{ideas.length !== 1 ? 's' : ''} submitted</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/creator/submit')}>Submit New Idea</Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : ideas.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Lightbulb sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">No ideas yet</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/creator/submit')}>Submit Your First Idea</Button>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {ideas.map((idea) => {
            const color = catColors[idea.category] || '#6B7280';
            return (
              <Grid item xs={12} md={6} key={idea._id}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip label={idea.category} size="small" sx={{ bgcolor: color + '18', color, fontWeight: 600, fontSize: '0.7rem' }} />
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Who unlocked this"><IconButton size="small" onClick={() => handleViewInvestors(idea._id)}><People fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/creator/ideas/${idea._id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(idea._id)}><Delete fontSize="small" /></IconButton></Tooltip>
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: '1rem' }}>{idea.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{idea.shortDescription}</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}><Favorite sx={{ fontSize: 15, color: '#EC4899' }} /><Typography variant="caption" fontWeight={600}>{idea.likesCount || 0}</Typography></Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}><Comment sx={{ fontSize: 15, color: '#10B981' }} /><Typography variant="caption" fontWeight={600}>{idea.commentsCount || 0}</Typography></Box>
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
        <DialogContent><DialogContentText>Are you sure you want to delete this idea? This action cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={investorsDialog.open} onClose={() => setInvestorsDialog({ open: false, investors: [] })} maxWidth="sm" fullWidth>
        <DialogTitle>Users Who Unlocked This Idea</DialogTitle>
        <DialogContent>
          {investorsDialog.investors.length === 0 ? (
            <Typography color="text.secondary" py={2} textAlign="center">No one has unlocked this idea yet</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              {investorsDialog.investors.map((inv) => (
                <Box key={inv._id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>{inv.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{inv.email} · {inv.role}</Typography>
                  </Box>
                  {inv.isPremium && <Chip label="Premium" size="small" color="warning" />}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setInvestorsDialog({ open: false, investors: [] })}>Close</Button></DialogActions>
      </Dialog>
    </DashboardPage>
  );
};

export default MyIdeasPage;
