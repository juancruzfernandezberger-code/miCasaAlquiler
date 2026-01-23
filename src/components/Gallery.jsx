import React from 'react';
import { motion } from 'framer-motion';

// Importar todas las imágenes desde src/assets/images
import img1 from '../assets/images/0.1.jpeg';
import img2 from '../assets/images/1.jpeg';
import img3 from '../assets/images/2.1.jpeg';
import img4 from '../assets/images/3.1.jpeg';
import img5 from '../assets/images/4.jpeg';
import img6 from '../assets/images/5.jpeg';
import img7 from '../assets/images/6.jpeg';
import img8 from '../assets/images/7.jpeg';
import img9 from '../assets/images/8.jpeg';

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

const Gallery = () => {
  return (
    <section id="galeria" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="font-serif text-4xl mb-4 text-[#1A1A1A]">Un Vistazo a tu Próximo Hogar</h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Recorré cada rincón. Diseño, comodidad y todos los detalles 
          pensados para tu bienestar.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img 
                src={src} 
                alt={`Galería ${index + 1}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;