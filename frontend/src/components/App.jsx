import React from 'react';
import NotFound from './notFound.jsx';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './loginPage.jsx'
import Navbar from './navbar.jsx';
import MainPage from './mainPage/index.jsx';
import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import { useState } from 'react';
import { Provider } from 'react-redux';
import store from '../slices/index.js';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const WelcomeComponent = () => {
  const location = useLocation();

  return (
    location.pathname === 'login'
      ? <h1 className="text-center mt-5 mb-4">Welcome to the Veroled's Chat!</h1>
      : null
    );
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <div className='d-flex flex-column h-100'>
            <Navbar />
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <WelcomeComponent/>
              <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="/" element={<MainPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
          </AuthProvider>
        </BrowserRouter>
      </Provider>
  );
};

export default App;