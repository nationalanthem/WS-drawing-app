import { createSlice, configureStore } from '@reduxjs/toolkit'

const initialToolsState = {
  strokeStyle: 'black',
  lineWidth: 5,
  displayToolbar: true,
}

const initialCanvasState = {
  readyToClear: false,
  canvasDataUrl: null,
}

const toolsSlice = createSlice({
  name: 'tools',
  initialState: initialToolsState,
  reducers: {
    setStrokeStyle: (state, action) => {
      state.strokeStyle = action.payload
    },
    setLineWidth: (state, action) => {
      state.lineWidth = action.payload
    },
    setToolbarDisplay: (state, action) => {
      state.displayToolbar = action.payload
    },
  },
})

const canvasSlice = createSlice({
  name: 'canvas',
  initialState: initialCanvasState,
  reducers: {
    setClearState: (state, action) => {
      state.readyToClear = action.payload
    },
    setCanvasDataUrl: (state, action) => {
      state.canvasDataUrl = action.payload
    },
  },
})

export const { setStrokeStyle, setLineWidth, setToolbarDisplay } = toolsSlice.actions
export const { setClearState, setCanvasDataUrl } = canvasSlice.actions

export default configureStore({
  reducer: { tools: toolsSlice.reducer, canvas: canvasSlice.reducer },
})
