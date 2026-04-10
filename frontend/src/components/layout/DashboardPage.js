import React from 'react';
import { Box } from '@mui/material';
import DashboardLayout from './DashboardLayout';

const DashboardPage = ({ children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
    <DashboardLayout>
      {children}
    </DashboardLayout>
  </Box>
);

export default DashboardPage;
