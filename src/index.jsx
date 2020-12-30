import React from 'react'
import { render } from 'react-dom'
import './index.css'
import Canvas from './components/Canvas/Canvas'
import Toolbar from './components/Toolbar'
import store from './features'
import { Provider } from 'react-redux'

const App = () => (
  <React.StrictMode>
    <Provider store={store}>
      <Toolbar />
      <Canvas />
    </Provider>
  </React.StrictMode>
)

render(<App />, document.getElementById('root'))
