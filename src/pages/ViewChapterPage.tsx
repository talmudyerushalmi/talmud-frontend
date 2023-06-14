import React, { useEffect } from 'react';
import { Footer } from '../layout/Footer';
import { PageContent, PageHeader, PageWithNavigation } from '../layout/PageWithNavigation';
import ChapterPage from './ChapterPage';

const ViewChapterPage = () => {

  return (
    <PageWithNavigation
      allChapterAllowed={true}
      linkPrefix="/talmud"
      afterNavigateHandler={() => {
        TagManager.dataLayer({
          dataLayer: {
            event: 'page_view',
            pagePath: window.location.href,
            title: 'chapter-view',
          },
        });
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
