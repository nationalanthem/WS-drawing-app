import React from 'react'
import { useDispatch } from 'react-redux'
import { setStrokeStyle } from '../../features'

export const ColorPicker = () => {
  const dispatch = useDispatch()

  const handleChange = (e) => {
    dispatch(setStrokeStyle(e.target.value))
  }

  return <input onChange={handleChange} type="color" />
}
