import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography,
  useTheme, useMediaQuery, IconButton, Tooltip, Divider, Avatar,
  AppBar, Toolbar, Badge, Popover, Button, CircularProgress, Chip
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import API from '../../utils/api';
import {
  Dashboard, Lightbulb, Add, People, Payment, Warning,
  ChevronLeft, ChevronRight, Inventory, Menu as MenuIcon,
  LightMode, DarkMode, Logout, Close, Notifications,
  NotificationsNone, CheckCircleOutline, DeleteOutline,
  FiberManualRecord
} from '@mui/icons-material';

const DRAWER_WIDTH = 252;
const COLLAPSED_WIDTH = 70;

const LogoMark = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6C63FF"/>
        <stop offset="1" stopColor="#00D4AA"/>
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="12" fill="url(#logoGrad)"/>
    <path d="M20 9C14.477 9 10 13.477 10 19c0 3.4 1.65 6.42 4.2 8.3V30a1 1 0 001 1h9.6a1 1 0 001-1v-2.7C28.35 25.42 30 22.4 30 19c0-5.523-4.477-10-10-10z" fill="white" fillOpacity="0.95"/>
    <rect x="15.5" y="32" width="9" height="1.5" rx="0.75" fill="white" fillOpacity="0.75"/>
    <rect x="17" y="34.5" width="6" height="1.2" rx="0.6" fill="white" fillOpacity="0.5"/>
  </svg>
);

