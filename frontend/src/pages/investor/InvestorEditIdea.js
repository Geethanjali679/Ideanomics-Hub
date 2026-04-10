import DashboardPage from '../../components/layout/DashboardPage';
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, MenuItem, Alert, CircularProgress } from '@mui/material';
import { Save } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../utils/api';
import { useSnackbar } from 'notistack';

const CATEGORIES = ['Technology', 'AI', 'Healthcare', 'Agriculture', 'Education', 'Finance', 'Other'];

const InvestorEditIdea = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ title: '', shortDescription: '', fullDescription: '', category: '', tags: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/ideas/${id}`).then(({ data }) => {
      const { title, shortDescription, fullDescription, category, tags } = data.idea;
      setForm({ title, shortDescription, fullDescription: fullDescription || '', category, tags: tags?.join(', ') || '' });
    }).catch(() => navigate('/investor/ideas')).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await API.put(`/ideas/${id}`, { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
      enqueueSnackbar('Idea updated!', { variant: 'success' });
      navigate('/investor/ideas');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <DashboardPage><Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box></DashboardPage>
  );

  return (
    <DashboardPage>
        <Box sx={{ maxWidth: 780, mx: 'auto' }}>
          <Typography variant="h4" fontWeight={800} fontFamily='"Poppins", sans-serif' gutterBottom>Edit Idea</Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>Update your idea details</Typography>
          <Card>
            <CardContent sx={{ p: 4 }}>
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Idea Title" name="title" value={form.title} onChange={handleChange} required sx={{ mb: 3 }} />
                <TextField select fullWidth label="Category" name="category" value={form.category} onChange={handleChange} required sx={{ mb: 3 }}>
                  {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </TextField>
                <TextField fullWidth multiline rows={3} label="Short Description" name="shortDescription" value={form.shortDescription} onChange={handleChange} required sx={{ mb: 3 }} helperText={`${form.shortDescription.length}/300`} inputProps={{ maxLength: 300 }} />
                <TextField fullWidth multiline rows={8} label="Full Description" name="fullDescription" value={form.fullDescription} onChange={handleChange} required sx={{ mb: 3 }} />
                <TextField fullWidth label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} sx={{ mb: 4 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" onClick={() => navigate('/investor/ideas')} sx={{ flex: 1 }}>Cancel</Button>
                  <Button type="submit" variant="contained" startIcon={<Save />} disabled={saving} sx={{ flex: 2 }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </DashboardPage>
  );
};

export default InvestorEditIdea;
