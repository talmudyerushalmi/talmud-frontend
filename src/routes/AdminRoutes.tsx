import React from 'react';
import { Route } from 'react-router-dom';
import EditLine from '../components/edit/EditLine';
import { ConfirmSignIn, ForgotPassword, RequireNewPassword, SignIn, withAuthenticator } from 'aws-amplify-react';
import theme from '../ui/Theme';
import EditMishnaPage from '../pages/EditMishnaPage';

export interface routeObject {
    tractate: string;
    chapter: string;
    mishna: string;
    line: string;
}
export const AdminRoutes = () => {

    return (
        <>
        <Route path="/admin/edit/:tractate/:chapter/:mishna/:line" exact component={EditLine}/>
        <Route path="/admin/edit/:tractate/:chapter/:mishna" exact component={EditMishnaPage}/>
        <Route path="/admin" />
        </>
    );
}

export default withAuthenticator(AdminRoutes,true, [
    <SignIn/>,
    <ConfirmSignIn/>,
    <ForgotPassword/>,
    <RequireNewPassword />,
],null, theme)