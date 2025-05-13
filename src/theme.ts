'use client'

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#F9A825',
        contrastText: '#181818',
      },
      secondary: {
        main: '#181818',
        contrastText: '#F9A825',
      },
      background: {
        default: '#181818',
        paper: '#232323',
      },
      text: {
        primary: '#F9A825',
        secondary: '#fff',
      },
    },
    typography: {
      fontFamily: '"Oswald", "Roboto Condensed", "Montserrat", "Arial", sans-serif',
      fontWeightBold: 900,
      h1: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 },
      h2: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 },
      h3: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 },
      button: { fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            borderRadius: 8,
          },
          containedPrimary: {
            color: '#181818',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#232323',
          },
        },
      },
    },
  })
  export default theme;
