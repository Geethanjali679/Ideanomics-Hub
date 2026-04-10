import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Alert,
  Link as MuiLink, InputAdornment, IconButton, CircularProgress, Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, EmojiObjects, TrendingUp, Groups } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from 'notistack';

const LogoMark = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="llg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6C63FF"/><stop offset="1" stopColor="#00D4AA"/>
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="10" fill="url(#llg)"/>
    <path d="M20 9C14.477 9 10 13.477 10 19c0 3.4 1.65 6.42 4.2 8.3V30a1 1 0 001 1h9.6a1 1 0 001-1v-2.7C28.35 25.42 30 22.4 30 19c0-5.523-4.477-10-10-10z" fill="white" fillOpacity="0.95"/>
    <rect x="15.5" y="32" width="9" height="1.5" rx="0.75" fill="white" fillOpacity="0.75"/>
  </svg>
);

const Feature = ({ icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
    <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {React.cloneElement(icon, { sx: { color: 'white', fontSize: 18 } })}
    </Box>
    <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontFamily: '"Nunito", sans-serif', fontSize: '0.9rem', fontWeight: 600 }}>{text}</Typography>
  </Box>
);

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      enqueueSnackbar(`Welcome back, ${data.user.name}!`, { variant: 'success' });
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'creator') navigate('/creator');
      else navigate('/investor');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #F0F2FF 0%, #E8ECFF 50%, #EDE9FE 100%)',
    }}>
      {/* Left panel — branding */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: '0 0 42%', maxWidth: '42%',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
        p: 6,
        background: 'linear-gradient(155deg, #6C63FF 0%, #4B44CC 50%, #00D4AA 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative blobs */}
        <Box sx={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -80, right: -80, pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: 40, left: -60, pointerEvents: 'none' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
          <LogoMark size={42} />
          <Box>
            <Typography sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 800, fontSize: '1.15rem', color: 'white', lineHeight: 1 }}>Ideanomics</Typography>
            <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>Hub</Typography>
          </Box>
        </Box>

        <Typography sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: '2rem', color: 'white', lineHeight: 1.25, mb: 2 }}>
          Where Ideas Meet Investment
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.75)', mb: 4, lineHeight: 1.7, fontFamily: '"Nunito", sans-serif', fontSize: '0.95rem' }}>
          Join thousands of creators and investors building the next generation of ideas.
        </Typography>

        <Feature icon={<EmojiObjects />} text="Submit and showcase your innovative ideas" />
        <Feature icon={<TrendingUp />} text="Connect with serious investors instantly" />
        <Feature icon={<Groups />} text="A thriving community of 1000+ members" />
      </Box>

      {/* Right panel — form */}
      <Box sx={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: { xs: 2, sm: 4 },
      }}>
        <Box sx={{
          width: '100%', maxWidth: 420,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.9)',
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(108,99,255,0.1)',
          p: { xs: 3, sm: 4 },
        }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 3 }}>
            <LogoMark size={34} />
            <Typography sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ideanomics Hub</Typography>
          </Box>

          <Typography variant="h5" fontWeight={700} sx={{ fontFamily: '"Poppins", sans-serif', mb: 0.5 }}>Welcome back</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Sign in to your account to continue</Typography>

          {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.85rem' }} onClose={() => setError('')}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email Address" name="email" type="email"
              value={form.email} onChange={handleChange} required sx={{ mb: 2 }} size="medium"
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Password" name="password"
              type={showPass ? 'text' : 'password'}
              value={form.password} onChange={handleChange} required sx={{ mb: 1.5 }} size="medium"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                      {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <MuiLink component={Link} to="/forgot-password" variant="caption" sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none' }}>
                Forgot password?
              </MuiLink>
            </Box>
            <Button fullWidth variant="contained" size="large" type="submit" disabled={loading} sx={{ height: 48 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3, '&::before,&::after': { borderColor: 'rgba(108,99,255,0.12)' } }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>OR</Typography>
          </Divider>

          <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 2.5 }}>
            Don't have an account?{' '}
            <MuiLink component={Link} to="/register" sx={{ color: 'primary.main', fontWeight: 800, textDecoration: 'none' }}>Create one</MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
