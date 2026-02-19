import React, { useEffect } from 'react';
import { Grid, useTheme } from '@mui/material';
import MainText from '../components/MishnaView/MainText';
import MishnaText from '../components/MishnaView/MishnaText';
import { connect } from 'react-redux';
import MishnaViewOptions from '../components/MishnaView/MishnaViewOptions';
import { useParams } from 'react-router';
import { getHTMLFromRawContent } from '../inc/editorUtils';
import { iMishna } from '../types/types';
import { routeObject } from '../store/reducers/navigationReducer';
import { RichTextsMishnas } from '../services/pageService';
import { getRichMishnaiotForChapter, setMishnaViewOptions } from '../store/actions/mishnaViewActions';
import { useStickyOptions } from '../contexts/StickyOptionsContext';

const DEFAULT_OPTIONS = {
  showSugiaName: false,
};
const mapStateToProps = (state) => ({
  mishnaiot: state.mishnaView.mishnaiot,
  richTextMishnas: state.mishnaView.richTextMishnas,
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
}

const ChapterPage = (props: Props) => {
  const { mishnaiot, richTextMishnas, setViewOptions, getRichMishnaiotForChapter } = props;
  const { tractate, chapter, mishna } = useParams<routeObject>();
  const t = useTheme();
  const { setOptionsComponent } = useStickyOptions();

  // Register the options component with the context
  useEffect(() => {
    setOptionsComponent(<MishnaViewOptions />);
  }, [setOptionsComponent]);

  useEffect(() => {
    setViewOptions();
  }, [setViewOptions]);

  useEffect(() => {
    getRichMishnaiotForChapter(tractate, chapter, true);
  }, [mishna, chapter, tractate, getRichMishnaiotForChapter]);

  // Sort mishnaiot by mishna number to ensure correct order
  const sortedMishnaiot = [...mishnaiot].sort((a, b) => {
    return parseInt(a.mishna) - parseInt(b.mishna);
  });

  return (
    <Grid container spacing={2} sx={{ marginTop: 0 }}>
      <Grid item md={12} sx={{ paddingTop: '0 !important' }}>
        <Grid container justifyContent="center" item sm={12}>
          <Grid item md={12}>
            {richTextMishnas.map((mishna, index) => (
              <MishnaText
                key={mishna.mishna}
                mishna={mishna.mishna}
                html={getHTMLFromRawContent(mishna?.richTextMishna)}
              />
            ))}
          </Grid>
        </Grid>
        {sortedMishnaiot.map((mishna, index) => {
          return <MainText key={index} lines={mishna?.lines} mishna={mishna?.mishna} />;
        })}
      </Grid>
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ChapterPage);
