import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { Mail, Phone, MapPin, Code2, Heart, Circle } from 'lucide-react';

const Footer = () => {
  const [isAvailable, setIsAvailable] = useState(false);

  // Escuchar el estado de disponibilidad en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "configuracion", "estado_villa"), (snap) => {
      if (snap.exists()) {
        setIsAvailable(snap.data().disponible);
      }
    });
    return () => unsub();
  }, []);

  return (
    <footer className="relative bg-[#F4F4F4] pt-24 pb-12 overflow-hidden">
      {/* Luces de fondo para potenciar el efecto vidrio */}
      <div className="absolute top-0 right-1/3 w-72 h-72 bg-[#C5A059]/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative group">
          {/* Brillo perimetral al pasar el mouse */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C5A059]/30 to-white/0 rounded-[3.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          {/* Panel Liquid Glass */}
          <div className="relative bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3.5rem] p-10 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              {/* BRANDING */}
              <div className="lg:col-span-1">
                <h2 className="text-3xl font-serif text-gray-900 tracking-tighter mb-4 italic">
                  Alquiler<span className="text-[#C5A059] not-italic">Yocsina</span>
                </h2>
                <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-[200px] uppercase tracking-wider">
                  Experiencia residencial exclusiva en el corazón de Córdoba.
                </p>
              </div>

              {/* CONTACTO */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Consultas Directas</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-700 group/link cursor-pointer">
                    <div className="p-2 bg-white/80 rounded-xl shadow-sm group-hover/link:bg-[#C5A059] group-hover/link:text-white transition-all">
                      <Phone size={14} />
                    </div>
                    <span className="text-sm font-bold">+54 9 351 123 4567</span>
                  </li>
                </ul>
              </div>

              {/* UBICACIÓN ACTUALIZADA */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Ubicación</h4>
                <div className="flex items-start gap-3 text-gray-700">
                  <div className="p-2 bg-white/80 rounded-xl shadow-sm">
                    <MapPin size={14} className="text-[#C5A059]" />
                  </div>
                  <p className="text-sm font-bold leading-relaxed">
                    Malagueño, Yocsina <br />
                    <span className="text-gray-400 font-medium">Córdoba, Argentina</span>
                  </p>
                </div>
              </div>

              {/* ESTADO DEL SITIO DINÁMICO */}
              <div className="flex flex-col justify-center">
                <div className={`p-6 rounded-[2rem] border transition-all duration-700 shadow-xl ${
                  isAvailable 
                  ? 'bg-green-50/50 border-green-100 shadow-green-900/5' 
                  : 'bg-gray-900 border-gray-800 shadow-black/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Circle size={8} fill={isAvailable ? "#22c55e" : "#ef4444"} className={isAvailable ? "animate-pulse text-green-500" : "text-red-500"} />
                    <p className={`text-[9px] font-black uppercase tracking-widest ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                      Estado Actual
                    </p>
                  </div>
                  <p className={`text-xs font-bold ${isAvailable ? 'text-gray-800' : 'text-white'}`}>
                    {isAvailable ? 'Disponible para Alquiler' : 'Villa Reservada / Alquilada'}
                  </p>
                </div>
              </div>

            </div>

            {/* LÍNEA DIVISORIA DE CRISTAL */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300/50 to-transparent my-12"></div>

            {/* CRÉDITOS PERSONALIZADOS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                © 2026 AlquilerYocsina — Exclusividad & Privacidad.
              </p>
              
              <div className="group/dev flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all duration-500">
                <Code2 size={16} className="text-gray-400 group-hover/dev:text-[#C5A059] transition-colors" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">Developed by</span>
                  <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight group-hover/dev:text-[#C5A059] transition-colors">
                    <a href="https://api.whatsapp.com/send/?phone=3516162693">Juan Cruz Fernandez</a>
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;