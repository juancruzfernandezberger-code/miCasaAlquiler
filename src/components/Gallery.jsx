import React from 'react';
import { motion } from 'framer-motion';

const images = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", // Interior living
  "https://images.unsplash.com/photo-1502672260266-de60749007e0?auto=format&fit=crop&w=800&q=80", // Cocina
  "https://images.unsplash.com/photo-1595514658727-b248a85f4350?auto=format&fit=crop&w=800&q=80", // Dormitorio
  "https://images.unsplash.com/photo-1517402636442-f547c6e00cf0?auto=format&fit=crop&w=800&q=80", // Baño
  "https://images.unsplash.com/photo-1591873030311-df4661877884?auto=format&fit=crop&w=800&q=80", // Asador
  "https://images.unsplash.com/photo-1580587771525-78b9dba38a72?auto=format&fit=crop&w=800&q=80"  // Exterior o garage
];

const Gallery = () => {
  return (
    <section id="galeria" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="font-serif text-4xl mb-4 text-[#1A1A1A]">Un Vistazo a tu Próximo Hogar</h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Recorré cada rincón de Villa Amanecer. Diseño, comodidad y todos los detalles 
          pensados para tu bienestar.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative aspect-video rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <img src={src} alt={`Galería ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 text-white text-lg font-medium">
                {/* Opcional: descripción de cada foto */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;