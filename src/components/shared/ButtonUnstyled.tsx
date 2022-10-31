import React, { FC, ReactNode } from 'react';
import { Box } from '@mui/material';

interface iProps {
  children: string | number | ReactNode;
  onClick?: () => void;
}

const ButtonUnstyled: FC<iProps> = ({ children, onClick }) => {
  return (
    <Box
      component="button"
      sx={{
        background: 'none',
        color: 'inherit',
        border: 'none',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

export default ButtonUnstyled;
