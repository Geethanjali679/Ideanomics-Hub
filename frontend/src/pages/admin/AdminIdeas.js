import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip,
  CircularProgress, Pagination, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Avatar
} from '@mui/material';
import { Search, Delete, Visibility, WarningAmber } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardPage from '../../components/layout/DashboardPage';
import API from '../../utils/api';
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2';

const categoryColors = {
  Technology: '#6366F1', AI: '#8B5CF6', Healthcare: '#EC4899',
  Agriculture: '#10B981', Education: '#F59E0B', Finance: '#06B6D4', Other: '#6B7280'
};

const AdminIdeas = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / 15);

  // Warn dialog
  const [warnDialog, setWarnDialog] = useState({ open: false, ideaId: null, creatorId: null, ideaTitle: '', creatorName: '' });
  const [warnReason, setWarnReason] = useState('');
  const [warnLoading, setWarnLoading] = useState(false);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      const { data } = await API.get('/admin/ideas', { params });
      setIdeas(data.ideas || []);
      setTotal(data.total || 0);
    } catch {}
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);
  useEffect(() => { setPage(1); }, [search]);

  const handleDelete = async (ideaId, title) => {
    const result = await Swal.fire({
      title: 'Delete Idea?',
      text: `"${title}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6C63FF',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      borderRadius: '12px',
    });
    if (!result.isConfirmed) return;
    try {
      await API.delete(`/ideas/${ideaId}`);
      enqueueSnackbar('Idea deleted', { variant: 'success' });
      fetchIdeas();
    } catch { enqueueSnackbar('Failed to delete', { variant: 'error' }); }
  };

  const openWarnDialog = (idea) => {
    setWarnDialog({
      open: true,
      ideaId: idea._id,
      creatorId: idea.creator?._id,
      ideaTitle: idea.title,
      creatorName: idea.creator?.name || 'Unknown',
    });
    setWarnReason('');
  };

  const handleWarnCreator = async () => {
    if (!warnReason.trim()) return;
    setWarnLoading(true);
    try {
      const { data } = await API.post(`/admin/users/${warnDialog.creatorId}/warn`, {
        reason: `Regarding idea "${warnDialog.ideaTitle}": ${warnReason}`,
      });
      enqueueSnackbar(data.message, { variant: 'success' });
      setWarnDialog({ open: false, ideaId: null, creatorId: null, ideaTitle: '', creatorName: '' });
      setWarnReason('');
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to issue warning', { variant: 'error' });
    } finally {
      setWarnLoading(false);
    }
  };

  return (
    <DashboardPage>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Poppins", sans-serif', mb: 0.5 }}>
          Idea Management
        </Typography>
        <Typography color="text.secondary" variant="body2">{total} ideas on the platform</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              placeholder="Search ideas..." size="small" value={search}
              onChange={(e) => setSearch(e.target.value)} sx={{ width: 280 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : ideas.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">No ideas found</Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Creator</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ideas.map((idea) => {
                      const color = categoryColors[idea.category] || '#6B7280';
                      return (
                        <TableRow key={idea._id} hover>
                          <TableCell sx={{ maxWidth: 240 }}>
                            <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ fontSize: '0.85rem' }}>{idea.title}</Typography>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 220 }}>{idea.shortDescription}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 26, height: 26, fontSize: '0.65rem', fontWeight: 700 }}>
                                {idea.creator?.name?.[0]?.toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.83rem' }}>{idea.creator?.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{idea.creator?.email}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={idea.category} size="small" sx={{ bgcolor: color + '18', color, fontWeight: 700 }} />
                          </TableCell>
                          <TableCell>
                            <Chip label={idea.isActive ? 'Active' : 'Deleted'} size="small" color={idea.isActive ? 'success' : 'error'} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {new Date(idea.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                              <Tooltip title="View idea">
                                <IconButton size="small" onClick={() => navigate(`/ideas/${idea._id}`)} color="primary">
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {idea.creator?._id && (
                                <Tooltip title="Warn creator">
                                  <IconButton size="small" color="warning" onClick={() => openWarnDialog(idea)}>
                                    <WarningAmber fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Delete idea">
                                <IconButton size="small" color="error" onClick={() => handleDelete(idea._id, idea.title)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" size="small" />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Warn Creator Dialog */}
      <Dialog open={warnDialog.open} onClose={() => setWarnDialog({ ...warnDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}>
          Warn Creator
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, p: 2, borderRadius: 2, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Issuing warning to <strong>{warnDialog.creatorName}</strong> regarding:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>"{warnDialog.ideaTitle}"</Typography>
          </Box>
          <TextField
            fullWidth multiline rows={3} label="Warning Reason" placeholder="Describe the violation or issue..."
            value={warnReason} onChange={(e) => setWarnReason(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Note: 3 warnings result in automatic account suspension.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setWarnDialog({ ...warnDialog, open: false })} variant="outlined">Cancel</Button>
          <Button
            variant="contained" color="warning"
            onClick={handleWarnCreator}
            disabled={!warnReason.trim() || warnLoading}
            startIcon={<WarningAmber />}
          >
            {warnLoading ? 'Issuing...' : 'Issue Warning'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardPage>
  );
};

export default AdminIdeas;
