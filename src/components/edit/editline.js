import React, { useState, useEffect } from 'react';
import Layout from '../layout';
import EditLineForm from './editlineForm';
import { Container } from '@material-ui/core';
import PageService from '../../services/pageService';
import { navigate } from "gatsby"
import { requestCompositions, requestTractates } from "../../store/actions"

import { connect } from "react-redux"
import ChooseMishnaBar from '../shared/ChooseMishnaBar';

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
    const { tractate, chapter, mishna, line, tractates, getTractates,getCompositions,
      currentMishna} = props;

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
      return ()=>{
      }

    }, [line]);


    
 
    const onLineSelected = link => {
      if (link) {
        navigate(`/admin/edit/${link.tractate}/${link.chapter}/${link.mishna}/${link.line}`)
      }
    }
  

    return (
        <Layout>
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
          

        </Layout>
    );

}

export default connect(mapStateToProps, mapDispatchToProps)(EditLine)
