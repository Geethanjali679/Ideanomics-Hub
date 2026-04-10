import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, MenuItem, Alert } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardPage from '../../components/layout/DashboardPage';
import API from '../../utils/api';
import { useSnackbar } from 'notistack';

const CATEGORIES = ['Technology', 'AI', 'Healthcare', 'Agriculture', 'Education', 'Finance', 'Other'];

const SubmitIdeaPage = () => {
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
      enqueueSnackbar('Idea submitted successfully!', { variant: 'success' });
      navigate('/creator/ideas');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit idea');
    } finally { setLoading(false); }
  };

  return (
    <DashboardPage>
      <Box sx={{ maxWidth: 760, mx: 'auto' }}>
        <Typography variant="h4" fontWeight={800} fontFamily='"Poppins", sans-serif' gutterBottom>Submit New Idea</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Share your innovative idea with investors on the platform</Typography>
        <Card>
          <CardContent sx={{ p: 3.5 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Idea Title" name="title" value={form.title} onChange={handleChange} required sx={{ mb: 2.5 }} />
              <TextField select fullWidth label="Category" name="category" value={form.category} onChange={handleChange} required sx={{ mb: 2.5 }}>
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField fullWidth multiline rows={3} label="Short Description (max 300 chars)"
                name="shortDescription" value={form.shortDescription} onChange={handleChange} required sx={{ mb: 2.5 }}
                helperText={`${form.shortDescription.length}/300 — This is the preview investors see before unlocking`}
                inputProps={{ maxLength: 300 }} />
              <TextField fullWidth multiline rows={7} label="Full Description (locked content)"
                name="fullDescription" value={form.fullDescription} onChange={handleChange} required sx={{ mb: 2.5 }}
                placeholder="Describe your idea in full detail — problem, solution, business model, market, implementation..."
                helperText="Only visible to investors after they unlock your idea" />
              <TextField fullWidth label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} sx={{ mb: 3.5 }} placeholder="e.g. startup, saas, mobile, b2b" />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/creator/ideas')} sx={{ flex: 1 }}>Cancel</Button>
                <Button type="submit" variant="contained" startIcon={<Send />} disabled={loading} sx={{ flex: 2 }}>
                  {loading ? 'Submitting...' : 'Submit Idea'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </DashboardPage>
  );
};

export default SubmitIdeaPage;
