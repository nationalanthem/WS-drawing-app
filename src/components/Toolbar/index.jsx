import React from 'react'
import './index.css'
import { ColorPicker } from './ColorPicker'
import { SizeSlider } from './SizeSlider'
import { ClearCanvas } from './ClearCanvas'
import { SaveCanvas } from './SaveCanvas'

const Toolbar = () => {
  return (
    <div className="toolbar">
      <ColorPicker />
      <SizeSlider />
      <ClearCanvas />
      <SaveCanvas />
    </div>
  )
}

export default Toolbar
