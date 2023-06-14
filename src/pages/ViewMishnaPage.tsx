import React, { useEffect } from 'react';
import ReactGA from 'react-ga4'
import { Footer } from '../layout/Footer';
import { PageContent, PageHeader, PageWithNavigation } from '../layout/PageWithNavigation';
import MishnaPage from './MishnaPage';

const ViewMishnaPage = () => {
  useEffect(()=>{
    useEffect(() => {
      ReactGA.send({ hitType: 'pageview', page: '/talmud/yevamot', title: 'ViewMishnaPage' });
    }, []);
  },[])

  return (
    <PageWithNavigation
      allChapterAllowed={true}
      linkPrefix="/talmud"
      afterNavigateHandler={() => {
        window.scrollTo(0, 0);
      }}>
      <PageHeader></PageHeader>
      <PageContent>
        <MishnaPage></MishnaPage>
      </PageContent>
      <Footer />
    </PageWithNavigation>
  );
};

export default ViewMishnaPage;
