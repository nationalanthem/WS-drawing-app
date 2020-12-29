import React from 'react'
import './index.css'
import { SizeSlider } from './SizeSlider'
import { ClearCanvas } from './ClearCanvas'
import { SaveCanvas } from './SaveCanvas'

const Toolbar = () => {
  return (
    <div className="toolbar">
      <input type="color" id="color" />
      <SizeSlider />
      <ClearCanvas />
      <SaveCanvas />
    </div>
  )
}

export default Toolbar
