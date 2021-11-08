import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import EditLineForm from "../components/edit/editlineForm";
import FieldMainLineEditor2 from "../components/edit/MainLineEditor/MainLineEditor2";
import {
  PageContent,
  PageHeader,
  PageWithNavigation,
} from "../layout/PageWithNavigation";
import { routeObject } from "../routes/AdminRoutes";
import PageService from "../services/pageService";
import { requestCompositions } from "../store/actions";

const mapStateToProps = (state) => ({
  currentMishna: state.general.currentMishna,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getCompositions: () => {
    dispatch(requestCompositions());
  },
});


const EditLinePage = (props) => {
  const [lineObj, setLineObj] = useState(null);
  const [tractateSettings, setTractateSettings] = useState({
    synopsisAllowed: [],
    synopsisList: [],
  });
  const { getCompositions, currentMishna } = props;
  const { tractate, chapter, mishna, line } = useParams<routeObject>();

  useEffect(() => {
  }, []);

  useEffect(() => {
    async function fetch() {
      const result = await PageService.getMishnaEdit(tractate, chapter, mishna);
      const lineObj = result.mishnaDoc.lines?.find(
        (lineItem) => lineItem.lineNumber === line
      );
      setTractateSettings(result.tractateSettings);
      setLineObj(lineObj);
    }
    fetch();
  }, [line]);

  return (
    <PageWithNavigation linkPrefix="/admin/edit">
      <PageHeader></PageHeader>
      <PageContent>
        <FieldMainLineEditor2   lineData={lineObj}/>
        <EditLineForm
          //@ts-ignore
          mainLine={lineObj?.mainLine}
          tractateSettings={tractateSettings}
          line={lineObj}
          currentMishna={currentMishna}
        />
      </PageContent>
    </PageWithNavigation>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditLinePage);
