import React, { useState, useEffect } from 'react';
import EditLineForm from './editlineForm';
import { Container } from '@mui/material';
import PageService from '../../../services/pageService';
import { requestCompositions, requestTractates } from '../../../store/actions';
import { connect } from 'react-redux';
import ChooseMishnaBarContainer from '../../shared/ChooseMishna/ChooseMishnaBarContainer';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { iLink } from '../../../types/types';

const mapStateToProps = (state: any) => ({
  tractates: state.navigation.tractates,
  currentMishna: state.navigation.currentMishna,
});

const mapDispatchToProps = (dispatch: any) => ({
  getCompositions: () => {
    dispatch(requestCompositions());
  },
  getTractates: () => {
    dispatch(requestTractates());
  },
});

const EditLine = (props: any) => {
  const [lineObj, setLineObj] = useState<any>({});

  const { getTractates, getCompositions, currentMishna } = props;
  const { tractate, chapter, mishna, line } = useParams<any>();
  const navigate = useNavigate();

  useEffect(() => {
    getTractates();
    getCompositions();
  }, [getTractates, getCompositions]);

  useEffect(() => {
    async function fetch() {
      if (tractate && chapter && mishna) {
        const result = await PageService.getMishnaEdit(tractate, chapter, mishna);
        const lineObj = result.mishnaDoc.lines?.find((lineItem: any) => lineItem.lineNumber === line);
        setLineObj(lineObj);
      }
    }
    fetch();
  }, [tractate, chapter, mishna, line]);

  const onLineSelected = (link: iLink) => {
    if (link) {
      navigate(`/admin/edit/${link.tractate}/${link.chapter}/${link.mishna}/${link.lineNumber}`);
    }
  };

  return (
    <Container>
      <ChooseMishnaBarContainer onNavigationUpdated={onLineSelected} />
      <EditLineForm line={lineObj} currentMishna={currentMishna} />
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditLine);
