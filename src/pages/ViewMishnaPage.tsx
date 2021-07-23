import React from "react";
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
    </PageWithNavigation>
  );
};

export default ViewMishnaPage;



