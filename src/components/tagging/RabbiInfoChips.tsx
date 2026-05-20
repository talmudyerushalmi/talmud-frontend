import React from 'react';
import { Box, Chip } from '@mui/material';
import { Rabbi } from '../../services/tagging.service';

/**
 * Renders a horizontal row of small outlined chips describing a rabbi's
 * type / generation / location / city. Each chip is conditionally rendered
 * based on whether the corresponding field is populated on the Rabbi.
 *
 * Shared by `RabbiCard` (in this folder) and `TaggedSidebar`
 * (in `../MishnaView/`). Keep these in sync via this component.
 */
export const RabbiInfoChips: React.FC<{ rabbi: Rabbi }> = ({ rabbi }) => (
  <Box display="flex" flexWrap="wrap" gap={0.5}>
    {rabbi.type && (
      <Chip label={rabbi.type} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
    )}
    {rabbi.generation && (
      <Chip label={`דור ${rabbi.generation}`} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
    )}
    {rabbi.location && (
      <Chip label={rabbi.location} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
    )}
    {rabbi.city && (
      <Chip label={rabbi.city} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
    )}
  </Box>
);
