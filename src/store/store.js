import { configureStore } from '@reduxjs/toolkit';
import registrationSlice from './slices/RegistartionSlice'

export const store = configureStore({
  name:"store",
  reducer:{
    registration:registrationSlice
  }
});
