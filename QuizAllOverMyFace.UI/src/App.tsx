import React, { Component } from 'react'
import MainPage from './features/main-page/MainPage'
import DateFnsUtils from '@date-io/date-fns'
import MuiPickersUtilsProvider from '@material-ui/pickers/MuiPickersUtilsProvider'
import { theme } from 'shared-components/theme/theme'
import { GlobalStoreContext, GlobalStore } from './features/shared/stores/GlobalStore'
import { setModalTheme } from 'shared-components/material-ui-modals'
import { ErrorBoundary } from 'shared-components/error-boundary'
import { setCacheKey } from 'shared-components/utils/cache'
import { MuiThemeProvider } from '@material-ui/core/styles'
import 'App.css'

setModalTheme(theme)
setCacheKey(process.env.REACT_APP_CACHE_KEY as string)

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <GlobalStoreContext.Provider value={new GlobalStore()}>
          <MuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <MainPage />
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </GlobalStoreContext.Provider >
      </ErrorBoundary>
    )
  }
}

export default App