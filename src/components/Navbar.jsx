import React, { useState } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Orden lógico de la página
  const menuItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Galería', href: '#galeria' },
    { name: 'Comodidades', href: '#comodidades' },
    { name: 'Ubicación', href: '#ubicacion' },
    { name: 'Reservar Cita', href: '#reservas' },

  ];

  return (
    <nav className="fixed w-full z-[100] px-4 md:px-10 py-5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300">
        
        {/* LOGO */}
        <h1 className="font-serif text-xl md:text-2xl tracking-tighter text-gray-900">
          Alquiler<span className="text-[#C5A059]">Yocsina</span>
        </h1>

        {/* MENU DESKTOP */}
        <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-600">
          {menuItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="hover:text-[#C5A059] transition-colors duration-300"
            >
              {item.name}
            </a>
          ))}
          
          {/* BOTÓN CONSULTAR - ANCLA AL FINAL */}
          <a 
            href="#contacto" 
            className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl hover:bg-[#C5A059] transition-all duration-300 shadow-lg shadow-black/10"
          >
            CONSULTAR
          </a>

          {/* ACCESO ADMIN DISCRETO */}
          <Link 
            to="/admin" 
            className="ml-2 text-[9px] text-gray-400 hover:text-gray-900 transition-colors"
          >
            ADMIN
          </Link>
        </div>

        {/* BOTÓN MOBILE */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden text-2xl text-gray-800 p-2"
        >
          {isOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* MOBILE MENU (Glassmorphism) */}
      {isOpen && (
        <div className="lg:hidden mt-2 p-6 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl flex flex-col gap-5 animate-in fade-in slide-in-from-top-5">
          {menuItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              onClick={() => setIsOpen(false)} 
              className="text-sm font-bold uppercase tracking-widest text-gray-700 border-b border-black/5 pb-2"
            >
              {item.name}
            </a>
          ))}
          <a 
            href="#contacto" 
            onClick={() => setIsOpen(false)} 
            className="bg-[#1A1A1A] text-white text-center py-4 rounded-2xl font-bold uppercase text-xs tracking-widest"
          >
            Enviar Consulta
          </a>
          <Link 
            to="/admin" 
            onClick={() => setIsOpen(false)} 
            className="text-[10px] text-center text-gray-400 uppercase font-bold"
          >
            Panel Administrativo
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;