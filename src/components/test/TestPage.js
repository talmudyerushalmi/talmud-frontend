import React from "react"

import Layout from "../layout"
import SEO from "../seo"
import { connect } from "react-redux"
import { Box, Container, Grid, Typography } from "@material-ui/core"

const mapStateToProps = state => ({
  
})
const mapDispatchToProps = (dispatch, ownProps) => ({
 
})

const Height=()=> {
    return (
      <Box height="100%" width="100%">
        <Box height="25%" bgcolor="grey.300" mx={0.5} width={80} display="inline-block">
          Height 25%
        </Box>
        <Box height="50%" bgcolor="grey.300" mx={0.5} width={80} display="inline-block">
          Height 50%
        </Box>
        <Box height="75%" bgcolor="grey.300" mx={0.5} width={80} display="inline-block">
          Height 75%
        </Box>
        <Box height="100%" bgcolor="grey.300" mx={0.5} width={80} display="inline-block">
          Height 100%
        </Box>
      </Box>
    );
  }

  const lines = [1,2,3,4,5,6,6,7,8,8,9,23,4,234,4,234,234,324,2344,5,6,6,7,8,8,9,23,4,234,4,234,234,324,2344,5,6,6,7,8,8,9,23,4,234,4,234,234,324,234]
const TestPage = props => {
  //const { } = props

 
  return (
    <Layout >
      <SEO title="Page client" />
      <Container>
       <Grid container>
           <Grid item={12}>
               <div>wide
               <p>sdfdsfdsfdsfds dsfsdfsdf sdfsd dsf sdf</p>
               <p>sdfdsfdsfdsfds dsfsdfsdf sdfsd dsf sdf</p>
               <p>sdfdsfdsfdsfds dsfsdfsdf sdfsd dsf sdf</p>

               </div>
           </Grid>
           
           </Grid>   
      <Grid style={{height:'100%'}} container>

      <Grid item sm={4}>
          {
              lines.map(a=>
                <Typography>line</Typography>
                )
          }
          </Grid>
          <Grid item sm={4}>
          <Height></Height>
          </Grid>
          <Grid item sm={4}>
         <div style={{top:'0',
         height:`98vh`,
         position:'sticky', background:'grey'}}>
             sticky
         </div>
          </Grid>
      </Grid>
      </Container>
     
     
      
     
    </Layout>
  )
}

export default connect(mapStateToProps,mapDispatchToProps)(TestPage)
