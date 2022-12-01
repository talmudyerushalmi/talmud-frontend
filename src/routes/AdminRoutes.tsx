import React from 'react';
import { Route } from 'react-router-dom';
import { ConfirmSignIn, ForgotPassword, RequireNewPassword, SignIn, withAuthenticator } from 'aws-amplify-react';
import theme from '../ui/Theme';
import EditMishnaPage from '../pages/EditMishnaPage';
import EditLinePage from '../pages/EditLinePage';
import RequireAuth from '../components/login/RequireAuth';

export type routeObject = {
  tractate: string;
  chapter: string;
  mishna: string;
  line: string;
};
export const AdminRoutes = () => {
  return <Route path="test" element={<h3>sddsfdsf</h3>}></Route>;
};

export default AdminRoutes;
