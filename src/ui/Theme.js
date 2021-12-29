import { createMuiTheme } from "@material-ui/core/styles"
import createBreakpoints from "@material-ui/core/styles/createBreakpoints"
import blue from '@material-ui/core/colors/blue';

export const themeConstants = {
  fixedTopPadding: '8.5rem',
  blue: blue[400],
  typography: {
    h1: {
      fontSize: '3rem'
    }
  },
  links: {
    noStyle: {

      textDecoration: 'none',
      color: 'blue'
    }
  }

}

const breakpoints = createBreakpoints({})

const theme = createMuiTheme({
  direction: "rtl",

  palette: {
    mainMenu: '#3f51b5'
   // primary: red,
  },
  typography: {
    h1: {
      fontSize: themeConstants.typography.h1.fontSize,
      fontWeight: "bold",
      [breakpoints.down("sm")]: {
        fontSize: "2rem",
      },
    },
    h2: {
      fontSize: "1.7rem",
      [breakpoints.down("sm")]: {
        fontSize: "1.2rem",
      },
    },
    h3: {
      fontSize: "1.2rem",
      fontWeight: 300,
    },
    tab: {
      textTransform: "none",
      fontWeight: 700,
      fontSize: "1rem",
    },
    lineNumber: {
      display: "inline-block",
      fontSize: "0.7rem",
      color: "grey",
      padding: "0.25rem",
      minWidth: "2rem"
    },
    sourceReference: {
      fontSize: "0.7rem",
      padding: "0.2rem",
    },
    manuscript: {
      fontWeight: "bold",
      color: "#3f51b5",
      padding: "0.2rem",
    },
    title: {
      fontFamily: "Merriweather,  sans-serif;",
    },
    category: {
      fontSize: "0.8rem",
      fontWeight: "bold",
      fontFamily: "Merriweather,  sans-serif;",
      padding: "0.3rem 1rem",
      background: "black",
      color: "white",
    },
    smallTitle: {
      fontWeight: "bold"
    }

    //  fontSize: 20
  },
  links: {
    linkButton: {
      background: `${themeConstants.blue}`,
      color: "white",
      fontWeight: "bold",
      padding: "0.4rem 1rem",
      borderRadius: "0.5rem",
      transition: "background 0.3s, box-shadow 0.3s",
      "&:hover": {
        background: "#ceebff",
        color: `${themeConstants.blue}`,
        textDecoration: "none",
        boxShadow: "#0000004d 0rem 0.1rem 0.4rem 0.2rem",
      },
    },
  },
  buttons: {
    narrow: {
      padding: "5px 10px 5px 0px",
      minWidth: "auto",
    },
  },
  panels: {
    standard:{
      padding: '1rem',
    },

  },
  layout: {
    verticalCenter: {
      justifyContent: "space-around",
      flexDirection: "column",
      height: "100%",
    },
    defaultPadding: {
      padding: "1rem",
    },
    defaultBoxedItem: {
      padding: "1rem",
      marginBottom: "1rem",
    },
    centerFlex: {
      display: "flex",
      "& > span": {
        alignSelf: "center",
      },
    },
  },
})

//theme.palette.augmentColor(theme.palette.extra, 500, 300, 700);

export default theme
