import React from "react";
import {
  PageContent,
  PageHeader,
  PageWithNavigation,
} from "../layout/PageWithNavigation";
import MishnaPage from "./MishnaPage";
import { Theme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import EditMishnaExcerpts from "../components/edit/EditMishna/EditMishnaExcerpts";
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
            <Tab label="מדורים" {...a11yProps(0)} />
            <Tab label="משנה" {...a11yProps(1)} />
            <Tab label="תצוגה" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
      </PageHeader>
      <PageContent>
        <TabPanel value={value} index={0}>
          <EditMishnaExcerpts></EditMishnaExcerpts>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EditMishna/>
        </TabPanel>
        <TabPanel value={value} index={2}>
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
