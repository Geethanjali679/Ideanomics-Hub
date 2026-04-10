import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, CircularProgress, Chip, Avatar
} from '@mui/material';
import { People, Lightbulb, EmojiObjects, Payment, Warning } from '@mui/icons-material';
import DashboardPage from '../../components/layout/DashboardPage';
import API from '../../utils/api';

const GlassStatCard = ({ title, value, icon, gradient, badge }) => (
  <Card sx={{
    position: 'relative', overflow: 'hidden',
    '&::before': {
      content: '""', position: 'absolute', inset: 0,
      background: gradient, opacity: 0.07, borderRadius: 'inherit',
    },
  }}>
    <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
            <Typography variant="h3" fontWeight={800} sx={{ fontFamily: '"Poppins", sans-serif', lineHeight: 1 }}>{value}</Typography>
            {badge && <Chip label={badge} size="small" color="warning" sx={{ fontSize: '0.68rem' }} />}
          </Box>
        </Box>
        <Box sx={{
          width: 50, height: 50, borderRadius: 2.5,
          background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(108,99,255,0.25)', flexShrink: 0,
        }}>
          {React.cloneElement(icon, { sx: { color: 'white', fontSize: 22 } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentIdeas, setRecentIdeas] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard').then(({ data }) => {
      setStats(data.stats);
      setRecentIdeas(data.recentIdeas);
      setRecentUsers(data.recentUsers);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: <People />, gradient: 'linear-gradient(135deg, #6C63FF, #8B84FF)' },
    { title: 'Creators', value: stats?.totalCreators || 0, icon: <EmojiObjects />, gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
    { title: 'Investors', value: stats?.totalInvestors || 0, icon: <People />, gradient: 'linear-gradient(135deg, #00D4AA, #34D399)' },
    { title: 'Ideas', value: stats?.totalIdeas || 0, icon: <Lightbulb />, gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
    { title: 'Pending Payments', value: stats?.pendingPayments || 0, icon: <Payment />, gradient: 'linear-gradient(135deg, #EF4444, #F87171)', badge: stats?.pendingPayments > 0 ? 'Review' : null },
  ];

  return (
    <DashboardPage>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Poppins", sans-serif', mb: 0.5 }}>Admin Dashboard</Typography>
        <Typography color="text.secondary" variant="body2">Platform overview and management</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            {statCards.map((s) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={s.title}>
                <GlassStatCard {...s} />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: '"Poppins", sans-serif' }}>Recent Ideas</Typography>
                  {recentIdeas.length === 0 ? (
                    <Typography color="text.secondary" py={2} textAlign="center" variant="body2">No ideas yet</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {recentIdeas.map((idea) => (
                        <Box key={idea._id} sx={{
                          display: 'flex', alignItems: 'center', gap: 2, p: 1.75, borderRadius: 2.5,
                          background: 'rgba(108,99,255,0.04)', border: '1px solid rgba(108,99,255,0.08)',
                          transition: 'all 0.15s', '&:hover': { background: 'rgba(108,99,255,0.08)' },
                        }}>
                          <Box sx={{
                            width: 38, height: 38, borderRadius: 2,
                            background: 'linear-gradient(135deg, #6C63FF, #00D4AA)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <Lightbulb sx={{ color: 'white', fontSize: 17 }} />
                          </Box>
                          <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ fontSize: '0.87rem' }}>{idea.title}</Typography>
                            <Typography variant="caption" color="text.secondary">by {idea.creator?.name}</Typography>
                          </Box>
                          <Chip label={idea.category} size="small" />
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: '"Poppins", sans-serif' }}>Recent Users</Typography>
                  {recentUsers.length === 0 ? (
                    <Typography color="text.secondary" py={2} textAlign="center" variant="body2">No users yet</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {recentUsers.map((u) => (
                        <Box key={u._id} sx={{
                          display: 'flex', alignItems: 'center', gap: 2, p: 1.75, borderRadius: 2.5,
                          background: 'rgba(108,99,255,0.04)', border: '1px solid rgba(108,99,255,0.08)',
                          transition: 'all 0.15s', '&:hover': { background: 'rgba(108,99,255,0.08)' },
                        }}>
                          <Avatar sx={{ width: 38, height: 38, fontSize: '0.82rem', fontWeight: 700, flexShrink: 0 }}>
                            {u.name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ fontSize: '0.87rem' }}>{u.name}</Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>{u.email}</Typography>
                          </Box>
                          <Chip label={u.role} size="small" color={u.role === 'creator' ? 'primary' : 'secondary'} />
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </DashboardPage>
  );
};

export default AdminDashboard;
