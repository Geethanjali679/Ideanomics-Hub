import React, { useState } from 'react';
import { Box, Container, Card, CardContent, Typography, TextField, Button, Alert, Link as MuiLink } from '@mui/material';
import { Email, Lightbulb } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import Navbar from '../../components/layout/Navbar';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
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
            <Email sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h4" fontWeight={800} fontFamily='"Poppins", sans-serif'>Forgot Password</Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>Enter your email to receive a reset link</Typography>
        </Box>
        <Card>
          <CardContent sx={{ p: 4 }}>
            {success ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                Password reset link sent! Check your email inbox. The link expires in 15 minutes.
              </Alert>
            ) : (
              <>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                  <TextField fullWidth label="Email Address" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 3 }} />
                  <Button fullWidth variant="contained" size="large" type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              </>
            )}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <MuiLink component={Link} to="/login" variant="body2" color="primary">Back to Login</MuiLink>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
