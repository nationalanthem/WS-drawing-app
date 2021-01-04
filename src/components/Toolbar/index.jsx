import React from 'react'
import './index.css'
import { ColorPicker } from './ColorPicker'
import { SizeSlider } from './SizeSlider'
import { ClearCanvas } from './ClearCanvas'
import { SaveCanvas } from './SaveCanvas'
import { useSelector } from 'react-redux'
import { Slide } from '@material-ui/core'

const Toolbar = () => {
  const displayToolbar = useSelector((state) => state.tools.displayToolbar)

  return (
    <Slide in={displayToolbar} timeout={300}>
      <div className="toolbar">
        <ColorPicker />
        <SizeSlider />
        <ClearCanvas />
        <SaveCanvas />
      </div>
    </Slide>
  )
}

export default Toolbar
