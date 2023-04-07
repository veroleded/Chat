import React from 'react';
import NotFound from './notFound.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './loginPage.jsx'
import Navbar from './navbar.jsx';
import MainPage from './mainPage.jsx';
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container p-3">
        <h1 className="text-center mt-5 mb-4">Welcome to the Veroled's Chat!</h1>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;