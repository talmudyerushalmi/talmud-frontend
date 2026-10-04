import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import HomeSharedContent from './HomeSharedContent';

const HomePage = () => {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/', title: 'Homepage' });
  }, []);

  return <HomeSharedContent />;
};

export default HomePage;
