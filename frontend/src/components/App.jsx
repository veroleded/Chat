import React from 'react';
import NotFound from './notFound.jsx';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './loginPage.jsx'
import Registration from './regestration.jsx';
import Navbar from './navbar.jsx';
import MainPage from './mainPage/index.jsx';
import { AuthContext } from '../contexts/index.jsx';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { Provider } from 'react-redux';
import store from '../slices/index.js';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser ? { username: currentUser.username } : null);
  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username });
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  return (
    <AuthContext.Provider value={{
      logIn, logOut, getAuthHeader, user,
    }}
    >
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
      <BrowserRouter>
        <AuthProvider>
          <div className='d-flex flex-column h-100'>
            <Navbar />
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <WelcomeComponent/>
              <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="/" element={<MainPage />} />
                <Route path='signup' element={<Registration />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
          <ToastContainer theme="dark"/>
          </AuthProvider>
        </BrowserRouter>
  );
};

export default App;