import { Box, Dialog, IconButton, Typography } from '@mui/material';
import React, { FC, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface IProps {}

const InvitationDialog: FC<IProps> = () => {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Box>
        <IconButton onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          direction: 'ltr',
          p: '20px',
          textAlign: 'center',
          overflowWrap: 'break-word',
        }}>
        <Typography fontSize="30px">
          ערב לימוד ביום השנה הארבעים לפטירת מורנו הגר"ש ליברמן, זכרו לברכה, הערב (30/03/23) בשעה 20:30 קישור לזום -{' '}
        </Typography>
        <Box>
          <a
            href="https://us02web.zoom.us/j/9596672568?pwd=NCsyNUlVdW1QYUdGQjFJT0FBN05ZZz09"
            style={{
              fontSize: '20px',
            }}>
            https://us02web.zoom.us/j/9596672568?pwd=NCsyNUlVdW1QYUdGQjFJT0FBN05ZZz09
          </a>
        </Box>
      </Box>
    </Dialog>
  );
};

export default InvitationDialog;
