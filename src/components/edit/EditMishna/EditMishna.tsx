import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { routeObject } from '../../../routes/AdminRoutes';
import { getEditSettings } from '../../../store/actions/mishnaEditActions';
import EditMishnaForm from './EditMishnaForm';
import { getMishna } from '../../../store/actions/navigationActions';

const mapStateToProps = (state) => ({
  compositions: state.navigation.compositions,
  excerptDialogOpen: state.mishnaEdit.excerptDialogOpen,
  mishnaDoc: state.navigation.currentMishna,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getEditSettings: (tractate, chapter, mishna) => {
    dispatch(getEditSettings(tractate, chapter, mishna));
  },
  getMishna: (tractate, chapter, mishna) => {
    dispatch(getMishna(tractate, chapter, mishna));
  },
});

const EditMishna = (props) => {
  const { getEditSettings, getMishna } = props;
  const { tractate, chapter, mishna } = useParams<routeObject>();

  useEffect(() => {}, []);

  useEffect(() => {
    getEditSettings(tractate, chapter, mishna);
    getMishna(tractate, chapter, mishna);
    return () => {};
  }, [tractate, chapter, mishna]);

  return (
    <>
      <Grid container>
        <EditMishnaForm />
      </Grid>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMishna);
