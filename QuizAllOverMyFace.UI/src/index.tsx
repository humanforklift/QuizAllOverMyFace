import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'typeface-roboto'
import './shared-components/theme/App.css'
import { messageWarning } from 'shared-components/material-ui-modals'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
    onUpdate: () => messageWarning(
        {
            content: 'The system has been updated. Please close all instances of the system and open it again to have the new version. Until that, you may experience instability.',
            title: 'App updated'
        })
})