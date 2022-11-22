import { Box, CircularProgress } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';

const Spinner = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: zIndex.modal,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Spinner;
