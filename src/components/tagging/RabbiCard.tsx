import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Rabbi } from '../../services/tagging.service';

interface RabbiCardProps {
  rabbi: Rabbi;
  clickable: boolean;
  onClick?: () => void;
}

export const RabbiCard = React.memo(({ rabbi, clickable, onClick }: RabbiCardProps) => (
  <Box
    onClick={() => clickable && onClick?.()}
    sx={{
      mb: 1,
      p: 1.5,
      borderRadius: 1,
      border: '1px solid',
      borderColor: clickable ? 'primary.main' : 'divider',
      cursor: clickable ? 'pointer' : 'default',
      '&:hover': clickable ? { backgroundColor: 'action.hover' } : {},
    }}>
    <Typography variant="body2" fontWeight="bold" mb={0.25}>
      {rabbi.displayName}
    </Typography>
    {rabbi.fullnameVariants.length > 0 && (
      <Typography variant="caption" color="text.secondary" display="block" mb={0.5} sx={{ lineHeight: 1.4 }}>
        ({rabbi.fullnameVariants.join(' / ')})
      </Typography>
    )}
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
  </Box>
));
