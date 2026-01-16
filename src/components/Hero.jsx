import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

const Hero = () => {
  const [isAvailable, setIsAvailable] = useState(false);

  // Escuchar cambios en la configuración del sitio (Admin)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "configuracion", "estado_villa"), (doc) => {
      if (doc.exists()) {
        setIsAvailable(doc.data().disponible);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
      <img 
        src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/454983844.jpg?k=cf697988ed1b9db1af47800bf3196623b1ac5babab68a7907ade48bc90d6ec38&o=" 
        className="absolute inset-0 w-full h-full object-cover"
        alt="Fachada de Villa Amanecer"
      />
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      <div className="relative z-20 text-center text-white px-4 py-16 mt-20">
        {/* ALERTA DINÁMICA */}
        {isAvailable && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-bounce">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white">
              ¡Disponible para Alquiler Inmediato!
            </span>
          </div>
        )}

        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-sm mb-4 block animate-slide-up">
          Alquiler Mensual Exclusivo
        </span>
        
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
          Tu Refugio de Tranquilidad <br /> en <span className="text-[#C5A059]">Yocsina</span>
        </h2>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 font-light mb-10">
          Descubrí Villa Amanecer, una casa amoblada con todo lo que necesitás en Malagueño, Córdoba.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <a href="#reservas" className="bg-[#C5A059] text-white px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#b08e4d] transition-all w-full md:w-auto">
            Agendar Visita
          </a>
          <a href="#contacto" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/20 transition-all w-full md:w-auto">
            Más Información
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;