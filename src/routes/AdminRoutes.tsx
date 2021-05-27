import React from 'react';
import { Route } from 'react-router-dom';
import EditLine from '../components/edit/EditLine';
import EditMishna from '../components/edit/EditMishna/EditMishna';

export const AdminRoutes = () => {

    return (
        <>
        <Route path="/admin/edit/:tractate/:chapter/:mishna/:line" exact component={EditLine}/>
        <Route path="/admin/edit/:tractate/:chapter/:mishna" exact component={EditMishna}/>
        </>
    );
}