import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import heroDesktop from '../assets/images/hero.jpeg';
import heroMobile from '../assets/images/Hero1.jpeg';


const Hero = () => {
  const [isAvailable, setIsAvailable] = useState(false);

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
      {/* Imagen de fondo responsiva - Desktop */}
      <div className="absolute inset-0 hidden md:block">
        <img 
          src={heroDesktop}
          className="w-full h-full object-cover object-center"
          alt="Fachada de la casa"
        />
      </div>
      
      {/* Imagen de fondo responsiva - Móvil */}
      <div className="absolute inset-0 block md:hidden">
        <img 
          src={heroMobile}
          className="w-full h-full object-cover object-center"
          alt="Fachada de la casa"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 z-10" />
      
      <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-20">
        {/* ALERTA DINÁMICA */}
        {isAvailable ? (
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 sm:mb-6 animate-bounce">
            <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.2em] text-white">
              ¡Disponible para Alquiler Inmediato!
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-red-400/30 mb-4 sm:mb-6">
            <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="relative inline-flex rounded-full h-full w-full bg-red-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.2em] text-white">
              Alquilado / Reservado
            </span>
          </div>
        )}

        <span className="text-[#C5A059] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4 block">
          Alquiler Mensual Exclusivo
        </span>
        
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 sm:mb-6 leading-tight px-2">
          Tu alquiler<br className="hidden sm:block" /> en <span className="text-[#C5A059]">Yocsina</span>
        </h2>
        
        <p className="max-w-xl lg:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-200 font-light mb-8 sm:mb-10 px-4">
          Descubrí esta gran opción para alquiler, una casa amoblada con todo lo que necesitás en Malagueño, Córdoba.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
          <a 
            href="#reservas" 
            className="bg-[#C5A059] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#b08e4d] transition-all w-full sm:w-auto shadow-lg hover:shadow-xl"
          >
            Agendar Visita
          </a>
          <a 
            href="#contacto" 
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/20 transition-all w-full sm:w-auto"
          >
            Más Información
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;