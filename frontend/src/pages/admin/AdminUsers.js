import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, CircularProgress, Avatar, Pagination
} from '@mui/material';
import { Search, Delete, Block, CheckCircle, WarningAmber } from '@mui/icons-material';
import DashboardPage from '../../components/layout/DashboardPage';
import API from '../../utils/api';
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2';

const AdminUsers = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / 15);

  const [warnDialog, setWarnDialog] = useState({ open: false, userId: null, name: '' });
  const [warnReason, setWarnReason] = useState('');
  const [warnLoading, setWarnLoading] = useState(false);

  const [suspendDialog, setSuspendDialog] = useState({ open: false, userId: null, name: '', isSuspended: false });
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendLoading, setSuspendLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await API.get('/admin/users', { params });
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch {}
    finally { setLoading(false); }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [search, roleFilter]);

  const handleDelete = async (userId, name) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: `"${name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6C63FF',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      enqueueSnackbar('User deleted', { variant: 'success' });
      fetchUsers();
    } catch { enqueueSnackbar('Failed to delete user', { variant: 'error' }); }
  };

  const handleWarn = async () => {
    if (!warnReason.trim()) return;
    setWarnLoading(true);
    try {
      const { data } = await API.post(`/admin/users/${warnDialog.userId}/warn`, { reason: warnReason });
      enqueueSnackbar(data.message, { variant: 'success' });
      setWarnDialog({ open: false, userId: null, name: '' });
      setWarnReason('');
      fetchUsers();
    } catch { enqueueSnackbar('Failed to issue warning', { variant: 'error' }); }
    finally { setWarnLoading(false); }
  };

  const handleToggleSuspend = async () => {
    setSuspendLoading(true);
    try {
      if (suspendDialog.isSuspended) {
        await API.put(`/admin/users/${suspendDialog.userId}/unsuspend`);
        enqueueSnackbar('User unsuspended', { variant: 'success' });
      } else {
        await API.put(`/admin/users/${suspendDialog.userId}/suspend`, { reason: suspendReason });
        enqueueSnackbar('User suspended', { variant: 'success' });
      }
      setSuspendDialog({ open: false, userId: null, name: '', isSuspended: false });
      setSuspendReason('');
      fetchUsers();
    } catch { enqueueSnackbar('Action failed', { variant: 'error' }); }
    finally { setSuspendLoading(false); }
  };

  return (
    <DashboardPage>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Poppins", sans-serif', mb: 0.5 }}>
          User Management
        </Typography>
        <Typography color="text.secondary" variant="body2">{total} users registered</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search users..." size="small" value={search}
              onChange={(e) => setSearch(e.target.value)} sx={{ flex: 1, minWidth: 200 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
            />
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Role</InputLabel>
              <Select value={roleFilter} label="Role" onChange={(e) => setRoleFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="creator">Creator</MenuItem>
                <MenuItem value="investor">Investor</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : users.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">No users found</Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Warnings</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 30, height: 30, fontSize: '0.72rem', fontWeight: 700 }}>
                              {u.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>{u.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={u.role} size="small" color={u.role === 'creator' ? 'primary' : 'secondary'} />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.isSuspended ? 'Suspended' : 'Active'}
                            size="small"
                            color={u.isSuspended ? 'error' : 'success'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.warningCount || 0}
                            size="small"
                            color={(u.warningCount || 0) >= 3 ? 'error' : (u.warningCount || 0) > 0 ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Tooltip title="Issue warning">
                              <IconButton size="small" color="warning" onClick={() => { setWarnDialog({ open: true, userId: u._id, name: u.name }); setWarnReason(''); }}>
                                <WarningAmber fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={u.isSuspended ? 'Unsuspend' : 'Suspend'}>
                              <IconButton size="small" color={u.isSuspended ? 'success' : 'error'}
                                onClick={() => { setSuspendDialog({ open: true, userId: u._id, name: u.name, isSuspended: u.isSuspended }); setSuspendReason(''); }}>
                                {u.isSuspended ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete user">
                              <IconButton size="small" color="error" onClick={() => handleDelete(u._id, u.name)}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" size="small" />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Warn Dialog */}
      <Dialog open={warnDialog.open} onClose={() => setWarnDialog({ ...warnDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}>
          Warn {warnDialog.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth multiline rows={3} label="Warning Reason"
            placeholder="Describe the reason for this warning..."
            value={warnReason} onChange={(e) => setWarnReason(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            3 warnings trigger automatic account suspension.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setWarnDialog({ ...warnDialog, open: false })} variant="outlined">Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleWarn} disabled={!warnReason.trim() || warnLoading}
            startIcon={<WarningAmber />}>
            {warnLoading ? 'Issuing...' : 'Issue Warning'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialog.open} onClose={() => setSuspendDialog({ ...suspendDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}>
          {suspendDialog.isSuspended ? `Unsuspend ${suspendDialog.name}?` : `Suspend ${suspendDialog.name}?`}
        </DialogTitle>
        <DialogContent>
          {!suspendDialog.isSuspended && (
            <TextField
              fullWidth multiline rows={2} label="Suspension Reason"
              placeholder="Reason for suspension..."
              value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)}
              sx={{ mt: 1 }}
            />
          )}
          {suspendDialog.isSuspended && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This will restore the user's access to the platform.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setSuspendDialog({ ...suspendDialog, open: false })} variant="outlined">Cancel</Button>
          <Button
            variant="contained" color={suspendDialog.isSuspended ? 'success' : 'error'}
            onClick={handleToggleSuspend} disabled={suspendLoading}
          >
            {suspendLoading ? 'Processing...' : suspendDialog.isSuspended ? 'Unsuspend' : 'Suspend'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardPage>
  );
};

export default AdminUsers;
