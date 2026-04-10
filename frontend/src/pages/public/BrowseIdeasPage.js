import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Grid, TextField, InputAdornment,
  Chip, Stack, CircularProgress, Pagination
} from '@mui/material';
import { Search } from '@mui/icons-material';
import DashboardPage from '../../components/layout/DashboardPage';
import IdeaCard from '../../components/ideas/IdeaCard';
import API from '../../utils/api';

const CATEGORIES = ['All', 'Technology', 'AI', 'Healthcare', 'Agriculture', 'Education', 'Finance', 'Other'];

const BrowseIdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await API.get('/ideas', { params });
      setIdeas(data.ideas);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);
  useEffect(() => { setPage(1); }, [search, category]);

  return (
    <DashboardPage>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Poppins", sans-serif', mb: 0.5 }}>
          Browse Ideas
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Discover {total} innovative ideas from creators and investors
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search ideas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: { xs: '100%', sm: 260 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
        />
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat} label={cat} clickable size="small"
              color={category === cat ? 'primary' : 'default'}
              variant={category === cat ? 'filled' : 'outlined'}
              onClick={() => setCategory(cat)}
              sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}
            />
          ))}
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
      ) : ideas.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontFamily: '"Poppins", sans-serif' }}>No ideas found</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>Try adjusting your search or filters</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2.5}>
            {ideas.map((idea) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idea._id}>
                <IdeaCard idea={idea} />
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
          )}
        </>
      )}
    </DashboardPage>
  );
};

export default BrowseIdeasPage;
