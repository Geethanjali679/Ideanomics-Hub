import DashboardPage from '../../components/layout/DashboardPage';
import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, MenuItem, Alert, Chip } from '@mui/material';
import { Send, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { useSnackbar } from 'notistack';

const CATEGORIES = ['Technology', 'AI', 'Healthcare', 'Agriculture', 'Education', 'Finance', 'Other'];

const InvestorSubmitIdea = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ title: '', shortDescription: '', fullDescription: '', category: '', tags: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.shortDescription.length > 300) { setError('Short description must be 300 characters or less'); return; }
    setLoading(true);
    try {
      await API.post('/ideas', form);
      enqueueSnackbar('Idea posted successfully!', { variant: 'success' });
      navigate('/investor/ideas');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post idea');
    } finally { setLoading(false); }
  };

  return (
    <DashboardPage>
        <Box sx={{ maxWidth: 780, mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={800} fontFamily='"Poppins", sans-serif' gutterBottom>Post an Idea</Typography>
            <Typography color="text.secondary">As an investor, you can also share your ideas on the platform</Typography>
          </Box>
          <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
            <strong>Investor Idea Posting:</strong> Your idea will be visible to all users. Other investors can unlock your full idea details using their free trial or premium access.
          </Alert>
          <Card>
            <CardContent sx={{ p: 4 }}>
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Idea Title" name="title" value={form.title} onChange={handleChange} required sx={{ mb: 3 }} placeholder="Give your idea a catchy title" />
                <TextField select fullWidth label="Category" name="category" value={form.category} onChange={handleChange} required sx={{ mb: 3 }}>
                  {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </TextField>
                <TextField fullWidth multiline rows={3} label="Short Description (max 300 chars)"
                  name="shortDescription" value={form.shortDescription} onChange={handleChange} required sx={{ mb: 3 }}
                  helperText={`${form.shortDescription.length}/300 — This preview is visible to all`}
                  inputProps={{ maxLength: 300 }} />
                <TextField fullWidth multiline rows={8} label="Full Description (locked content)"
                  name="fullDescription" value={form.fullDescription} onChange={handleChange} required sx={{ mb: 3 }}
                  placeholder="Detailed description visible only after unlock..." />
                <TextField fullWidth label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} sx={{ mb: 4 }} placeholder="e.g. startup, mobile, b2b" />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" onClick={() => navigate('/investor')} sx={{ flex: 1 }}>Cancel</Button>
                  <Button type="submit" variant="contained" startIcon={<Send />} disabled={loading} sx={{ flex: 2 }}>
                    {loading ? 'Posting...' : 'Post Idea'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </DashboardPage>
  );
};

export default InvestorSubmitIdea;
