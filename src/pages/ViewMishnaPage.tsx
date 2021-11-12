import React from "react";
import { Footer } from "../layout/Footer";
import {
  PageContent,
  PageHeader,
  PageWithNavigation,
} from "../layout/PageWithNavigation";
import MishnaPage from "./MishnaPage";



const ViewMishnaPage = () => {

  return (
    <PageWithNavigation linkPrefix="/talmud">
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



