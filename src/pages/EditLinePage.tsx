import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import EditLineForm from "../components/edit/editlineForm";
import FieldMainLineEditor from "../components/edit/MainLineEditor/MainLineEditor";
import {
  PageContent,
  PageHeader,
  PageWithNavigation,
} from "../layout/PageWithNavigation";
import { routeObject } from "../routes/AdminRoutes";
import { requestCompositions } from "../store/actions";
import { getMishnaForEdit } from "../store/actions/mishnaEditActions";

const mapStateToProps = (state) => ({
  currentMishna: state.general.currentMishna,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getCompositions: () => {
    dispatch(requestCompositions());
  },
  getMishnaForEdit: (tractate, chapter, mishna) => {
    dispatch(getMishnaForEdit(tractate, chapter, mishna));
  },
});

const EditLinePage = (props) => {
  const [lineObj, setLineObj] = useState(null);

  const { getMishnaForEdit, currentMishna, getCompositions } = props;
  const { tractate, chapter, mishna, line } = useParams<routeObject>();

  useEffect(() => {
    getCompositions();
  }, []);

  useEffect(() => {
    const lineObj = currentMishna?.lines?.find(
      (lineItem) => lineItem.lineNumber === line
    );
    setLineObj(lineObj);
  }, [currentMishna]);

  useEffect(() => {
    getMishnaForEdit(tractate, chapter, mishna);
    return () => {};
  }, [line]);

  return (
    <PageWithNavigation linkPrefix="/admin/edit" afterNavigateHandler={()=>{window.scrollTo(0,0)}}>
      <PageHeader></PageHeader>
      <PageContent>
        <EditLineForm
          //@ts-ignore
          mainLine={lineObj?.mainLine}
          line={lineObj}
          currentMishna={currentMishna}
        />
      </PageContent>
    </PageWithNavigation>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditLinePage);
