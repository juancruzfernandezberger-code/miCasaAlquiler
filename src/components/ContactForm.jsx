import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Guardar en Firebase para el Panel de Admin
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // 2. Enviar via EmailJS
      // Reemplaza con tus IDs de EmailJS
      await emailjs.send(
        'service_1gaieo9', 
        'template_wiidlr3', 
        {
          to_name: formData.name,
          to_email: formData.email,
          message: "Gracias por tu interés. En breve nuestra IA te contactará."
        },
        'TNsxA4XvIIOb4018m'
      );

      alert("¡Mensaje enviado con éxito!");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar tu solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white px-4">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-serif mb-6 text-brand-dark">Contáctanos</h2>
          <p className="text-gray-600 mb-8">
            ¿Tienes preguntas sobre la estancia? Déjanos un mensaje y nuestra IA te ayudará a agendar una visita de inmediato.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Tu Nombre"
            className="w-full p-4 border-b border-gray-300 focus:border-brand-gold outline-none transition-colors"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input 
            type="email" 
            placeholder="Tu Email"
            className="w-full p-4 border-b border-gray-300 focus:border-brand-gold outline-none transition-colors"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <textarea 
            placeholder="¿En qué podemos ayudarte?"
            rows="4"
            className="w-full p-4 border-b border-gray-300 focus:border-brand-gold outline-none transition-colors"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            required
          ></textarea>
          <button 
            disabled={loading}
            className="w-full bg-brand-dark text-white py-4 uppercase text-xs tracking-widest hover:bg-brand-gold transition-colors"
          >
            {loading ? "Enviando..." : "Enviar Mensaje"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm; 