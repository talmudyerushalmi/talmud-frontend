import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementIcon from '@mui/icons-material/Announcement';

const sidebarItems = [{ text: 'בדיקת הערות', icon: <AnnouncementIcon /> }];

const CommentsAdminPage: FC = () => {
  return (
    <Box display="flex">
      <Drawer
        sx={{
          width: 200,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 200, boxSizing: 'border-box' },
        }}
        variant="permanent">
        <Toolbar />
        <Divider />
        <List>
          {sidebarItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Outlet />
    </Box>
  );
};

export default CommentsAdminPage;
