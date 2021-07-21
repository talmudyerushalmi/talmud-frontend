import React, { useState, useEffect } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import PageService from "../../../services/pageService";
import TextEditorMishna from "./TextEditorMishna2";
import ExcerptList from "./ExcerptList";
import ExcerptDialog from "./ExcerptDialog";
import EditMishnaButtons from "./EditMishnaButtons";
import ExcerptService from "../../../services/excerpt.service";
import ChooseMishnaBar from "../../shared/ChooseMishnaBar";
import { connect } from "react-redux";
import { requestCompositions, requestTractates } from "../../../store/actions";
import { useHistory, useParams } from "react-router";
import { routeObject } from "../../../routes/AdminRoutes";
import { iExcerpt, iMishna } from "../../../types/types";
import { getEmptyExcerpt } from "../../../inc/excerptUtils";
import { getSelectionObject } from "../../../inc/editorUtils";

const mapStateToProps = (state) => ({
  compositions: state.general.compositions,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getCompositions: () => {
    dispatch(requestCompositions());
  },
  getTractates: () => {
    dispatch(requestTractates());
  },
});

const EditMishna = (props) => {
  const { getCompositions, compositions } = props;
  const { tractate, chapter, mishna } = useParams<routeObject>();
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selection, setSelection] = useState({})
  const [excerpt, setExcerpt] = useState<iExcerpt>(getEmptyExcerpt())

  const [mishnaDoc, setMishnaDoc] = useState<iMishna | null>(null);
  const history = useHistory();

  useEffect(() => {
    getCompositions();
  }, [getCompositions]);

  useEffect(() => {
    async function fetch() {
      const result = await PageService.getMishnaEdit(tractate, chapter, mishna);
      const mishnaD = result.data.mishnaDoc;
      setMishnaDoc(mishnaD);
    }
    fetch();
    return () => {};
  }, [tractate, chapter, mishna]);

  const onNavigateTo = (link) => {
    history.push(`/admin/edit/${link.tractate}/${link.chapter}/${link.mishna}`);
  };

  const onAddNewExcerpt = (initialValues) => {
    console.log(initialValues);
    setExcerpt(initialValues);
    setDialogOpen(true);
  };
  const addExcerpt = (initialValues) => {
    console.log(initialValues);
    // setExcerpt(initialValues);
    // setDialogOpen(true);
  };

  const onMishnaSelected = (link) => {
    if (link) {
      onNavigateTo(link);
    }
  };
  return (
    <>
      <Container>
        <ChooseMishnaBar onNavigationSelected={onMishnaSelected} />
        

        <Grid style={{ marginTop: "4rem" }} container>
          <EditMishnaButtons onAddNewExcerpt={onAddNewExcerpt} />
          <ExcerptDialog
            mishna={{ tractate, chapter, mishna }}
            compositions={compositions}
            // selection={excerpt?.selection || getSelectionObject(mishnaEditor)}
            selection={selection}
            excerpt={excerpt}
            onClose={() => {
              setDialogOpen(false)
            }}
            dialogOpen={dialogOpen}
            onAdd={addExcerpt}
          ></ExcerptDialog>
          <Grid item md={8}>
            <TextEditorMishna
              onChangeSelection={(e) => {console.log("change", e); setSelection(e)}}
              mishna={mishnaDoc}
            ></TextEditorMishna>
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
                  // onSelectExcerpt(excerpt);
                }}
                onDelete={(excerpt) => {
                  //deleteExcerpt(excerpt);
                }}
                onUpdateSelectionForExcerpt={() => {}}
              ></ExcerptList>
              <ExcerptList
                admin={true}
                filter="MAKBILA"
                excerpts={mishnaDoc ? mishnaDoc.excerpts : []}
                onClick={(excerpt) => {
                  // onSelectExcerpt(excerpt);
                }}
                onDelete={(excerpt) => {
                  //deleteExcerpt(excerpt);
                }}
                onUpdateSelectionForExcerpt={() => {}}
              ></ExcerptList>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMishna);
