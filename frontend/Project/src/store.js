import { configureStore } from '@reduxjs/toolkit' 
import LoginSlice from './slice/LoginSlice'
export default configureStore({ 
reducer: { 
    "login" : LoginSlice
} 
})