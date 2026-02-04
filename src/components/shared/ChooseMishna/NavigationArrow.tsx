import React from 'react';
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface NavigationArrowProps {
  direction: 'back' | 'forward';
  isHebrew: boolean;
  onClick: () => void;
}

/**
 * Shared navigation arrow component
 * Handles RTL/LTR direction automatically
 */
const NavigationArrow: React.FC<NavigationArrowProps> = ({ direction, isHebrew, onClick }) => {
  // In Hebrew (RTL): forward shows left arrow, back shows right arrow
  // In English (LTR): forward shows right arrow, back shows left arrow
  const showForwardIcon = isHebrew ? direction === 'back' : direction === 'forward';
  
  return (
    <IconButton onClick={onClick} size="small">
      {showForwardIcon ? <ArrowForward /> : <ArrowBack />}
    </IconButton>
  );
};

export default NavigationArrow;
