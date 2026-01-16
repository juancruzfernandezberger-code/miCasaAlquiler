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
    desc: "Espacio amplio con sommier premium y ventanal con vista." 
  },
  { 
    icon: <FaBath />, 
    name: "1 Baño", 
    desc: "Grifería moderna y ducha con excelente presión de agua." 
  },
  { 
    icon: <FaUtensils />, 
    name: "Cocina Amoblada", 
    desc: "Equipada con bajo mesada, alacenas y purificador de aire." 
  },
  { 
    icon: <FaCar />, 
    name: "Garage Techado", 
    desc: "Protección total para tu vehículo con acceso directo." 
  },
  { 
    icon: <FaFire />, 
    name: "Asador", 
    desc: "Quincho privado perfecto para tus reuniones de fin de semana." 
  },
  { 
    icon: <FaWifi />, 
    name: "Wi-Fi 300MB", 
    desc: "Conexión de alta velocidad, ideal para home-office." 
  },
  { 
    icon: <FaTv />, 
    name: "Smart TV", 
    desc: "Acceso a Netflix y streaming en resolución 4K." 
  },
  { 
    icon: <FaTemperatureHigh />, 
    name: "Aire Acond.", 
    desc: "Climatización frío/calor para confort en cualquier estación." 
  },
  { 
    icon: <MdOutlineLocalLaundryService />, 
    name: "Lavadero", 
    desc: "Sector independiente con conexiones para lavarropas." 
  },
];

const Amenities = () => {
  return (
    <section id="comodidades" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ENCABEZADO ESTILO EDITORIAL */}
        <div className="text-center mb-16">
          <span className="text-[#C5A059] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
            Equipamiento de Primera
          </span>
          <h3 className="font-serif text-5xl md:text-6xl text-[#1A1A1A] italic">
            Comodidades <span className="not-italic text-[#C5A059]">&</span> Detalles
          </h3>
          <div className="w-20 h-1 bg-[#C5A059] mx-auto mt-6 rounded-full opacity-30" />
        </div>

        {/* GRILLA DE AMENITIES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
              className="flex items-start gap-6 p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-[#C5A059]/20 transition-all duration-500"
            >
              <div className="bg-white p-4 rounded-2xl text-[#C5A059] text-3xl shadow-sm group-hover:bg-[#C5A059] group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <div className="text-left">
                <h4 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A] mb-2">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium italic">
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