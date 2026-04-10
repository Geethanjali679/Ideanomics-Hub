import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light' ? {
      primary: { main: '#6C63FF', light: '#9D97FF', dark: '#4B44CC', contrastText: '#fff' },
      secondary: { main: '#00D4AA', light: '#5EEAD4', dark: '#009B7A' },
      background: { default: '#F0F2FF', paper: 'rgba(255,255,255,0.82)' },
      text: { primary: '#1A1040', secondary: '#64748B' },
      success: { main: '#10B981' },
      warning: { main: '#F59E0B' },
      error: { main: '#EF4444' },
      divider: 'rgba(108,99,255,0.1)',
    } : {
      primary: { main: '#8B84FF', light: '#B0ABFF', dark: '#6C63FF', contrastText: '#fff' },
      secondary: { main: '#00D4AA', light: '#5EEAD4', dark: '#009B7A' },
      background: { default: '#0D0D1A', paper: 'rgba(255,255,255,0.05)' },
      text: { primary: '#F1F0FF', secondary: '#94A3B8' },
      success: { main: '#34D399' },
      warning: { main: '#FBBF24' },
      error: { main: '#F87171' },
      divider: 'rgba(139,132,255,0.1)',
    })
  },
  typography: {
    fontFamily: '"Nunito", sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    subtitle1: { fontFamily: '"Nunito", sans-serif', fontWeight: 700 },
    subtitle2: { fontFamily: '"Nunito", sans-serif', fontWeight: 700 },
    body1: { fontFamily: '"Nunito", sans-serif', fontWeight: 400 },
    body2: { fontFamily: '"Nunito", sans-serif', fontWeight: 400 },
    button: { fontFamily: '"Nunito", sans-serif', fontWeight: 700, textTransform: 'none', letterSpacing: 0.3 },
    caption: { fontFamily: '"Nunito", sans-serif', fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        html: { height: '100%' },
        body: {
          height: '100%', margin: 0,
          background: mode === 'light'
            ? 'linear-gradient(135deg, #F0F2FF 0%, #E8ECFF 50%, #EDE9FE 100%)'
            : 'linear-gradient(135deg, #0D0D1A 0%, #0F0A2E 60%, #0a1628 100%)',
          backgroundAttachment: 'fixed',
        },
        '#root': { height: '100%' },
        '::-webkit-scrollbar': { width: '5px' },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          background: mode === 'light' ? 'rgba(108,99,255,0.25)' : 'rgba(139,132,255,0.25)',
          borderRadius: '3px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: '0.875rem', boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6C63FF 0%, #8B84FF 100%)',
          boxShadow: '0 3px 10px rgba(108,99,255,0.28)',
          '&:hover': { background: 'linear-gradient(135deg, #5A52E0 0%, #7A72F0 100%)', boxShadow: '0 5px 16px rgba(108,99,255,0.38)', transform: 'translateY(-1px)' },
          transition: 'all 0.18s ease',
        },
        outlined: {
          borderColor: mode === 'light' ? 'rgba(108,99,255,0.3)' : 'rgba(139,132,255,0.22)',
          '&:hover': { borderColor: '#6C63FF', background: 'rgba(108,99,255,0.05)' },
        },
        sizeSmall: { padding: '5px 14px', fontSize: '0.8rem', borderRadius: 6 },
        sizeLarge: { padding: '12px 28px', fontSize: '0.95rem', borderRadius: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: mode === 'light' ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: mode === 'light' ? '1px solid rgba(255,255,255,0.95)' : '1px solid rgba(255,255,255,0.07)',
          boxShadow: mode === 'light'
            ? '0 2px 14px rgba(108,99,255,0.07), 0 1px 3px rgba(0,0,0,0.04)'
            : '0 2px 14px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: mode === 'light' ? '0 8px 28px rgba(108,99,255,0.11)' : '0 8px 28px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: mode === 'light' ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            background: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.04)',
            fontFamily: '"Nunito", sans-serif',
            '& fieldset': { borderColor: mode === 'light' ? 'rgba(108,99,255,0.18)' : 'rgba(139,132,255,0.12)' },
            '&:hover fieldset': { borderColor: 'rgba(108,99,255,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#6C63FF', borderWidth: '1.5px' },
          },
          '& .MuiInputLabel-root': { fontFamily: '"Nunito", sans-serif', fontWeight: 600 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6, fontWeight: 700, fontFamily: '"Nunito", sans-serif', fontSize: '0.74rem',
          background: mode === 'light' ? 'rgba(108,99,255,0.08)' : 'rgba(139,132,255,0.1)',
          color: mode === 'light' ? '#6C63FF' : '#B0ABFF',
        },
        colorSuccess: { background: 'rgba(16,185,129,0.1)', color: '#10B981' },
        colorWarning: { background: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
        colorError: { background: 'rgba(239,68,68,0.1)', color: '#EF4444' },
        colorSecondary: { background: 'rgba(0,212,170,0.1)', color: '#00D4AA' },
        colorPrimary: { background: 'rgba(108,99,255,0.12)', color: '#6C63FF' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(13,13,26,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${mode === 'light' ? 'rgba(108,99,255,0.08)' : 'rgba(139,132,255,0.07)'}`,
          boxShadow: 'none',
          color: mode === 'light' ? '#1A1040' : '#F1F0FF',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(13,13,26,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: `1px solid ${mode === 'light' ? 'rgba(108,99,255,0.08)' : 'rgba(139,132,255,0.07)'}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: mode === 'light' ? 'rgba(108,99,255,0.08)' : 'rgba(139,132,255,0.07)' } },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${mode === 'light' ? 'rgba(108,99,255,0.07)' : 'rgba(139,132,255,0.06)'}`, fontFamily: '"Nunito", sans-serif' },
        head: { fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: mode === 'light' ? '#64748B' : '#94A3B8', fontFamily: '"Poppins", sans-serif' },
      },
    },
    MuiAvatar: {
      styleOverrides: { root: { fontFamily: '"Poppins", sans-serif', fontWeight: 700, background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' } },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 10, fontFamily: '"Nunito", sans-serif', fontWeight: 600 } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 12 } },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { fontFamily: '"Nunito", sans-serif', fontWeight: 600, borderRadius: 6, fontSize: '0.78rem' } },
    },
    MuiSelect: {
      styleOverrides: { root: { fontFamily: '"Nunito", sans-serif', borderRadius: 8 } },
    },
    MuiPopover: {
      styleOverrides: { paper: { borderRadius: 12 } },
    },
  },
});