const navItems = {
  creator: [
    { label: 'Dashboard', icon: <Dashboard />, path: '/creator' },
    { label: 'Submit Idea', icon: <Add />, path: '/creator/submit' },
    { label: 'My Ideas', icon: <Lightbulb />, path: '/creator/ideas' },
  ],
  investor: [
    { label: 'Dashboard', icon: <Dashboard />, path: '/investor' },
    { label: 'Browse Ideas', icon: <Lightbulb />, path: '/browse' },
    { label: 'Post an Idea', icon: <Add />, path: '/investor/submit' },
    { label: 'My Posted Ideas', icon: <Inventory />, path: '/investor/ideas' },
    { label: 'Premium / Payment', icon: <Payment />, path: '/investor/payment' },
  ],
  admin: [
    { label: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { label: 'Users', icon: <People />, path: '/admin/users' },
    { label: 'Ideas', icon: <Inventory />, path: '/admin/ideas' },
    { label: 'Payments', icon: <Payment />, path: '/admin/payments' },
    { label: 'Warnings', icon: <Warning />, path: '/admin/warnings' },
  ],
};

const NotificationPanel = ({ anchorEl, open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data.notifications || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { if (open) fetchNotifications(); }, [open, fetchNotifications]);

  const handleMarkAllRead = async () => {
    await API.put('/notifications/read-all').catch(() => {});
    setNotifications(n => n.map(x => ({ ...x, isRead: true })));
  };

  const handleDelete = async (id) => {
    await API.delete(`/notifications/${id}`).catch(() => {});
    setNotifications(n => n.filter(x => x._id !== id));
  };

  const handleMarkRead = async (id) => {
    await API.put(`/notifications/${id}/read`).catch(() => {});
    setNotifications(n => n.map(x => x._id === id ? { ...x, isRead: true } : x));
  };

  const typeColors = {
    like: '#EF4444', comment: '#6C63FF', payment_approved: '#10B981',
    payment_rejected: '#EF4444', warning: '#F59E0B', new_idea: '#00D4AA',
    system: '#6B7280', idea_approved: '#10B981', idea_rejected: '#EF4444',
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          width: 360, maxHeight: 480, mt: 1,
          background: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(20,18,40,0.97)',
          backdropFilter: 'blur(24px)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(108,99,255,0.15)',
        }
      }}
    >
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography fontWeight={700} fontSize="0.95rem">Notifications</Typography>
        <Button size="small" onClick={handleMarkAllRead} sx={{ fontSize: '0.72rem', minWidth: 0, color: 'primary.main' }}>
          Mark all read
        </Button>
      </Box>
      <Box sx={{ overflowY: 'auto', maxHeight: 400 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <NotificationsNone sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">No notifications yet</Typography>
          </Box>
        ) : (
          notifications.map((n) => (
            <Box
              key={n._id}
              onClick={() => handleMarkRead(n._id)}
              sx={{
                px: 2.5, py: 1.8,
                display: 'flex', alignItems: 'flex-start', gap: 1.5,
                cursor: 'pointer',
                bgcolor: n.isRead ? 'transparent' : (theme.palette.mode === 'light' ? 'rgba(108,99,255,0.05)' : 'rgba(108,99,255,0.08)'),
                borderBottom: '1px solid',
                borderColor: 'divider',
                transition: 'background 0.15s',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box sx={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                bgcolor: (typeColors[n.type] || '#6C63FF') + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiberManualRecord sx={{ fontSize: 10, color: typeColors[n.type] || '#6C63FF' }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={600} fontSize="0.82rem" noWrap>{n.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2 }}>{n.message}</Typography>
                <Typography variant="caption" sx={{ color: 'primary.main', fontSize: '0.68rem', mt: 0.3, display: 'block' }}>
                  {new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); handleDelete(n._id); }}
                sx={{ opacity: 0.4, '&:hover': { opacity: 1 }, flexShrink: 0, mt: -0.5 }}
              >
                <DeleteOutline sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Popover>
  );
};

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const items = navItems[user?.role] || [];
  const drawerWidth = isMobile ? DRAWER_WIDTH : (collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH);
  const isCollapsed = !isMobile && collapsed;

  const initials = user
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await API.get('/notifications');
        setUnreadCount(data.unreadCount || 0);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => { setNotifAnchor(null); setUnreadCount(0); };

  const gradientText = {
    background: 'linear-gradient(135deg, #6C63FF, #00D4AA)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const SidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{
        height: 68, px: 2, display: 'flex', alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0,
      }}>
        {!isCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
            <LogoMark size={32} />
            <Box>
              <Typography sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 800, fontSize: '1rem', lineHeight: 1.1, whiteSpace: 'nowrap', ...gradientText }}>
                Ideanomics
              </Typography>
              <Typography sx={{ fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'text.secondary', fontWeight: 600 }}>Hub</Typography>
            </Box>
          </Box>
        )}
        {isMobile
          ? <IconButton size="small" onClick={() => setMobileOpen(false)}><Close fontSize="small" /></IconButton>
          : (
            <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right">
              <IconButton size="small" onClick={() => setCollapsed(!collapsed)} sx={{ color: 'text.secondary' }}>
                {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
              </IconButton>
            </Tooltip>
          )
        }
      </Box>

      {/* User chip */}
      {!isCollapsed && user && (
        <Box sx={{ px: 1.5, pt: 2, pb: 1.5 }}>
          <Box sx={{
            p: 1.5, borderRadius: 3,
            background: mode === 'light' ? 'rgba(108,99,255,0.07)' : 'rgba(108,99,255,0.12)',
            display: 'flex', alignItems: 'center', gap: 1.5,
            border: '1px solid',
            borderColor: 'rgba(108,99,255,0.15)',
          }}>
            <Avatar sx={{ width: 34, height: 34, fontSize: '0.78rem', fontWeight: 800, flexShrink: 0 }}>{initials}</Avatar>
            <Box sx={{ overflow: 'hidden', flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ fontSize: '0.84rem' }}>{user.name}</Typography>
              <Typography variant="caption" sx={{ textTransform: 'capitalize', color: 'primary.main', fontWeight: 600, fontSize: '0.7rem' }}>{user.role}</Typography>
            </Box>
          </Box>
        </Box>
      )}
      {isCollapsed && user && (
        <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={user.name} placement="right">
            <Avatar sx={{ width: 34, height: 34, fontSize: '0.78rem', fontWeight: 800 }}>{initials}</Avatar>
          </Tooltip>
        </Box>
      )}

      <Divider />

      {/* Nav Items */}
      <List sx={{ flex: 1, pt: 1.5, px: isCollapsed ? 0.75 : 1.25, overflowY: 'auto', overflowX: 'hidden' }}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Tooltip key={item.path} title={isCollapsed ? item.label : ''} placement="right">
              <ListItem
                button
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                sx={{
                  borderRadius: 2.5, mb: 0.5,
                  px: isCollapsed ? 1.3 : 1.75, py: 1.1,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(108,99,255,0.18), rgba(0,212,170,0.1))'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(108,99,255,0.2)' : '1px solid transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(108,99,255,0.22), rgba(0,212,170,0.13))'
                      : (mode === 'light' ? 'rgba(108,99,255,0.06)' : 'rgba(108,99,255,0.1)'),
                    color: 'text.primary',
                  },
                  transition: 'all 0.18s ease',
                }}
              >
                <ListItemIcon sx={{
                  minWidth: isCollapsed ? 0 : 36,
                  color: isActive ? 'primary.main' : 'inherit',
                  '& .MuiSvgIcon-root': { fontSize: '1.2rem' }
                }}>
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.875rem' }}
                  />
                )}
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Divider />

      {/* Bottom actions */}
      <Box sx={{ p: isCollapsed ? 0.75 : 1.25, pb: 2 }}>
        <Tooltip title={isCollapsed ? (mode === 'dark' ? 'Light Mode' : 'Dark Mode') : ''} placement="right">
          <ListItem
            button
            onClick={toggleTheme}
            sx={{
              borderRadius: 2.5, mb: 0.5, px: isCollapsed ? 1.3 : 1.75, py: 1,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              color: 'text.secondary',
              '&:hover': { bgcolor: mode === 'light' ? 'rgba(108,99,255,0.06)' : 'rgba(108,99,255,0.1)', color: 'text.primary' },
            }}
          >
            <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 36, color: 'inherit', '& .MuiSvgIcon-root': { fontSize: '1.1rem' } }}>
              {mode === 'light' ? <DarkMode /> : <LightMode />}
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }} />}
          </ListItem>
        </Tooltip>

        <Tooltip title={isCollapsed ? 'Logout' : ''} placement="right">
          <ListItem
            button onClick={handleLogout}
            sx={{
              borderRadius: 2.5, color: 'error.main', px: isCollapsed ? 1.3 : 1.75, py: 1,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              border: '1px solid transparent',
              '&:hover': { bgcolor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'error.main' },
            }}
          >
            <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 36, color: 'inherit', '& .MuiSvgIcon-root': { fontSize: '1.1rem' } }}>
              <Logout />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }} />}
          </ListItem>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {!isMobile && (
        <Drawer variant="permanent" sx={{
          width: drawerWidth, flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth, boxSizing: 'border-box',
            borderRight: '1px solid', borderColor: 'divider',
            transition: 'width 0.22s ease', overflowX: 'hidden',
          },
        }}>
          {SidebarContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>
          {SidebarContent}
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Top AppBar */}
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ minHeight: '60px !important', px: { xs: 2, md: 3 }, gap: 1 }}>
            {isMobile && (
              <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ color: 'text.primary', mr: 0.5 }}>
                <MenuIcon />
              </IconButton>
            )}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <LogoMark size={26} />
                <Typography sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 800, fontSize: '0.95rem', ...gradientText }}>
                  Ideanomics Hub
                </Typography>
              </Box>
            )}
            {!isMobile && <Box sx={{ flex: 1 }} />}

            {/* Notification Bell */}
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotifOpen} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                <Badge badgeContent={unreadCount} color="error" max={99}
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16, border: '2px solid', borderColor: 'background.paper' } }}>
                  {unreadCount > 0 ? <Notifications /> : <NotificationsNone />}
                </Badge>
              </IconButton>
            </Tooltip>

            {!isMobile && (
              <>
                <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                  <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
                    {mode === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
                  </IconButton>
                </Tooltip>
                {user && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 0.5 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.72rem', fontWeight: 800 }}>{initials}</Avatar>
                    <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.82rem', lineHeight: 1.2 }}>{user.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'primary.main', textTransform: 'capitalize', fontSize: '0.7rem', fontWeight: 600 }}>{user.role}</Typography>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Toolbar>
        </AppBar>

        <NotificationPanel
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={handleNotifClose}
        />

        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
