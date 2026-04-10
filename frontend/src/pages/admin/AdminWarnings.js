import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, CircularProgress, Avatar
} from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import DashboardPage from '../../components/layout/DashboardPage';
import API from '../../utils/api';

const AdminWarnings = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const { data } = await API.get('/admin/warnings');
        setWarnings(data.warnings || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load warnings');
      } finally {
        setLoading(false);
      }
    };
    fetchWarnings();
  }, []);

  return (
    <DashboardPage>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Poppins", sans-serif', mb: 0.5 }}>
          Warnings
        </Typography>
        <Typography color="text.secondary" variant="body2">All issued warnings across the platform</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="error" variant="body2">{error}</Typography>
            </Box>
          ) : warnings.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <WarningAmber sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography color="text.secondary" fontWeight={600}>No warnings issued yet</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Issued By</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total Warnings</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {warnings.map((w) => (
                    <TableRow key={w._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 30, height: 30, fontSize: '0.75rem', fontWeight: 700 }}>
                            {w.userId?.name?.[0]?.toUpperCase() || '?'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>
                              {w.userId?.name || 'Deleted user'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {w.userId?.email || '—'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 260 }}>{w.reason}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{w.issuedBy?.name || 'Admin'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(w.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${w.userId?.warningCount || 1} warning(s)`}
                          size="small"
                          color={(w.userId?.warningCount || 1) >= 3 ? 'error' : 'warning'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </DashboardPage>
  );
};

export default AdminWarnings;
