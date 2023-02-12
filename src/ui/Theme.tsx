import { createTheme } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';
import { createBreakpoints } from '@mui/system';
import { PaletteMode } from '@mui/material';
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      smallTitle: React.CSSProperties;
      selectionColor: React.CSSProperties;
    };
    links: {
      linkButton: React.CSSProperties;
    };
    buttons: {
      narrow: React.CSSProperties;
    };
    editor: {
      default: React.CSSProperties;
      inEdit: React.CSSProperties;
      excerpt: React.CSSProperties;
      decorators: {
        add: React.CSSProperties;
      }
    },
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    custom?: {
      smallTitle?: React.CSSProperties;
      selectionColor?: React.CSSProperties;
    };
    links?: {
      linkButton?: React.CSSProperties;
    };
    buttons?: {
      narrow?: React.CSSProperties;
    };
    editor?: {
      default: React.CSSProperties;
      inEdit: React.CSSProperties;
      excerpt: React.CSSProperties;
      decorators: {
        add: React.CSSProperties;
      }
    },
  }
}
declare module '@mui/material/styles' {
  interface TypographyVariants {
    tab: React.CSSProperties;
    lineNumber: React.CSSProperties;
    sourceReference: React.CSSProperties;
    manuscript: React.CSSProperties;
    title: React.CSSProperties;
    category: React.CSSProperties;
    smallTitle: React.CSSProperties;
    h2Roboto: React.CSSProperties;
    h3Roboto: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    tab?: React.CSSProperties;
    lineNumber?: React.CSSProperties;
    sourceReference?: React.CSSProperties;
    manuscript?: React.CSSProperties;
    title?: React.CSSProperties;
    category?: React.CSSProperties;
    smallTitle?: React.CSSProperties;
    h2Roboto: React.CSSProperties;
    h3Roboto: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    tab: true;
    lineNumber: true;
    sourceReference: true;
    manuscript: true;
    title: true;
    category: true;
    smallTitle: true;
    h2Roboto: true;
    h3Roboto: true;
  }
}

export const themeConstants = {
  fixedTopPadding: '8.5rem',
  blue: blue[400],
  typography: {
    h1: {
      fontSize: '3rem',
    },
  },
  links: {
    noStyle: {
      textDecoration: 'none',
      color: 'blue',
    },
  },
};

const breakpoints = createBreakpoints({});

const theme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
            // primary: amber,
            // divider: amber[200],
            text: {
              primary: grey[900],
              secondary: grey[800],
            },
            // background: {
            //   default:'white',
            //   paper: deepOrange[900],
            // },
          }
        : {
            // palette values for dark mode
            // primary: deepOrange,
            // divider: deepOrange[700],
            // background: {
            //   default: deepOrange[900],
            //   paper: deepOrange[900],
            // },
            text: {
              primary: grey[400],
              secondary: grey[500],
            },
          }),
      primary: { main: '#3f51b5' },
    },
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h2Roboto: 'h2',
            h3Roboto: 'h3',
          },
        },
      },
    },
    direction: 'rtl',
    custom: {
      smallTitle: {
        color: '#795548',
      },
      ...(mode === 'light' ? {
        selectionColor: {background:'#f2ff7385'},
      } : {
        selectionColor: {background:'#252710'},
      })
    },
    editor: {
      ...(mode === 'light' ? {
        default: {},
        inEdit: { background: 'white' },
        excerpt: { background: '#ffd400', color: 'green' },
        decorators: {
          add: {
            color: 'blue'
          }
        }
      } : {
        default: { 
         color: grey[400]
        },
        inEdit: { background: grey[800] },
        excerpt: { background: '#ffd400', color: 'black' },
        decorators: {
          add: {
            color: '#6f8bff'
          }
        }
      })
    },
    typography: {
      fontFamily: [
        'Frank Ruhl Libre',
        '-apple-system',
        'BlinkMacSystemFont',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h1: {
        fontSize: themeConstants.typography.h1.fontSize,
        fontWeight: 'bold',
        [breakpoints.down('md')]: {
          fontSize: '2rem',
        },
      },
      h2: {
        fontSize: '1.7rem',
        [breakpoints.down('sm')]: {
          fontSize: '1.2rem',
        },
      },
      h2Roboto: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: '1.7rem',
        [breakpoints.down('sm')]: {
          fontSize: '1.2rem',
        },
      },
      h3: {
        fontSize: '1.2rem',
        fontWeight: 300,
      },
      h3Roboto: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: '1.2rem',
        fontWeight: 300,
      },
      tab: {
        textTransform: 'none',
        fontWeight: 700,
        fontSize: '1rem',
      },
      lineNumber: {
        display: 'inline-block',
        fontSize: '0.7rem',
        color: 'grey',
        padding: '0.25rem',
        minWidth: '2rem',
      },
      sourceReference: {
        fontSize: '0.7rem',
        padding: '0.2rem',
      },
      manuscript: {
        fontWeight: 'bold',
        color: '#3f51b5',
        padding: '0.2rem',
      },
      title: {
        fontFamily: 'Merriweather,  sans-serif;',
      },
      category: {
        fontSize: '0.8rem',
        fontWeight: 'bold',
        fontFamily: 'Merriweather,  sans-serif;',
        padding: '0.3rem 1rem',
        background: 'black',
        color: 'white',
      },
      smallTitle: {
        fontWeight: 'bold',
        color: '#795548',
      },

      //  fontSize: 20
    },
    links: {
      linkButton: {
        background: `${themeConstants.blue}`,
        color: 'white',
        fontWeight: 'bold',
        padding: '0.4rem 1rem',
        borderRadius: '0.5rem',
        transition: 'background 0.3s, box-shadow 0.3s',
        //@ts-ignore
        '&:hover': {
          background: '#ceebff',
          color: `${themeConstants.blue}`,
          textDecoration: 'none',
          boxShadow: '#0000004d 0rem 0.1rem 0.4rem 0.2rem',
        },
      },
    },
    buttons: {
      narrow: {
        padding: '5px 10px 5px 0px',
        minWidth: 'auto',
      },
    },
    panels: {
      standard: {
        padding: '1rem',
      },
    },
    layout: {
      verticalCenter: {
        justifyContent: 'space-around',
        flexDirection: 'column',
        height: '100%',
      },
      defaultPadding: {
        padding: '1rem',
      },
      defaultBoxedItem: {
        padding: '1rem',
        marginBottom: '1rem',
      },
      centerFlex: {
        display: 'flex',
        '& > span': {
          alignSelf: 'center',
        },
      },
    },
  });

//theme.palette.augmentColor(theme.palette.extra, 500, 300, 700);
export default theme;
