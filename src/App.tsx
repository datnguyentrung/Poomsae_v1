import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './utils/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import './App.css'

import Navbar from './components/Navbar/Navbar';
import PoomsaeSigma from './components/Poomsae/PoomsaeSigma';

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path='/poomsae/list' element={<div>Poomsae List Page</div>} />
        <Route path="/poomsae/sigma" element={<PoomsaeSigma />} />

        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/sign-up-account" element={<div>Sign Up Page</div>} />
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
