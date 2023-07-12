import React, { useCallback, useEffect, useState } from 'react';
import ChooseTractate from './ChooseTractate';
import ChooseChapter from './ChooseChapter';
import ChooseMishna from './ChooseMishna';
import { iMishnaForNavigation, leanLine } from '../ChooseMishna';
import { iChapter, iLink, iTractate } from '../../../types/types';
import ChooseLine from './ChooseLine';
import { Box } from '@mui/material';
import { debounce } from 'lodash';

const DEBOUNCE_NAVIGATION_CHANGES = 50;

interface Props {
  initValues: iLink;
  onNavigationUpdated: Function;
}

const ChooseMishnaForm = (props: Props) => {
  const { initValues, onNavigationUpdated } = props;
  const [tractateName, setTractateName] = useState<string>(initValues.tractate);
  const [chapterName, setChapterName] = useState<string>(initValues.chapter);
  const [mishnaName, setMishnaName] = useState<string>(initValues.mishna);
  const [lineNumber, setLineNumber] = useState<string>(initValues?.lineNumber || '');
  const [tractateData, setTractateData] = useState<iTractate | null>(null);
  const [chapterData, setChapterData] = useState<iChapter | null>(null);
  const [mishnaData, setMishnaData] = useState<iMishnaForNavigation | null>(null);
  const [lineData, setLineData] = useState<leanLine | null>(null);

  const emit = useCallback(
    debounce((link) => {
      onNavigationUpdated(link);
    }, DEBOUNCE_NAVIGATION_CHANGES),
    []
  );

  useEffect(() => {
    const link: iLink = {
      tractate: tractateName,
      chapter: chapterName,
      mishna: mishnaName,
    };
    if (lineData) {
      link.lineNumber = lineData.lineNumber;
    }

    emit(link);
    emit(link);
    emit(link);
  }, [mishnaData, lineData]);

  return (
    <>
      <Box mb={2} sx={{ display: 'flex', flexGrow: 10 }}>
        <ChooseTractate
          tractate={tractateName}
          onSelectTractate={(t) => {
            setTractateName(t.id);
            setTractateData(t);
          }}
        />
        <ChooseChapter
          chapter={chapterName}
          inTractate={tractateData}
          onSelectChapter={(c) => {
            setChapterName(c.id);
            setChapterData(c);
          }}
        />
        <ChooseMishna
          mishna={mishnaName}
          inChapter={chapterData}
          onSelectMishna={(m) => {
            setMishnaData(m);
            setMishnaName(m.mishna);
          }}
        />

        {lineNumber ? (
          <ChooseLine
            lineNumber={lineNumber}
            mishnaData={mishnaData}
            onSelectLine={(l) => {
              setLineNumber(l.lineNumber);
              setLineData(l);
            }}
          />
        ) : null}
      </Box>
    </>
  );
};

export default ChooseMishnaForm;
