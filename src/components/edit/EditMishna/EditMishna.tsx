import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import TextEditorMishna from "./TextEditorMishna2";
import ExcerptList from "./ExcerptList";
import ExcerptDialog from "./ExcerptDialog";
import EditMishnaButtons from "./EditMishnaButtons";
import { connect } from "react-redux";
import { requestCompositions, requestTractates } from "../../../store/actions";
import { useParams } from "react-router";
import { routeObject } from "../../../routes/AdminRoutes";
import {
  closeExcerptDialog,
  deleteExcerpt,
  getMishnaForEdit,
  openExcerptDialog,
} from "../../../store/actions/mishnaEditActions";

const mapStateToProps = (state) => ({
  compositions: state.general.compositions,
  excerptDialogOpen: state.mishnaEdit.excerptDialogOpen,
  mishnaDoc: state.general.currentMishna,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getCompositions: () => {
    dispatch(requestCompositions());
  },
  getTractates: () => {
    dispatch(requestTractates());
  },
  getMishnaForEdit: (tractate, chapter, mishna) => {
    dispatch(getMishnaForEdit(tractate, chapter, mishna));
  },
  openExcerptDialog: (excerpt) => dispatch(openExcerptDialog(excerpt)),
  closeExcerptDialog: () => dispatch(closeExcerptDialog),
  deleteExcerpt: (tractate, chapter, mishna, excerpt) =>
    dispatch(deleteExcerpt(tractate, chapter, mishna, excerpt)),
});

const EditMishna = (props) => {
  const {
    getCompositions,
    getMishnaForEdit,
    mishnaDoc,
    compositions,
    excerptDialogOpen,
    openExcerptDialog,
    closeExcerptDialog,
    deleteExcerpt,
  } = props;
  const { tractate, chapter, mishna } = useParams<routeObject>();
  const [selection, setSelection] = useState({});

  useEffect(() => {
    getCompositions();
  }, [getCompositions]);

  useEffect(() => {
    getMishnaForEdit(tractate, chapter, mishna);
    return () => {};
  }, [tractate, chapter, mishna]);

  const onAddNewExcerpt = (initialValues) => {
    const values = {
      ...initialValues,
      selection,
    };
    console.log(values);
    openExcerptDialog(values);
  };

  const onUpdateSelectionForExcerpt = excerpt => {
    excerpt.selection = selection;
    openExcerptDialog(excerpt)
  }
  const addExcerpt = (initialValues) => {
    console.log(initialValues);
    // setExcerpt(initialValues);
    // setDialogOpen(true);
  };

  return (
    <>
        <Grid container>
          <ExcerptDialog
            mishna={{ tractate, chapter, mishna }}
            compositions={compositions}
            // selection={excerpt?.selection || getSelectionObject(mishnaEditor)}
            selection={selection}
            onClose={() => {
              closeExcerptDialog();
            }}
            dialogOpen={excerptDialogOpen}
            onAdd={addExcerpt}
          ></ExcerptDialog>
          <Grid item md={8}>
            <Grid container>
              <Grid item md={1}>
              <EditMishnaButtons onAddNewExcerpt={onAddNewExcerpt} />

              </Grid>
              <Grid item md={11}>
              <TextEditorMishna
              onChangeSelection={(e) => {
                setSelection(e);
              }}
              mishna={mishnaDoc}
            ></TextEditorMishna>
              </Grid>
            </Grid>

          </Grid>
          <Grid item md={4}>
            <div
              style={{
                width: "100%",
                padding: "1rem",
              }}
            >
              <ExcerptList
                admin={true}
                filter="MUVAA"
                excerpts={mishnaDoc ? mishnaDoc.excerpts : []}
                onClick={(excerpt) => {
                  openExcerptDialog(excerpt);
                }}
                onDelete={(excerptId) => {
                  deleteExcerpt(tractate, chapter, mishna, excerptId);
                }}
                onUpdateSelectionForExcerpt={onUpdateSelectionForExcerpt}
              ></ExcerptList>
              <ExcerptList
                admin={true}
                filter="MAKBILA"
                excerpts={mishnaDoc ? mishnaDoc.excerpts : []}
                onClick={(excerpt) => {
                  openExcerptDialog(excerpt);
                }}
                onDelete={(excerptId) => {
                  deleteExcerpt(tractate, chapter, mishna, excerptId);
                }}
                onUpdateSelectionForExcerpt={onUpdateSelectionForExcerpt}
              ></ExcerptList>
               <ExcerptList
                admin={true}
                filter="NOSACH"
                excerpts={mishnaDoc ? mishnaDoc.excerpts : []}
                onClick={(excerpt) => {
                  openExcerptDialog(excerpt);
                }}
                onDelete={(excerptId) => {
                  deleteExcerpt(tractate, chapter, mishna, excerptId);
                }}
                onUpdateSelectionForExcerpt={onUpdateSelectionForExcerpt}
              ></ExcerptList>
            </div>
          </Grid>
        </Grid>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMishna);
