import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaBed, FaBath, FaUtensils, FaCar, 
  FaFire, FaWifi, FaTv, FaTemperatureHigh 
} from 'react-icons/fa';
import { MdOutlineLocalLaundryService } from "react-icons/md";

const amenitiesList = [
  { 
    icon: <FaBed />, 
    name: "1 Dormitorio", 
    desc: "Espacio de dormitorio amoblado y preparado para recibirte." 
  },
  { 
    icon: <FaBath />, 
    name: "1 Baño", 
    desc: "Grifería moderna y ducha con excelente presión de agua." 
  },
  { 
    icon: <FaUtensils />, 
    name: "Cocina Amoblada", 
    desc: "Equipada con bajo mesada, alacenas y campana." 
  },
  { 
    icon: <FaCar />, 
    name: "Garage Techado", 
    desc: "Protección para tu vehículo con acceso directo." 
  },
  { 
    icon: <FaFire />, 
    name: "Asador", 
    desc: "Chulengo en el patio, perfecto para tus reuniones de fin de semana." 
  },
  { 
    icon: <MdOutlineLocalLaundryService />, 
    name: "Lavadero", 
    desc: "Sector independiente con conexiones para lavarropas ya instalado." 
  },
];

const Amenities = () => {
  return (
    <section id="comodidades" className="py-12 sm:py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ENCABEZADO ESTILO EDITORIAL */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <span className="text-[#C5A059] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[9px] sm:text-[10px] mb-3 sm:mb-4 block">
            Equipamiento de Primera
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A] italic px-4">
            Comodidades <span className="not-italic text-[#C5A059]">&</span> Detalles
          </h3>
          <div className="w-16 sm:w-20 h-1 bg-[#C5A059] mx-auto mt-4 sm:mt-6 rounded-full opacity-30" />
        </div>

        {/* GRILLA DE AMENITIES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {amenitiesList.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -10,
                backgroundColor: "#ffffff",
                boxShadow: "0 20px 40px rgba(0,0,0,0.05)"
              }}
              className="flex items-start gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 md:p-8 bg-gray-50 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-transparent hover:border-[#C5A059]/20 transition-all duration-500"
            >
              <div className="bg-white p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl text-[#C5A059] text-xl sm:text-2xl md:text-3xl shadow-sm flex-shrink-0">
                {item.icon}
              </div>
              <div className="text-left min-w-0 flex-1">
                <h4 className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider sm:tracking-widest text-[#1A1A1A] mb-1 sm:mb-2 break-words">
                  {item.name}
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed font-medium italic break-words">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;