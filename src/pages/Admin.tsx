import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const Admin = () => {
  return (
    <div>
      admin page
      <Button color="primary">Hello World</Button>;
      <Link
        to={{
          pathname: '/',
        }}
      >
        Home
      </Link>
    </div>
  );
};

export default Admin;
