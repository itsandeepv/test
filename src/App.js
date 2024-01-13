import React, { useState } from 'react';
import './App.css';
import ResponsiveDrawer from './navigations/navigationContainer.tsx';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { LoginScreen } from './screens/login/loginScreen.tsx';
import { InvalidURL } from './screens/error/invalidURL.tsx';

import { useDispatch, useSelector } from 'react-redux';
import { selectData } from './Redux/features/login/loginSlicer.js'
function App() {
  const loginStatus = useSelector(selectData);
  console.log("loginStatus>>", loginStatus?.items[0])
  return (
    <div className="App">
      {
        !loginStatus.loginStatus ?
          <Router>
            <Routes>
              <Route path='/*' element={<InvalidURL />} />
              <Route path='/' element={<LoginScreen />} />
            </Routes>
          </Router>
          :
          <Router>
            <ResponsiveDrawer />
          </Router>
      }
    </div>
  );
}

export default App;
