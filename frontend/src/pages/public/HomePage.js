import React from 'react';
import {
  Box, Typography, Button, Grid, Card, CardContent, Container, Chip
} from '@mui/material';
import { ArrowForward, EmojiObjects, TrendingUp, Security, Groups } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

const FloatingBlob = ({ sx }) => (
  <Box sx={{ position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.25, pointerEvents: 'none', ...sx }} />
);

const FeatureCard = ({ icon, title, desc, gradient }) => (
  <Card sx={{ height: '100%', transition: 'all 0.2s ease' }}>
    <CardContent sx={{ p: 3.5 }}>
      <Box sx={{
        width: 52, height: 52, borderRadius: 2.5,
        background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
        boxShadow: '0 6px 18px rgba(108,99,255,0.25)',
      }}>
        {React.cloneElement(icon, { sx: { color: 'white', fontSize: 24 } })}
      </Box>
      <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Poppins", sans-serif', mb: 1 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" lineHeight={1.65}>{desc}</Typography>
    </CardContent>
  </Card>
);

const HomePage = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 40%, #EDE9FE 100%)' }}>
      <Navbar />

      {/* Hero */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 12 }, textAlign: 'center', px: 2 }}>
        <FloatingBlob sx={{ width: 500, height: 500, top: -150, left: -150, background: 'radial-gradient(circle, #6C63FF, transparent)' }} />
        <FloatingBlob sx={{ width: 400, height: 400, bottom: -100, right: -100, background: 'radial-gradient(circle, #00D4AA, transparent)' }} />
        <FloatingBlob sx={{ width: 300, height: 300, top: '30%', left: '60%', background: 'radial-gradient(circle, #8B84FF, transparent)' }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Chip label="🚀 Connecting Innovators & Investors" sx={{ mb: 3, fontWeight: 600, fontSize: '0.82rem', px: 1 }} />
          <Typography variant="h2" fontWeight={800} sx={{
            fontFamily: '"Poppins", sans-serif',
            fontSize: { xs: '2.4rem', sm: '3rem', md: '3.8rem' },
            lineHeight: 1.15, mb: 2.5,
            background: 'linear-gradient(135deg, #1A1040 0%, #6C63FF 50%, #00D4AA 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Where Ideas Meet Investment
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto', mb: 4.5, lineHeight: 1.7, fontWeight: 400, fontSize: { xs: '1rem', md: '1.1rem' } }}>
            Submit your innovative ideas, connect with investors, and turn your vision into reality on Ideanomics Hub.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button component={Link} to="/register" variant="contained" size="large" endIcon={<ArrowForward />}
              sx={{ px: 4, py: 1.5, fontSize: '1rem', boxShadow: '0 8px 30px rgba(108,99,255,0.4)' }}>
              Get Started Free
            </Button>
            <Button component={Link} to="/login" variant="outlined" size="large" sx={{ px: 4, py: 1.5, fontSize: '1rem' }}>
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 }, px: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Poppins", sans-serif', mb: 1.5 }}>Everything you need</Typography>
          <Typography color="text.secondary">A complete platform for idea creators and investors</Typography>
        </Box>
        <Grid container spacing={3}>
          {[
            { icon: <EmojiObjects />, title: 'Submit Ideas', desc: 'Creators can submit their innovative ideas with full descriptions, categories, and tags to reach the right investors.', gradient: 'linear-gradient(135deg, #6C63FF, #8B84FF)' },
            { icon: <TrendingUp />, title: 'Smart Investment', desc: 'Investors discover curated ideas, unlock detailed plans, and connect with promising creators to invest strategically.', gradient: 'linear-gradient(135deg, #00D4AA, #34D399)' },
            { icon: <Security />, title: 'Secure Platform', desc: 'Premium access with verified payments ensures only serious investors unlock confidential idea details.', gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
            { icon: <Groups />, title: 'Thriving Community', desc: 'Like, comment, collaborate and build meaningful connections between creators and investors.', gradient: 'linear-gradient(135deg, #EC4899, #F472B6)' },
          ].map((f, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <FeatureCard {...f} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.06), rgba(0,212,170,0.04))', py: { xs: 6, md: 8 }, px: 2 }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Poppins", sans-serif', mb: 2 }}>
            Ready to innovate?
          </Typography>
          <Typography color="text.secondary" mb={4}>Join thousands of creators and investors on Ideanomics Hub.</Typography>
          <Button component={Link} to="/register" variant="contained" size="large" endIcon={<ArrowForward />}
            sx={{ px: 5, py: 1.5, boxShadow: '0 8px 30px rgba(108,99,255,0.35)' }}>
            Create Free Account
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', py: 3, px: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">© 2025 Ideanomics Hub · All rights reserved</Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
