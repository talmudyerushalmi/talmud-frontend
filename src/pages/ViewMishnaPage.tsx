import React, { useEffect } from "react";
import { Footer } from "../layout/Footer";
import {
  PageContent,
  PageHeader,
  PageWithNavigation,
} from "../layout/PageWithNavigation";
import MishnaPage from "./MishnaPage";
import TagManager from 'react-gtm-module';


const ViewMishnaPage = () => {
  useEffect(()=>{
    TagManager.dataLayer({
      dataLayer: {
        event: 'pageview',
        pagePath: window.location.href,
        pageTitle: 'mishna-view',
      },
    });
  },[])

  return (
    <PageWithNavigation linkPrefix="/talmud" afterNavigateHandler={()=>{window.scrollTo(0,0)}}>
      <PageHeader>
      </PageHeader>
      <PageContent>
        <MishnaPage></MishnaPage>
      </PageContent>
      <Footer/>
    </PageWithNavigation>
  );
};

export default ViewMishnaPage;



