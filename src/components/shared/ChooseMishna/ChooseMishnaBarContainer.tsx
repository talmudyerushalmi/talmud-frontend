import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setRoute } from '../../../store/actions/navigationActions';
import { routeObject } from '../../../store/reducers/navigationReducer';
import { iLink, iTractate } from '../../../types/types';
import { useAppSelector } from '../../../app/hooks';
import { objectToBase64 } from '../../../inc/objectToBase64';
import PageService from '../../../services/pageService';
import ChooseMishnaBar from './ChooseMishnaBar';

interface ChooseMishnaBarContainerProps {
  allChapterAllowed?: boolean;
  keypressNavigation?: boolean;
  onNavigationUpdated: Function;
  onButtonNavigation?: (nav: iLink) => void;
  setRoute: (tractate: string, chapter: string, mishna: string, line: string) => void;
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  setRoute: (tractate: string, chapter: string, mishna: string, line: string) => {
    dispatch(setRoute(tractate, chapter, mishna, line));
  },
});

const ChooseMishnaBarContainer = ({
  allChapterAllowed = false,
  keypressNavigation = false,
  onNavigationUpdated,
  onButtonNavigation = () => {},
  setRoute,
}: ChooseMishnaBarContainerProps) => {
  const { tractate, chapter, mishna, line } = useParams<routeObject>();
  const navigate = useNavigate();
  const currentTractate = useAppSelector((state) => state.navigation?.currentMishna?.tractate);

  const [navigation, setNavigation] = useState<iLink>({
    tractate: tractate || '',
    chapter: chapter || '',
    mishna: mishna || '',
    lineNumber: line || '',
  });

  const [allTractates, setAllTractates] = useState<iTractate[]>([]);

  useEffect(() => {
    PageService.getAllTractates().then((tractates) => setAllTractates(tractates));
  }, []);

  // Sync navigation state with router params
  useEffect(() => {
    setNavigation({
      tractate: tractate || '',
      chapter: chapter || '',
      mishna: mishna || '',
      lineNumber: line || '',
    });
  }, [tractate, chapter, mishna, line]);

  const handleNavigationUpdated = (newNavigation: iLink) => {
    setNavigation(newNavigation);
    onNavigationUpdated(newNavigation);
  };

  const handleSearch = (searchValue: string, tractate?: string) => {
    navigate(`/search?query=${objectToBase64({ text: searchValue, tractate: tractate || currentTractate })}`);
  };

  const memoizedProps = useMemo(() => {
    return {
      tractate: tractate || '',
      chapter: chapter || '',
      mishna: mishna || '',
      lineNumber: line || '',
    };
  }, [tractate, chapter, mishna, line]);

  return (
    <ChooseMishnaBar
      allTractates={allTractates}
      currentNavigation={navigation}
      initValues={memoizedProps}
      currentTractate={currentTractate}
      allChapterAllowed={allChapterAllowed}
      keypressNavigation={keypressNavigation}
      onNavigationUpdated={handleNavigationUpdated}
      onButtonNavigation={onButtonNavigation}
      onSearch={handleSearch}
    />
  );
};

export default connect(() => ({}), mapDispatchToProps)(ChooseMishnaBarContainer);
