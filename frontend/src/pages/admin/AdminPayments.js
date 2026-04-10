import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Tooltip, CircularProgress, Select, MenuItem,
  FormControl, InputLabel, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import DashboardPage from '../../components/layout/DashboardPage';
import API from '../../utils/api';
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2';

const AdminPayments = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectDialog, setRejectDialog] = useState({ open: false, paymentId: null, userName: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await API.get('/payments', { params });
      setPayments(data.payments || []);
    } catch {}
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleApprove = async (payment) => {
    const result = await Swal.fire({
      title: 'Approve Payment?',
      html: `Approve <strong>₹${payment.amount}</strong> from <strong>${payment.userId?.name}</strong>?<br/><small>This will activate their Premium access.</small>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6C63FF',
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;
    setActionLoading(true);
    try {
      await API.put(`/payments/${payment._id}/review`, { action: 'approve' });
      enqueueSnackbar('Payment approved — user upgraded to Premium!', { variant: 'success' });
      fetchPayments();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Approval failed', { variant: 'error' });
    } finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await API.put(`/payments/${rejectDialog.paymentId}/review`, {
        action: 'reject',
        notes: rejectReason,
      });
      enqueueSnackbar('Payment rejected', { variant: 'info' });
      setRejectDialog({ open: false, paymentId: null, userName: '' });
      setRejectReason('');
      fetchPayments();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Rejection failed', { variant: 'error' });
    } finally { setActionLoading(false); }
  };

  return (
    <DashboardPage>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Poppins", sans-serif', mb: 0.5 }}>
          Payment Management
        </Typography>
        <Typography color="text.secondary" variant="body2">Review and approve premium payment requests</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select value={statusFilter} label="Filter by Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : payments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary" variant="body2">No payments found</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', fontWeight: 700 }}>
                            {payment.userId?.name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>
                              {payment.userId?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">{payment.userId?.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={800} sx={{ color: 'success.main' }}>₹{payment.amount}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {payment.transactionId}
                        </Typography>
                        {payment.upiId && (
                          <Typography variant="caption" color="text.secondary">{payment.upiId}</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          size="small"
                          color={payment.status === 'approved' ? 'success' : payment.status === 'pending' ? 'warning' : 'error'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(payment.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {payment.status === 'pending' ? (
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Tooltip title="Approve & activate Premium">
                              <IconButton size="small" color="success" disabled={actionLoading}
                                onClick={() => handleApprove(payment)}>
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject payment">
                              <IconButton size="small" color="error" disabled={actionLoading}
                                onClick={() => { setRejectDialog({ open: true, paymentId: payment._id, userName: payment.userId?.name }); setRejectReason(''); }}>
                                <Cancel fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            {payment.reviewedAt ? new Date(payment.reviewedAt).toLocaleDateString('en-IN') : '—'}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, paymentId: null, userName: '' })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}>
          Reject Payment — {rejectDialog.userName}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Rejection Reason (optional)"
            multiline rows={3}
            placeholder="Explain why the payment is being rejected..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setRejectDialog({ open: false, paymentId: null, userName: '' })} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleReject} disabled={actionLoading}>
            {actionLoading ? 'Rejecting...' : 'Reject Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardPage>
  );
};

export default AdminPayments;
