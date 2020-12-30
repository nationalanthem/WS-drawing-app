import React, { useState } from 'react'
import { Slider } from '@material-ui/core'
import { setLineWidth } from '../../features'
import { useDispatch } from 'react-redux'

export const SizeSlider = () => {
  const [value, setValue] = useState(5)
  const dispatch = useDispatch()

  const handleChange = (event, newValue) => {
    dispatch(setLineWidth(newValue))
    setValue(newValue)
  }

  return <Slider value={value} min={1} max={50} className="slider" onChange={handleChange} />
}
