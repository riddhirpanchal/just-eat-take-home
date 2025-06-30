import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    _placeholder: (state = {}) => state,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export default store