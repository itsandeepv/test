import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import loginReducer from './features/login/loginSlicer.js'
import sideBarMenuReducer from './features/sideBarMenu/sideBarMenuSlicer.js'
import googleLocationSlicer from './features/googleLocation/googleLocationSlicer.js';
const reducers = combineReducers({
  login: loginReducer,
  tabName: sideBarMenuReducer,
  location: googleLocationSlicer
});

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
});

export default store;