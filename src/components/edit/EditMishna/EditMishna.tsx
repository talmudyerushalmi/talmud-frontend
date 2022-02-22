import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { connect } from "react-redux";
import { requestTractates } from "../../../store/actions";
import { useParams } from "react-router";
import { routeObject } from "../../../routes/AdminRoutes";
import {
  getMishnaForEdit,
} from "../../../store/actions/mishnaEditActions";
import EditMishnaForm from "./EditMishnaForm";

const mapStateToProps = (state) => ({
  compositions: state.general.compositions,
  excerptDialogOpen: state.mishnaEdit.excerptDialogOpen,
  mishnaDoc: state.general.currentMishna,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getTractates: () => {
    dispatch(requestTractates());
  },
  getMishnaForEdit: (tractate, chapter, mishna) => {
    dispatch(getMishnaForEdit(tractate, chapter, mishna));
  },
});

const EditMishna = (props) => {
  const {
    getMishnaForEdit,
    mishnaDoc,
  } = props;
  const { tractate, chapter, mishna } = useParams<routeObject>();

  useEffect(() => {
  }, []);

  useEffect(() => {
    getMishnaForEdit(tractate, chapter, mishna);
    return () => {};
  }, [tractate, chapter, mishna]);




  return (
    <>
        <Grid container>
          <EditMishnaForm/>
        </Grid>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMishna);
