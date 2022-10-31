import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import MainText from '../components/MishnaView/MainText';
import MishnaText from '../components/MishnaView/MishnaText';
import { connect } from 'react-redux';
import MishnaViewOptions from '../components/MishnaView/MishnaViewOptions';
import { useParams } from 'react-router';
import { getHTMLFromRawContent } from '../inc/editorUtils';
import { iMishna } from '../types/types';
import { routeObject } from '../routes/AdminRoutes';
import { RichTextsMishnas } from '../services/pageService';
import { getRichMishnaiotForChapter, setMishnaViewOptions } from '../store/actions/mishnaViewActions';
import useScroll from '../hooks/useScroll';

const DEFAULT_OPTIONS = {
  showSugiaName: false,
};
const mapStateToProps = (state) => ({
  mishnaiot: state.mishnaView.mishnaiot,
  richTextMishnas: state.mishnaView.richTextMishnas,
  loading: state.general.loading,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  setViewOptions: () => {
    dispatch(setMishnaViewOptions(DEFAULT_OPTIONS));
  },
  getRichMishnaiotForChapter: (tractate: string, chapter: string, newChapter?: boolean) => {
    dispatch(getRichMishnaiotForChapter(tractate, chapter, newChapter));
  },
});

interface Props {
  mishnaiot: iMishna[];
  richTextMishnas: RichTextsMishnas[];
  getRichMishnaiotForChapter: Function;
  getMishna: Function;
  setViewOptions: Function;
  loading: boolean;
}

const ChapterPage = (props: Props) => {
  const { mishnaiot, richTextMishnas, setViewOptions, getRichMishnaiotForChapter, loading } = props;
  const { tractate, chapter, mishna } = useParams<routeObject>();
  useScroll(70, () => {
    getRichMishnaiotForChapter(tractate, chapter);
  });

  useEffect(() => {
    setViewOptions();
  }, []);

  useEffect(() => {
    getRichMishnaiotForChapter(tractate, chapter, true);
  }, [mishna, chapter, tractate]);

  return (
    <Grid container spacing={2}>
      <Grid
        item
        md={12}
        sx={{
          ml: 2,
          paddingTop: '0 !important',
          position: 'sticky',
          top: '4rem',
          zIndex: 100,
          background: 'white',
          boxShadow: '0rem 0rem 1rem 2px #0000005e',
        }}
      >
        <MishnaViewOptions />
      </Grid>
      <Grid item md={12}>
        <Grid container justifyContent="center" item sm={12}>
          <Grid item md={12}>
            {richTextMishnas.map((mishna, index) => (
              <MishnaText
                key={mishna.mishna}
                mishna={parseInt(mishna.mishna)}
                html={getHTMLFromRawContent(mishna?.richTextMishna)}
              />
            ))}
          </Grid>
        </Grid>
        {mishnaiot.map((mishna, index) => {
          return <MainText key={index} lines={mishna?.lines} mishna={mishna?.mishna} />;
        })}
      </Grid>
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ChapterPage);
