import React, { useState } from 'react'
import { Slider } from '@material-ui/core'

export const SizeSlider = () => {
  const [value, setValue] = useState(5)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return <Slider value={value} min={1} max={20} className="slider" onChange={handleChange} />
}
