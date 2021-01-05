import React from 'react'
import { render } from 'react-dom'
import './index.css'
import Canvas from './components/Canvas/Canvas'
import Toolbar from './components/Toolbar'
import store from './features'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { nanoid } from 'nanoid'

const App = () => (
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/:canvasId">
          <Provider store={store}>
            <Toolbar />
            <Canvas />
          </Provider>
        </Route>
        <Redirect to={`/${nanoid()}`} />
      </Switch>
    </Router>
  </React.StrictMode>
)

render(<App />, document.getElementById('root'))
