import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Alert,
  Link as MuiLink, InputAdornment, IconButton, CircularProgress, Divider,
  ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, EmojiObjects, BusinessCenter, Star, LockOpen, Lightbulb } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from 'notistack';

const LogoMark = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="rlg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#6C63FF"/><stop offset="1" stopColor="#00D4AA"/></linearGradient></defs>
    <rect width="40" height="40" rx="10" fill="url(#rlg)"/>
    <path d="M20 9C14.477 9 10 13.477 10 19c0 3.4 1.65 6.42 4.2 8.3V30a1 1 0 001 1h9.6a1 1 0 001-1v-2.7C28.35 25.42 30 22.4 30 19c0-5.523-4.477-10-10-10z" fill="white" fillOpacity="0.95"/>
    <rect x="15.5" y="32" width="9" height="1.5" rx="0.75" fill="white" fillOpacity="0.75"/>
  </svg>
);

const Perk = ({ icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
    <Box sx={{ width: 34, height: 34, borderRadius: 2, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {React.cloneElement(icon, { sx: { color: 'white', fontSize: 17 } })}
    </Box>
    <Typography sx={{ color: 'rgba(255,255,255,0.88)', fontFamily: '"Nunito", sans-serif', fontSize: '0.88rem', fontWeight: 600 }}>{text}</Typography>
  </Box>
);

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'creator' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.role);
      enqueueSnackbar(`Welcome to Ideanomics, ${data.user.name}!`, { variant: 'success' });
      if (data.user.role === 'creator') navigate('/creator');
      else navigate('/investor');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const creatorPerks = [
    { icon: <Lightbulb />, text: 'Submit unlimited ideas to the platform' },
    { icon: <EmojiObjects />, text: 'Get likes, comments and investor attention' },
    { icon: <Star />, text: 'Build your creator profile and reputation' },
  ];
  const investorPerks = [
    { icon: <LockOpen />, text: '1 free idea unlock to get started' },
    { icon: <BusinessCenter />, text: 'Premium access to all full ideas for ₹500' },
    { icon: <Star />, text: 'Post your own ideas to attract co-founders' },
  ];
  const perks = form.role === 'creator' ? creatorPerks : investorPerks;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #F0F2FF 0%, #E8ECFF 50%, #EDE9FE 100%)' }}>
      {/* Left panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: '0 0 42%', maxWidth: '42%',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
        p: 6, position: 'relative', overflow: 'hidden',
        background: form.role === 'creator'
          ? 'linear-gradient(155deg, #6C63FF 0%, #4B44CC 60%, #7C3AED 100%)'
          : 'linear-gradient(155deg, #00D4AA 0%, #009B7A 50%, #6C63FF 100%)',
        transition: 'background 0.5s ease',
      }}>
        <Box sx={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -80, right: -80, pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: 60, left: -50, pointerEvents: 'none' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
          <LogoMark size={40} />
          <Typography sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>Ideanomics Hub</Typography>
        </Box>

        <Typography sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: '1.8rem', color: 'white', lineHeight: 1.3, mb: 1.5 }}>
          {form.role === 'creator' ? 'Share your vision' : 'Discover opportunities'}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.75)', mb: 4, lineHeight: 1.7, fontFamily: '"Nunito", sans-serif', fontSize: '0.9rem' }}>
          {form.role === 'creator'
            ? 'As a creator, you bring ideas to life and connect with investors who believe in them.'
            : 'As an investor, you discover the best ideas and connect with the brightest creators.'}
        </Typography>

        {perks.map((p, i) => <Perk key={i} {...p} />)}
      </Box>

      {/* Right panel */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 4 } }}>
        <Box sx={{
          width: '100%', maxWidth: 430,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.9)',
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(108,99,255,0.1)',
          p: { xs: 3, sm: 4 },
        }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 3 }}>
            <LogoMark size={32} />
            <Typography sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 800, fontSize: '0.95rem', background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ideanomics Hub</Typography>
          </Box>

          <Typography variant="h5" fontWeight={700} sx={{ fontFamily: '"Poppins", sans-serif', mb: 0.5 }}>Create account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Join the Ideanomics community today</Typography>

          {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.85rem' }} onClose={() => setError('')}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Role selector */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>I am a</Typography>
              <ToggleButtonGroup
                value={form.role} exclusive fullWidth
                onChange={(e, v) => { if (v) setForm({ ...form, role: v }); }}
                sx={{
                  '& .MuiToggleButton-root': {
                    flex: 1, borderRadius: '8px !important',
                    border: '1px solid rgba(108,99,255,0.2) !important',
                    fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.84rem', py: 1.1, gap: 0.75,
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(0,212,170,0.06))',
                      color: 'primary.main',
                      borderColor: 'rgba(108,99,255,0.4) !important',
                    },
                  },
                }}
              >
                <ToggleButton value="creator"><EmojiObjects sx={{ fontSize: 17 }} /> Creator</ToggleButton>
                <ToggleButton value="investor"><BusinessCenter sx={{ fontSize: 17 }} /> Investor</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <TextField fullWidth label="Full Name" name="name" value={form.name} onChange={handleChange} required sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }} />
            <TextField fullWidth label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }} />
            <TextField fullWidth label="Password" name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} required sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">{showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>
              }} />

            <Button fullWidth variant="contained" size="large" type="submit" disabled={loading} sx={{ height: 48 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>

          <Divider sx={{ my: 3, '&::before,&::after': { borderColor: 'rgba(108,99,255,0.12)' } }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>OR</Typography>
          </Divider>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 800, textDecoration: 'none' }}>Sign in</MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
