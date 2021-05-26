import React, { useState, useEffect } from 'react';
import EditLineForm from './editlineForm';
import { Container } from '@material-ui/core';
import PageService from '../../services/pageService';
import { requestCompositions, requestTractates } from "../../store/actions"

import { connect } from "react-redux"
import ChooseMishnaBar from '../shared/ChooseMishnaBar';
import { useHistory, useParams } from 'react-router';

const mapStateToProps = state => ({
  tractates:state.general.tractates,
  currentMishna: state.general.currentMishna
  });

  const mapDispatchToProps = (dispatch, ownProps) => ({
    getCompositions: () => {
      dispatch(requestCompositions())
    },
    getTractates: () => {
      dispatch(requestTractates())
    },
  })
  
const EditLine = (props) => {
    const [lineObj, setLineObj] = useState({});
    const [tractateSettings, setTractateSettings] = useState({
      synopsisAllowed:[],
      synopsisList:[]
    });
    const { tractates, getTractates,getCompositions,
      currentMishna} = props;
    const { tractate, chapter, mishna, line } = useParams();
    const history = useHistory();

    useEffect(() => {
      getTractates();
      getCompositions();
    }, [])


    useEffect( () => {
      async function fetch() {
        const result = await PageService.getMishnaEdit(tractate, chapter, mishna);
        const lineObj = result.data.mishnaDoc.lines?.find(lineItem => lineItem.lineNumber === line);
        setTractateSettings(result.data.tractateSettings);
        setLineObj(lineObj);
      }
       fetch();

    }, [line]);


    
 
    const onLineSelected = link => {
      if (link) {
        history.push(`/admin/edit/${link.tractate}/${link.chapter}/${link.mishna}/${link.line}`)
      }
    }
  

    return (
            <Container>
          <ChooseMishnaBar
            onNavigationSelected={onLineSelected}
          />
            <EditLineForm
            mainLine={lineObj?.mainLine}
            tractateSettings={tractateSettings}
            line={lineObj}
            currentMishna={currentMishna}
            />
            </Container>
          

    );

}

export default connect(mapStateToProps, mapDispatchToProps)(EditLine)
