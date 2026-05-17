import React from 'react';
import { Box, Typography } from '@mui/material';
import { Rabbi } from '../../services/tagging.service';
import { RabbiInfoChips } from './RabbiInfoChips';

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
    <RabbiInfoChips rabbi={rabbi} />
  </Box>
));
