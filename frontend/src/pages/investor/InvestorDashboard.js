import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip, Alert, CircularProgress
} from '@mui/material';
import { Lightbulb, Star, LockOpen, TrendingUp, Add, Inventory, ArrowForward, EmojiObjects } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardPage from '../../components/layout/DashboardPage';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../utils/api';

const GlassStatCard = ({ title, value, icon, gradient, subtitle }) => (
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
          <Typography variant="h3" fontWeight={800} sx={{ fontFamily: '"Poppins", sans-serif', lineHeight: 1.1, mb: 0.3 }}>{value}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
        <Box sx={{
          width: 50, height: 50, borderRadius: 2.5, background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(108,99,255,0.25)', flexShrink: 0,
        }}>
          {React.cloneElement(icon, { sx: { color: 'white', fontSize: 22 } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const InvestorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [myIdeas, setMyIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/payments/my').then(({ data }) => setPayments(data.payments)).catch(() => {}),
      API.get('/ideas/my').then(({ data }) => setMyIdeas(data.ideas)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const pendingPayment = payments.find(p => p.status === 'pending');

  return (
    <DashboardPage>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Poppins", sans-serif', mb: 0.5 }}>
          Welcome, {user?.name?.split(' ')[0]}! 👋
        </Typography>
        <Typography color="text.secondary" variant="body2">Your investor dashboard overview</Typography>
      </Box>

      {user?.isPremium ? (
        <Alert severity="success" icon={<Star />} sx={{ mb: 3, borderRadius: 2.5 }}>
          <strong>Premium Member!</strong> You have unlimited idea access.
        </Alert>
      ) : pendingPayment ? (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5 }}>
          Payment (TXN: <strong>{pendingPayment.transactionId}</strong>) is under review. Premium activates after approval.
        </Alert>
      ) : !user?.freeTrialUsed ? (
        <Alert severity="info" icon={<LockOpen />} sx={{ mb: 3, borderRadius: 2.5 }}>
          <strong>Free Trial Available!</strong> You can unlock 1 idea for free — choose wisely!
        </Alert>
      ) : (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2.5 }}
          action={<Button size="small" variant="contained" color="warning" onClick={() => navigate('/investor/payment')}>Upgrade</Button>}>
          <strong>Free trial used.</strong> Upgrade to Premium (₹500) for unlimited unlocks.
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            {[
              { title: 'Ideas Unlocked', value: user?.unlockedIdeas?.length || 0, icon: <LockOpen />, gradient: 'linear-gradient(135deg, #6C63FF, #8B84FF)', subtitle: 'Full details accessed' },
              { title: 'Free Unlocks Left', value: user?.isPremium ? '∞' : user?.freeTrialUsed ? '0' : '1', icon: <Star />, gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)', subtitle: user?.isPremium ? 'Unlimited' : user?.freeTrialUsed ? 'Upgrade for more' : 'First unlock free' },
              { title: 'My Posted Ideas', value: myIdeas.length, icon: <Inventory />, gradient: 'linear-gradient(135deg, #10B981, #34D399)', subtitle: 'Ideas you\'ve shared' },
              { title: 'Status', value: user?.isPremium ? '⭐' : '🆓', icon: <TrendingUp />, gradient: 'linear-gradient(135deg, #00D4AA, #06B6D4)', subtitle: user?.isPremium ? 'Premium member' : 'Free account' },
            ].map((s) => (
              <Grid item xs={12} sm={6} md={3} key={s.title}><GlassStatCard {...s} /></Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: '"Poppins", sans-serif' }}>Quick Actions</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button fullWidth variant="outlined" startIcon={<EmojiObjects />} onClick={() => navigate('/browse')}>Browse All Ideas</Button>
                    <Button fullWidth variant="outlined" startIcon={<Add />} onClick={() => navigate('/investor/submit')}>Post an Idea</Button>
                    {!user?.isPremium && !pendingPayment && (
                      <Button fullWidth variant="contained" startIcon={<Star />} onClick={() => navigate('/investor/payment')}
                        sx={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', '&:hover': { background: 'linear-gradient(135deg, #D97706, #B45309)' } }}>
                        Upgrade to Premium — ₹500
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {payments.length > 0 && (
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: '"Poppins", sans-serif' }}>Payment History</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {payments.slice(0, 4).map((p) => (
                        <Box key={p._id} sx={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          p: 1.75, borderRadius: 2.5,
                          background: 'rgba(108,99,255,0.04)', border: '1px solid rgba(108,99,255,0.08)',
                        }}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700}>₹{p.amount}</Typography>
                            <Typography variant="caption" color="text.secondary">{p.transactionId?.slice(0, 12)}... · {new Date(p.createdAt).toLocaleDateString('en-IN')}</Typography>
                          </Box>
                          <Chip label={p.status} size="small" color={p.status === 'approved' ? 'success' : p.status === 'pending' ? 'warning' : 'error'} />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {myIdeas.length > 0 && (
              <Grid item xs={12} md={payments.length > 0 ? 4 : 8}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Poppins", sans-serif' }}>My Posted Ideas</Typography>
                      <Button size="small" variant="outlined" endIcon={<ArrowForward sx={{ fontSize: 13 }} />} onClick={() => navigate('/investor/ideas')}>View All</Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {myIdeas.slice(0, 4).map((idea) => (
                        <Box key={idea._id} sx={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          p: 1.75, borderRadius: 2.5,
                          background: 'rgba(108,99,255,0.04)', border: '1px solid rgba(108,99,255,0.08)',
                        }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" fontWeight={700} noWrap>{idea.title}</Typography>
                            <Typography variant="caption" color="text.secondary">{idea.likesCount || 0} likes · {idea.commentsCount || 0} comments</Typography>
                          </Box>
                          <Chip label={idea.category} size="small" sx={{ ml: 1, flexShrink: 0 }} />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </DashboardPage>
  );
};

export default InvestorDashboard;
