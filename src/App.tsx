import React from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box } from '@mui/material'
import { store } from './store'
import Chat from './Chat'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f8b800',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#34B7F1',
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#3b4a54',
      secondary: '#667781',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, "Lucida Grande", Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f0f2f5',
        },
      },
    },
  },
})

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: 'background.default',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Chat />
        </Box>
      </ThemeProvider>
    </Provider>
  )
}