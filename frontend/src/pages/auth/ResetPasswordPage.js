import React, { useState } from 'react';
import { Box, Container, Card, CardContent, Typography, TextField, Button, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../utils/api';
import Navbar from '../../components/layout/Navbar';
import { useSnackbar } from 'notistack';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      await API.put(`/auth/reset-password/${token}`, { password: form.password });
      enqueueSnackbar('Password reset successfully! Please login.', { variant: 'success' });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: 3, mx: 'auto', mb: 2, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h4" fontWeight={800} fontFamily='"Poppins", sans-serif'>Set New Password</Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>Choose a strong new password</Typography>
        </Box>
        <Card>
          <CardContent sx={{ p: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="New Password" type={showPass ? 'text' : 'password'}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                required sx={{ mb: 2.5 }}
                InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)}>{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
              <TextField fullWidth label="Confirm Password" type="password"
                value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required sx={{ mb: 3 }} />
              <Button fullWidth variant="contained" size="large" type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ResetPasswordPage;
