import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ScrollToTop from './utils/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import './App.css'

import Navbar from './components/Navbar/Navbar';
import PoomsaeSigma from './components/Poomsae/PoomsaeSigma';
import PoomsaeLayout from './components/Poomsae/PoomsaeLayout/PoomsaeLayout';

import SparringSigma from './components/Sparring/SparringSigma';
import SparringLayout from './components/Sparring/SparringLayout/SparringLayout';
import LoginForm from './components/Auth/LoginForm';
import Match from './components/Match/Match';

function App() {
  const location = useLocation();
  return (
    <div className="App">
      <ScrollToTop />
      {/* Hiện Navbar nếu KHÔNG ở trang đăng nhập/đăng ký */}
      {!(
        location.pathname.includes('sigma') ||
        location.pathname === '/login' ||
        location.pathname === '/sign-up-account'
      ) && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/match" />} />
        <Route path="/match" element={<Match />} />

        <Route path="/login" element={<LoginForm />} />
        <Route path="/sign-up-account" element={<div>Sign Up Page</div>} />

        <Route path='/poomsae/layout' element={<PoomsaeLayout />} />
        <Route path="/poomsae/sigma" element={<PoomsaeSigma />} />

        <Route path='/sparring/layout' element={<SparringLayout />} />
        <Route path="/sparring/sigma" element={<SparringSigma />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ marginTop: "0.5rem" }} // chỉ ảnh hưởng toast chứ không phải container
        style={{ top: "60px" }} // dịch toàn bộ container xuống
      />
    </div >
  );
}

export default App
