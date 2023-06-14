import React, { useEffect } from 'react';
import ReactGA from 'react-ga4'
import { Footer } from '../layout/Footer';
import { PageContent, PageHeader, PageWithNavigation } from '../layout/PageWithNavigation';
import ChapterPage from './ChapterPage';

const ViewChapterPage = () => {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/talmud/*', title: 'ViewChapterPage' });
  }, []);
  
  return (
    <PageWithNavigation
      allChapterAllowed={true}
      linkPrefix="/talmud"
      afterNavigateHandler={() => {
        window.scrollTo(0, 0);
      }}
    >
      <PageHeader></PageHeader>
      <PageContent>
        <ChapterPage />
      </PageContent>
      <Footer />
    </PageWithNavigation>
  );
};

export default ViewChapterPage;
