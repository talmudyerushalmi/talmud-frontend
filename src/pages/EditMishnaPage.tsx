import React from "react";
import {
  PageContent,
  PageHeader,
  PageWithNavigation,
} from "../layout/PageWithNavigation";
import MishnaPage from "./MishnaPage";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useState } from "react";
import EditMishna from "../components/edit/EditMishna/EditMishna";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const EditMishnaPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <PageWithNavigation linkPrefix="/admin/edit">
      <PageHeader>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="עריכה" {...a11yProps(0)} />
            <Tab label="תצוגה" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
      </PageHeader>
      <PageContent>
        <TabPanel value={value} index={0}>
          <EditMishna></EditMishna>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <MishnaPage></MishnaPage>
        </TabPanel>
      </PageContent>
    </PageWithNavigation>
  );
};

export default EditMishnaPage;


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && 
          (<>{children}</>)
      }
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
