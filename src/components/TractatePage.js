import React, { useEffect, useState } from "react"

import Layout from "./layout"
import SEO from "./seo"
import { Container, Grid } from "@material-ui/core"
import PageService from "../services/pageService"
import ChapterTree from "./tractate/chapterTree"

const TractatePage = (props) => {
  const { tractate } = props;  
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect( () => {
    async function fetch(){
      const result = await PageService.getTractate(tractate);
      setData(result);
      setLoading(false);
    }
    fetch()
  },
  [tractate]);  


  return (
    <Layout loading={loading}>
      <SEO title="Page tractate"/>
      <Container style={{ direction: 'rtl' }}>

      <ChapterTree
          chapters={data.chapters}
          tractate={tractate}
        >
        </ChapterTree>
        <Grid container spacing={2}>
            <Grid item xs={12}>
           

            </Grid>

     
          
        </Grid>

      </Container>
    </Layout>
  )
}


export default TractatePage
