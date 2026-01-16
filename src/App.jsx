import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Componentes de la Web (Landing Page)
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Amenities from './components/Amenities';
import BookingCalendar from './components/BookingCalendar'; // El nuevo calendario que creamos
import Location from './components/Location';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

// Componentes de Administración y Seguridad
import AdminDashboard from './pages/AdminDashboard'; // Nombre actualizado según el último código
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Fix para que la página siempre scrollee al inicio al cambiar de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Estructura de la Landing Page
const Home = () => (
  <div className="bg-white">
    <Navbar />
    <Hero />
    <Gallery />
    <Amenities />
    <Location />
    <BookingCalendar /> 
    <Contact />
    <Footer />
    <ChatBot />
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* RUTA PÚBLICA PRINCIPAL */}
        <Route path="/" element={<Home />} />

        {/* RUTA DE ACCESO ADMIN */}
        <Route path="/login" element={<Login />} />
        
        {/* PANEL DE ADMINISTRACIÓN PROTEGIDO */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* REDIRECCIÓN DE SEGURIDAD */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;