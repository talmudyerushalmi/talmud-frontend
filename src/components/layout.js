/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { ThemeProvider } from "@material-ui/styles"
import theme, { themeConstants } from "../ui/Theme"

import Header from "./header"
import "./layout.css"
import Loader from "./misc/Loader"
import { RTL } from "../ui/RTL"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  root: {
    direction: "rtl",
    minHeight: "100vh",
    backgroundImage: props => `url(${props.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'top',
    '&::before': {
      content: '"some content"',
      position: '"absolute"',
      top: 0,
      left: 0,
      width: "100%",
      height: "103%",
      position: 'absolute',
      backdropFilter: 'blur(5px)',
      zIndex: 0    
    }
  },
  main: {
    paddingTop: themeConstants.fixedTopPadding,
    position: 'relative',
    zIndex: 1
  }
})

const Layout = props => {
  const classes = useStyles(props);
  const { children, loading, image } = props
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <RTL>
        <ThemeProvider theme={theme}>
          <Header siteTitle={data.site.siteMetadata.title} />
          <div className={classes.root}>
            {loading ? <Loader></Loader> : null}
            <main className={classes.main}>
              {children}
            </main>
            <footer style={{position:'relative'}}>© {new Date().getFullYear()}</footer>
          </div>
        </ThemeProvider>
      </RTL>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
