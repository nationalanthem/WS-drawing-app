import React from 'react'
import { render } from 'react-dom'
import './index.css'
import Canvas from './components/Canvas/Canvas'
import Toolbar from './components/Toolbar'

const App = () => (
  <>
    <Toolbar />
    <Canvas />
  </>
)

render(<App />, document.getElementById('root'))
