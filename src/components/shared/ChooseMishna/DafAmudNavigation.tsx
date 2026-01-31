import React from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import ChooseDaf, { leanDaf } from './ChooseDaf';
import ChooseAmud from './ChooseAmud';
import amudDafMapping from '../../../data/amud_daf_mapping.json';

interface DafAmudNavigationProps {
  isHebrew: boolean;
  navButtons: boolean;
  dafName: string;
  amudName: string;
  dafData: leanDaf | null;
  tractateData: any;
  tractateName: string;
  isNavigating: boolean;
  setDafName: (value: string) => void;
  setAmudName: (value: string) => void;
  setDafData: (value: leanDaf | null) => void;
  setChapterName: (value: string) => void;
  setMishnaName: (value: string) => void;
  setLineNumber: (value: string) => void;
  onNavigationUpdated: (nav: any) => void;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
}

const DafAmudNavigation: React.FC<DafAmudNavigationProps> = ({
  isHebrew,
  navButtons,
  dafName,
  amudName,
  dafData,
  tractateData,
  tractateName,
  isNavigating,
  setDafName,
  setAmudName,
  setDafData,
  setChapterName,
  setMishnaName,
  setLineNumber,
  onNavigationUpdated,
  onNavigateBack,
  onNavigateForward,
}) => {
  return (
    <>
      {/* Separator or space */}
      <Box sx={{ width: '8px' }} />

      {/* Navigation arrows for Daf/Amud */}
      {navButtons ? (
        <IconButton onClick={onNavigateBack} size="small">
          {isHebrew ? <ArrowForward /> : <ArrowBack />}
        </IconButton>
      ) : null}

      {/* Daf selector */}
      <ChooseDaf
        daf={dafName}
        inTractate={tractateData?.title_heb || ''}
        onSelectDaf={(d) => {
          const dafChanged = d.id !== dafName;
          setDafName(d.id);
          setDafData(d);
          // Clear amud when daf changes (only if not navigating)
          if (dafChanged && !isNavigating) {
            setAmudName('');
          }
        }}
      />

      {/* Amud selector */}
      <ChooseAmud
        amud={amudName}
        inDaf={dafData}
        inTractate={tractateData?.title_heb || ''}
        onSelectAmud={(amud, mapping) => {
          setAmudName(amud);
          // Navigate to the mapped chapter/halacha (mishna level only)
          setChapterName(mapping.chapter);
          setMishnaName(mapping.halacha);
          // Clear line number to navigate to mishna level only
          setLineNumber('');
          
          // Trigger navigation to mishna level with Daf/Amud marker info
          onNavigationUpdated({
            tractate: tractateName,
            chapter: mapping.chapter,
            mishna: mapping.halacha,
            lineNumber: '',
            dafAmudMarkers: [{
              line: mapping.system_line,
              daf: dafName,
              amud: amud,
            }],
          });
        }}
      />

      {/* Navigation arrows for Daf/Amud */}
      {navButtons ? (
        <IconButton onClick={onNavigateForward} size="small">
          {isHebrew ? <ArrowBack /> : <ArrowForward />}
        </IconButton>
      ) : null}
    </>
  );
};

export default DafAmudNavigation;
