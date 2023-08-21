import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


import authReducer from './state/index';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// to store info in local storage
// redux-persistent

import {

  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';


//1. configure persist

const persistConfig={key:"root",storage,version:1};

//2.configure persist reducer

const persistedReducer=persistReducer(persistConfig,authReducer);

//3.make persisted store

const store=configureStore({
  reducer:persistedReducer,
  middleware:(getDefaultMiddleware)=>
  getDefaultMiddleware({
    serializableCheck:{
      ignoreActions:[FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,PURGE,REGISTER]
    }
  })
  
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App/>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

