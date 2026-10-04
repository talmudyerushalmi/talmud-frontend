import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useHomeTheme } from '../../context/home-theme-context';
import HomeSharedContent from './HomeSharedContent';

const HomePage = () => {
  const { themeId } = useHomeTheme();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/', title: 'Homepage' });
  }, []);

  return <HomeSharedContent themeId={themeId} />;
};

export default HomePage;
