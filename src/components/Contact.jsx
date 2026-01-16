import React, { useState } from 'react';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    consulta: ''
  });
  
  const [status, setStatus] = useState({ loading: false, success: false, error: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: false });

    const templateParams = {
      from_name: formData.nombre,
      from_email: formData.email,
      message: formData.consulta,
      to_name: 'Administración Villa Amanecer',
    };

    try {
      // 1. GUARDAR EN FIREBASE
      await addDoc(collection(db, "contact_forms"), {
        name: formData.nombre,
        email: formData.email,
        message: formData.consulta,
        timestamp: serverTimestamp()
      });

      // 2. ENVIAR AGRADECIMIENTO AL CLIENTE
      await emailjs.send(
        'service_1gaieo9',    
        'template_wiidlr3',   
        templateParams,
        'TNsxA4XvIIOb4018m'     
      );

      // 3. ENVIAR NOTIFICACIÓN AL DUEÑO
      await emailjs.send(
        'service_1gaieo9',    
        'template_8fi08vd', 
        templateParams,
        'TNsxA4XvIIOb4018m'     
      );
      
      setStatus({ loading: false, success: true, error: false });
      setFormData({ nombre: '', email: '', consulta: '' }); 

    } catch (error) {
      console.error("Error en el sistema de contacto:", error);
      setStatus({ loading: false, success: false, error: true });
    }
  };

  return (
    <section id="contacto" className="py-24 relative overflow-hidden bg-[#F8F9FA]">
      {/* Elementos decorativos de fondo para resaltar el Liquid Glass */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A059]/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-black/5 blur-[80px] rounded-full"></div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Lado Izquierdo: Texto y Botones Premium */}
        <div>
          <h3 className="font-serif text-4xl mb-6 text-gray-900 leading-tight">¿Preferís hablar?</h3>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed max-w-md">
            Estamos disponibles para responder todas tus dudas y ayudarte a concretar tu estadía en Malagueño con atención personalizada.
          </p>
          
          <div className="space-y-5">
            <a 
              href="https://wa.me/3516162693?text=Hola,%20me%20gustaría%20consultar%20por%20la%20casa."
              target="_blank" rel="noreferrer"
              className="group flex items-center justify-start gap-5 bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-2xl hover:bg-[#50A158] hover:text-white transition-all duration-500 shadow-sm"
            >
              <div className="bg-[#50A158] p-3 rounded-xl text-white group-hover:bg-white group-hover:text-[#50A158] transition-colors shadow-lg">
                <FaWhatsapp size={22} />
              </div>
              <span className="font-bold tracking-wide">Chatear por WhatsApp</span>
            </a>

        
          </div>
        </div>

        {/* Lado Derecho: Formulario Liquid Glass */}
        <div className="bg-white/40 backdrop-blur-2xl p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/60 relative">
          <h3 className="font-serif text-2xl mb-8 text-gray-800">Envíanos tu consulta</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
              <input 
                type="text" name="nombre" required
                value={formData.nombre} onChange={handleChange}
                className="w-full p-4 bg-white/50 border border-white/40 rounded-2xl focus:bg-white/80 focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] outline-none transition-all placeholder:text-gray-400"
                placeholder="Ej: Juan Carlos"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email de contacto</label>
              <input 
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                className="w-full p-4 bg-white/50 border border-white/40 rounded-2xl focus:bg-white/80 focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] outline-none transition-all placeholder:text-gray-400"
                placeholder="Ej: juancarlos@gmail.com"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Mensaje</label>
              <textarea 
                rows="4" name="consulta" required
                value={formData.consulta} onChange={handleChange}
                className="w-full p-4 bg-white/50 border border-white/40 rounded-2xl focus:bg-white/80 focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] outline-none transition-all resize-none placeholder:text-gray-400"
                placeholder="¿En qué podemos ayudarte?"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={status.loading}
              className={`w-full py-5 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${
                status.loading 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#C5A059] hover:bg-[#b08e4d] text-white shadow-[#C5A059]/20'
              }`}
            >
              {status.loading ? 'Procesando...' : 'Enviar Mensaje'}
            </button>

            {/* Mensajes de Feedback Glass */}
            {status.success && (
              <div className="bg-green-500/10 backdrop-blur-md border border-green-500/20 text-green-700 text-center py-4 rounded-2xl font-bold text-sm animate-pulse">
                ¡Consulta enviada con éxito!
              </div>
            )}
            {status.error && (
              <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-700 text-center py-4 rounded-2xl font-bold text-sm">
                Hubo un problema. Intentá de nuevo.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;