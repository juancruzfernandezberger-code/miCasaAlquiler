import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Phone } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Qué tal. Soy el asistente de la casa en Yocsina. ¿Buscabas un alquiler mensual tranquilo por Malagueño?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const WHATSAPP_NUMBER = "5493510000000"; 

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setLoading(true);

    try {
      await addDoc(collection(db, "chats"), {
        text: userText,
        sender: 'user',
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn("Error Firebase:", err);
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { 
              role: "system", 
              content: `Eres el encargado de Villa Amanecer. Es una casa amoblada en Yocsina, Malagueño.
              CONDICIONES NO NEGOCIABLES:
              1. ALQUILER: Solo mensual (no por día).
              2. MONEDA: Pesos Argentinos.
              3. MASCOTAS: Absolutamente NO se aceptan.
              4. CAPACIDAD: Máximo 2 personas. Sin excepciones.
              5. DESCRIPCIÓN: 1 dormitorio, cocina, baño, garage techado y asador.
              PERSONALIDAD:
              - Cordobés hospitalario, educado pero firme con las reglas.
              - No uses listas de puntos, hablá natural.
              - Si preguntan por el precio exacto, deciles que se charla en pesos según el contrato mensual y que le escriban al dueño al WhatsApp con el botón verde.
              - Si alguien insiste con mascotas o más gente, explicá que la casa es chica y está pensada para la tranquilidad de máximo dos personas sin animales.` 
            },
            { role: "user", content: userText }
          ]
        })
      });

      const data = await response.json();
      const aiText = data.choices[0].message.content;

      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);

      addDoc(collection(db, "chats"), {
        text: aiText,
        sender: 'ai',
        timestamp: serverTimestamp()
      }).catch(() => {});

    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Se me cortó un segundo el Wi-Fi. ¿Podrías repetirme lo último?" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] font-sans flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-[calc(100vw-2rem)] md:w-96 h-[580px] max-h-[85vh] rounded-[2.5rem] flex flex-col mb-4 overflow-hidden border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.25)] bg-white/40 backdrop-blur-2xl"
          >
            {/* Header Liquid Glass */}
            <div className="bg-white/20 p-5 flex justify-between items-center border-b border-white/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]" />
                <div>
                  <h3 className="font-serif tracking-widest text-xs uppercase text-gray-900">Villa Amanecer</h3>
                  <p className="text-[10px] text-[#C5A059] font-bold">Asistente Virtual</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black p-1 transition-colors">
                <X size={20}/>
              </button>
            </div>

            {/* Cuerpo del Chat */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 overscroll-contain scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[1.8rem] text-[13px] md:text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                    m.role === 'user' 
                    ? 'bg-[#1A1A1A] text-white rounded-tr-none shadow-lg' 
                    : 'bg-white/60 backdrop-blur-md text-gray-800 border border-white/50 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-gray-500 text-[10px] ml-2 italic">
                  <Loader2 size={12} className="animate-spin text-[#C5A059]" /> Generando respuesta...
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Footer con Botón y Formulario Glass */}
            <div className="p-4 bg-white/20 border-t border-white/20 space-y-3 shrink-0 backdrop-blur-3xl">
              {/* WhatsApp Premium Button */}
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20vi%20la%20casa%20en%20Yocsina%20y%20me%20gustaría%20saber%20más%20sobre%20el%20alquiler.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#50A158]/90 text-white text-[11px] font-bold py-3.5 rounded-2xl hover:bg-[#50A158] transition-all shadow-lg active:scale-95"
              >
                <Phone size={14} /> CONSULTAR DISPONIBILIDAD
              </a>

              {/* Input Field Liquid */}
              <form onSubmit={sendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribí tu mensaje..."
                  disabled={loading}
                  className="flex-1 outline-none text-sm p-3.5 bg-white/50 border border-white/40 rounded-2xl focus:bg-white/80 focus:ring-1 focus:ring-[#C5A059] transition-all placeholder:text-gray-500"
                />
                <button 
                  type="submit" 
                  disabled={loading || !input.trim()} 
                  className="bg-[#1A1A1A] text-[#C5A059] p-3 rounded-2xl hover:scale-105 active:scale-90 transition-all disabled:opacity-50"
                >
                  <Send size={20}/>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Flotante Principal Liquid Glass */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/40 backdrop-blur-xl text-gray-900 p-4 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/50 flex items-center justify-center group"
      >
        {isOpen ? (
          <X size={28} className="group-hover:rotate-90 transition-transform duration-300"/>
        ) : (
          <MessageCircle size={28} className="text-[#1A1A1A]"/>
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;