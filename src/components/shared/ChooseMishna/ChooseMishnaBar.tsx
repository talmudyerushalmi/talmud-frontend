import React from 'react';
import { Button, Grid, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChooseMishnaForm from './ChooseMishnaForm';
import { PrintHeader } from '../PrintHeader';
import { iLink, iTractate } from '../../../types/types';
import SearchBar from './SearchBar';

interface ChooseMishnaBarProps {
  // Data passed from parent
  allTractates: iTractate[];
  currentNavigation: iLink;
  initValues: iLink;
  currentTractate?: string;

  // Settings
  allChapterAllowed?: boolean;
  keypressNavigation?: boolean;

  // Callbacks
  onNavigationUpdated: (navigation: iLink) => void;
  onButtonNavigation?: (nav: iLink) => void;
  onSubmit?: (navigation: iLink) => void;
  onSearch?: (searchValue: string, tractate?: string) => void;
}

const ChooseMishnaBar = ({
  allTractates,
  currentNavigation,
  initValues,
  currentTractate,
  allChapterAllowed = false,
  keypressNavigation = false,
  onNavigationUpdated,
  onButtonNavigation = () => {},
  onSubmit,
  onSearch,
}: ChooseMishnaBarProps) => {
  const { t } = useTranslation();

  const handleNavigate = (navigation: iLink) => {
    if (onSubmit) {
      onSubmit(navigation);
    } else {
      onNavigationUpdated(navigation);
    }
  };

  const selectButtonDisabled = () => {
    return !currentNavigation.tractate || !currentNavigation.chapter || !currentNavigation.mishna;
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleNavigate(currentNavigation);
        }}
        className="choose-mishna-bar-form">
        <Grid container>
          <Box sx={{ display: 'flex', flexGrow: 10 }}>
            <ChooseMishnaForm
              allChapterAllowed={allChapterAllowed}
              keypressNavigation={keypressNavigation}
              onNavigationUpdated={onNavigationUpdated}
              onButtonNavigation={onButtonNavigation}
              initValues={initValues}
              allTractates={allTractates}
            />
          </Box>
          <Box mb={2} sx={{ display: 'flex', flexGrow: 1 }}>
            <Button
              sx={{ width: '100%' }}
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => handleNavigate(currentNavigation)}
              disabled={selectButtonDisabled()}>
              {t('Go')}
            </Button>
          </Box>
        </Grid>
      </form>
      <SearchBar tractate={currentTractate} onSearch={onSearch} />
      {/* Print version */}
      <PrintHeader allTractates={allTractates} />
    </>
  );
};

export default ChooseMishnaBar;
