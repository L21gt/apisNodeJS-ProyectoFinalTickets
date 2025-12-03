import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext'; 

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EventDetails from './pages/EventDetails';
import Checkout from './pages/Checkout';
import MyTickets from './pages/MyTickets';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cart from './pages/Cart';
import PurchaseConfirmation from './pages/PurchaseConfirmation';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100"> {/* TRUCO: Contenedor Flex */}
          <ToastContainer position="top-right" autoClose={3000} />
          <Navbar />
          
          <div className="container mt-3 flex-grow-1"> {/* flex-grow-1 empuja el footer */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/confirmation" element={<PurchaseConfirmation />} />
              
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* RUTAS LEGALES */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
            </Routes>
          </div>

          <Footer /> {/* El Footer va aquí al final */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;