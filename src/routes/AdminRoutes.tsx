import React from 'react';
import { Route } from 'react-router-dom';
import EditLine from '../components/edit/EditLine';
import EditMishna from '../components/edit/EditMishna/EditMishna';
import { ConfirmSignIn, ForgotPassword, RequireNewPassword, SignIn, withAuthenticator } from 'aws-amplify-react';
import theme from '../ui/Theme';

export const AdminRoutes = () => {

    return (
        <>
        <Route path="/admin/edit/:tractate/:chapter/:mishna/:line" exact component={EditLine}/>
        <Route path="/admin/edit/:tractate/:chapter/:mishna" exact component={EditMishna}/>
        </>
    );
}

export default withAuthenticator(AdminRoutes,true, [
    <SignIn/>,
    <ConfirmSignIn/>,
    <ForgotPassword/>,
    <RequireNewPassword />,
],null, theme)