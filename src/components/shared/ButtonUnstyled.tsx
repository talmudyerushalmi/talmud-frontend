import React, { FC, ReactNode } from 'react';
import { Box } from '@mui/material';

interface iProps {
  children: string | number | ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const ButtonUnstyled: FC<iProps> = ({ children, onClick, disabled }) => {
  return (
    <Box
      component="button"
      sx={{
        background: 'none',
        color: 'inherit',
        border: 'none',
        padding: 0,
        font: 'inherit',
        cursor: disabled ? 'default' : 'pointer',
        outline: 'inherit',
      }}
      disabled={disabled}
      onClick={onClick}>
      {children}
    </Box>
  );
};

export default ButtonUnstyled;
