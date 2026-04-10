import DashboardPage from '../../components/layout/DashboardPage';
import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Alert,
  Stepper, Step, StepLabel, Divider, Chip
} from '@mui/material';
import { QrCode2, CheckCircle, Star, Payment } from '@mui/icons-material';
import API from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const UPI_ID = 'ideanomics@upi';
const AMOUNT = 500;

const steps = ['Review Plan', 'Scan & Pay', 'Submit Proof'];

const PaymentPage = () => {
  const { user, refreshUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingPayments, setExistingPayments] = useState([]);

  useEffect(() => {
    API.get('/payments/my').then(({ data }) => setExistingPayments(data.payments)).catch(() => {});
  }, []);

  const pendingPayment = existingPayments.find(p => p.status === 'pending');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) { enqueueSnackbar('Please enter your transaction ID', { variant: 'error' }); return; }
    setLoading(true);
    try {
      await API.post('/payments', { transactionId: transactionId.trim(), upiId });
      await refreshUser();
      setSubmitted(true);
      enqueueSnackbar('Payment submitted for review!', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to submit payment', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (user?.isPremium) return (
    

      <DashboardPage>
        <Box sx={{ maxWidth: 500, mx: 'auto', textAlign: 'center', pt: 6 }}>
          <CheckCircle sx={{ fontSize: 80, color: '#10B981', mb: 2 }} />
          <Typography variant="h4" fontWeight={800} fontFamily='"Poppins", sans-serif' gutterBottom>You're Premium!</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>You already have unlimited access to all ideas.</Typography>
          <Button variant="contained" onClick={() => navigate('/browse')}>Browse Ideas</Button>
        </Box>
      </DashboardPage>
  );

  if (submitted || pendingPayment) return (
    

      <DashboardPage>
        <Box sx={{ maxWidth: 500, mx: 'auto', textAlign: 'center', pt: 6 }}>
          <Payment sx={{ fontSize: 80, color: '#F59E0B', mb: 2 }} />
          <Typography variant="h4" fontWeight={800} fontFamily='"Poppins", sans-serif' gutterBottom>Payment Under Review</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Your payment of ₹{AMOUNT} is being verified by the admin. You'll get premium access once approved.
          </Typography>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Transaction ID: <strong>{pendingPayment?.transactionId || transactionId}</strong>
            </Typography>
          </Box>
          <Button variant="outlined" onClick={() => navigate('/investor')}>Back to Dashboard</Button>
        </Box>
      </DashboardPage>
  );

  return (
    

      <DashboardPage>
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={800} fontFamily='"Poppins", sans-serif' gutterBottom>
              Upgrade to Premium
            </Typography>
            <Typography color="text.secondary">Get unlimited access to all ideas on the platform</Typography>
          </Box>

          {/* Plan Card */}
          <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Star sx={{ fontSize: 32, mb: 1, color: '#FCD34D' }} />
                  <Typography variant="h5" fontWeight={800} fontFamily='"Poppins", sans-serif'>Premium Plan</Typography>
                  <Typography sx={{ opacity: 0.85, mt: 0.5 }}>One-time payment · Lifetime access</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h3" fontWeight={800} fontFamily='"Poppins", sans-serif'>₹500</Typography>
                  <Typography sx={{ opacity: 0.7, fontSize: '0.85rem' }}>one-time</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Unlimited idea unlocks', 'Access to all idea details', 'Priority browsing', 'Lifetime premium badge'].map(f => (
                  <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 16, color: '#34D399' }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>{f}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Payment Instructions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                  {[
                    'Click "Next" to see the UPI QR code',
                    'Open any UPI app (PhonePe, GPay, Paytm, etc.)',
                    'Scan the QR code or pay to UPI ID: ' + UPI_ID,
                    'Pay exactly ₹500',
                    'Save your Transaction ID / UTR number',
                    'Submit the Transaction ID in the next step'
                  ].map((step, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box sx={{ minWidth: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                        {i + 1}
                      </Box>
                      <Typography variant="body2">{step}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button fullWidth variant="contained" size="large" onClick={() => setActiveStep(1)}>
                  Next: View QR Code
                </Button>
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <Card>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Scan & Pay ₹500</Typography>

                {/* Dummy QR Representation */}
                <Box sx={{
                  width: 220, height: 220, mx: 'auto', my: 3, borderRadius: 3,
                  border: '3px solid', borderColor: 'primary.main',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  bgcolor: 'background.paper', position: 'relative', overflow: 'hidden'
                }}>
                  <QrCode2 sx={{ fontSize: 160, color: 'text.primary', opacity: 0.85 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', bottom: 8 }}>
                    Sample QR (Demo)
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">UPI ID</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">{UPI_ID}</Typography>
                  <Typography variant="body2" color="text.secondary">Amount: <strong>₹{AMOUNT}</strong></Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button fullWidth variant="outlined" onClick={() => setActiveStep(0)}>Back</Button>
                  <Button fullWidth variant="contained" onClick={() => setActiveStep(2)}>
                    I Have Paid
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Submit Payment Proof</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Enter the Transaction ID or UTR number from your payment receipt
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField fullWidth label="Transaction ID / UTR Number" value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)} required sx={{ mb: 2.5 }}
                    placeholder="e.g. T2401011234567890" />
                  <TextField fullWidth label="Your UPI ID (optional)" value={upiId}
                    onChange={(e) => setUpiId(e.target.value)} sx={{ mb: 3 }}
                    placeholder="e.g. yourname@oksbi" />
                  <Alert severity="info" sx={{ mb: 3 }}>
                    After submission, the admin will verify your payment and activate premium access within a few hours.
                  </Alert>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button fullWidth variant="outlined" onClick={() => setActiveStep(1)}>Back</Button>
                    <Button fullWidth variant="contained" type="submit" disabled={loading} size="large">
                      {loading ? 'Submitting...' : 'Submit Payment'}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          )}
        </Box>
      </DashboardPage>
  );
};

export default PaymentPage;
