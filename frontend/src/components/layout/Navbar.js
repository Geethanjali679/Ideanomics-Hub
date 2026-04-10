import React, { useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography, Button, IconButton,
  useTheme, useMediaQuery, Drawer, List, ListItem, ListItemText, ListItemButton
} from '@mui/material';
import { Menu as MenuIcon, Close, LightMode, DarkMode } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../contexts/ThemeContext';

const LogoMark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="navbarLG" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6C63FF"/><stop offset="1" stopColor="#00D4AA"/>
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="10" fill="url(#navbarLG)"/>
    <path d="M20 9C14.477 9 10 13.477 10 19c0 3.4 1.65 6.42 4.2 8.3V30a1 1 0 001 1h9.6a1 1 0 001-1v-2.7C28.35 25.42 30 22.4 30 19c0-5.523-4.477-10-10-10z" fill="white" fillOpacity="0.95"/>
    <rect x="15.5" y="32" width="9" height="1.5" rx="0.75" fill="white" fillOpacity="0.75"/>
  </svg>
);

const Navbar = () => {
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const gradientText = {
    background: 'linear-gradient(135deg, #6C63FF, #00D4AA)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  };

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, sm: 4 }, minHeight: '64px !important' }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.2, textDecoration: 'none', flexGrow: 1 }}>
            <LogoMark size={30} />
            <Typography sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 800, fontSize: '1rem', ...gradientText }}>
              Ideanomics Hub
            </Typography>
          </Box>
          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
                {mode === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
              </IconButton>
              <Button component={Link} to="/login" variant="outlined" size="small">Sign In</Button>
              <Button component={Link} to="/register" variant="contained" size="small">Get Started</Button>
            </Box>
          ) : (
            <IconButton onClick={() => setMobileOpen(true)}><MenuIcon /></IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 260 } }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography fontWeight={700}>Menu</Typography>
          <IconButton onClick={() => setMobileOpen(false)}><Close /></IconButton>
        </Box>
        <List>
          <ListItem disablePadding><ListItemButton onClick={() => { navigate('/login'); setMobileOpen(false); }}><ListItemText primary="Sign In" /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton onClick={() => { navigate('/register'); setMobileOpen(false); }}><ListItemText primary="Get Started" /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton onClick={toggleTheme}><ListItemText primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'} /></ListItemButton></ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
