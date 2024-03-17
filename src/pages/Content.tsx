import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';

import { useParams } from 'react-router';
import { routeObject } from '../store/reducers/navigationReducer';
import ContentService from '../services/content.service';
import { Content } from '../content/types';
import ContentField from '../content/ContentField';






const ContentPage = () => {
  const { tractate, chapter, mishna } = useParams<routeObject>();

  const [content, setContent] = useState<Content|null>(null)
  useEffect(()=>{

    ContentService.GetContent("3ok9sYTx6RApf5klH223c4").then(c => {console.log(c); setContent(c)})
    function fetch(){
      
    }
  },[])

  return (
    <Grid container spacing={2}>

{content?.fields ? 
Object.entries(content.fields).map(([k,v]) => {

  console.log('entry',k,v)
  return <ContentField key={k} fieldName={k} fieldValue={v}/>})
:
 null}
{/* {JSON.stringify(Object.entries(content?.fields))} */}

      {/* {content?.fields.entries()((field=><ContentField/>))} */}
    


      </Grid>
  );
};

export default ContentPage;
