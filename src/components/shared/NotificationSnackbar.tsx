import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarState } from '../../hooks/useSnackbar';

interface Props {
  snackbar: SnackbarState;
  onClose: () => void;
  autoHideDuration?: number;
}

const NotificationSnackbar: React.FC<Props> = ({ 
  snackbar, 
  onClose, 
  autoHideDuration = 4000 
}) => {
  return (
    <Snackbar 
      open={snackbar.open} 
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
