import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { MantineProvider } from '@mantine/core'

import App from './App.jsx'
import { store } from './store/index.js'
import { theme } from './theme.js'

import '@mantine/core/styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </Provider>
  </React.StrictMode>,
)