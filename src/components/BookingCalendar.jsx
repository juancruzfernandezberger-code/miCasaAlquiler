import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';

const BookingCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(false);

  const hours = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  // ====== CONFIGURACIÓN ADMIN ======
  // 📱 IMPORTANTE: Cambia estos datos por los tuyos
  const ADMIN_WHATSAPP = '+5493512345678';  // ← Tu número con código de país
  const ADMIN_NOMBRE = 'Admin';              // ← Tu nombre

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "configuracion", "estado_villa"), (snap) => {
      if (snap.exists()) {
        setBlockedDates(snap.data().fechasBloqueadas || []);
      }
    });
    return () => unsub();
  }, []);

  const checkAvailability = async () => {
    const fechaStr = date.toISOString().split('T')[0];
    const q = query(collection(db, "reservas_visitas"), where("fecha", "==", fechaStr));
    const snap = await getDocs(q);
    const occupied = snap.docs.map(doc => doc.data().hora);
    setBookedTimes(occupied);
  };

  useEffect(() => {
    checkAvailability();
    setSelectedTime('');
  }, [date]);

  const isDateDisabled = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const isSunday = date.getDay() === 0;
    const isBlockedByAdmin = blockedDates.includes(dateStr);
    return isSunday || isBlockedByAdmin;
  };

  // ====== MÉTODO 1: CallMeBot API (MÁS AUTOMÁTICO) ======
  const enviarNotificacionCallMeBot = async (datos) => {
    // Primero necesitas obtener tu API Key de CallMeBot:
    // 1. Agrega el número +34 644 34 87 08 a tus contactos como "CallMeBot"
    // 2. Envíale por WhatsApp: "I allow callmebot to send me messages"
    // 3. Te responderá con tu API Key
    
    const apiKey = 'TU_API_KEY_AQUI'; // ← Pegar aquí tu API Key de CallMeBot
    
    const mensaje = `🏡 *NUEVA RESERVA ALQUILERYOCSINA*

👤 Cliente: ${datos.cliente}
📞 Teléfono: ${datos.contacto}
📅 Fecha: ${formatearFecha(datos.fecha)}
⏰ Hora: ${datos.hora}

Revisa el panel de administración para confirmar.`;

    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${ADMIN_WHATSAPP.replace(/\D/g, '')}&text=${encodeURIComponent(mensaje)}&apikey=${apiKey}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        console.log('✅ Notificación WhatsApp enviada');
      } else {
        console.log('⚠️ Error al enviar WhatsApp automático');
      }
    } catch (error) {
      console.error('Error CallMeBot:', error);
    }
  };

  // ====== MÉTODO 2: WhatsApp Web Direct (MÁS SIMPLE) ======
  const enviarNotificacionWhatsAppWeb = (datos) => {
    const mensaje = `🏡 *NUEVA RESERVA - AlquilerYocsina*

👤 Cliente: ${datos.cliente}
📞 Teléfono: ${datos.contacto}
📅 Fecha: ${formatearFecha(datos.fecha)}
⏰ Hora: ${datos.hora}

Ingresa al panel para confirmar la visita.`;

    // Abre WhatsApp Web con el mensaje pre-escrito
    const urlWhatsApp = `https://wa.me/${ADMIN_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
    
    // Abrir en nueva pestaña
    const ventana = window.open(urlWhatsApp, '_blank');
    
    if (ventana) {
      console.log('✅ WhatsApp abierto');
    } else {
      console.log('⚠️ Popup bloqueado - habilita popups para notificaciones');
    }
  };

  // Función auxiliar para formatear fecha
  const formatearFecha = (fechaStr) => {
    const [año, mes, dia] = fechaStr.split('-');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${dia} ${meses[parseInt(mes) - 1]} ${año}`;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const fechaStr = date.toISOString().split('T')[0];
    const contactoCompleto = `+54 9 ${telefono}`;

    if (!selectedTime || !nombre || telefono.length < 7) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    setLoading(true);
    try {
      const checkQ = query(
        collection(db, "reservas_visitas"), 
        where("fecha", "==", fechaStr), 
        where("hora", "==", selectedTime)
      );
      const checkSnap = await getDocs(checkQ);

      if (!checkSnap.empty) {
        alert("Este horario se acaba de ocupar. Elige otro.");
        checkAvailability();
        setLoading(false);
        return;
      }

      const datosReserva = {
        cliente: nombre,
        contacto: contactoCompleto,
        fecha: fechaStr,
        hora: selectedTime,
        timestamp: serverTimestamp()
      };

      // Guardar en Firebase
      await addDoc(collection(db, "reservas_visitas"), datosReserva);

      // ====== ENVIAR NOTIFICACIÓN AL ADMINISTRADOR ======
      
      // OPCIÓN A: CallMeBot (100% automático pero requiere setup)
      // Descomenta esta línea después de configurar tu API Key:
      // await enviarNotificacionCallMeBot(datosReserva);
      
      // OPCIÓN B: WhatsApp Web (Requiere un clic pero no necesita setup)
      // Esta es la más simple para empezar:
      enviarNotificacionWhatsAppWeb(datosReserva);

      alert("¡Turno reservado con éxito! El administrador será notificado.");
      setNombre(''); 
      setTelefono(''); 
      setSelectedTime('');
      checkAvailability();
      
    } catch (error) {
      console.error('Error al agendar:', error);
      alert("Error al agendar. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reservas" className="py-16 md:py-32 bg-[#F9F9F9] border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        <div className="text-center mb-10 md:mb-16">
          <span className="text-[#C5A059] font-bold text-[10px] md:text-xs uppercase tracking-[0.3em]"></span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mt-2">Agendá tu Visita</h2>
          <div className="w-12 h-[2px] bg-[#C5A059] mx-auto mt-4"></div>
        </div>
        
        <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 border border-white">
          
          <div className="flex flex-col items-center justify-center w-full overflow-hidden">
            <style>{`
              .react-calendar { border: none !important; font-family: inherit; width: 100% !important; max-width: 350px; background: transparent; }
              .react-calendar__tile--active { background: #1A1A1A !important; border-radius: 12px; color: #C5A059 !important; font-weight: bold; }
              .react-calendar__tile--now { background: #F3EFE6 !important; border-radius: 12px; color: #C5A059 !important; }
              .react-calendar__tile--disabled { 
                background: #fee2e2 !important; 
                color: #ef4444 !important; 
                opacity: 0.3; 
                text-decoration: line-through;
              }
              .react-calendar__navigation button { font-weight: bold; font-size: 1rem; }
              @media (max-width: 640px) {
                .react-calendar__month-view__days__day { font-size: 0.8rem !important; padding: 10px 5px !important; }
              }
            `}</style>
            <Calendar 
              onChange={setDate} 
              value={date} 
              minDate={new Date()}
              tileDisabled={isDateDisabled}
            />
          </div>

          <div className="flex flex-col justify-center w-full">
            <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
              Horarios disponibles
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {hours.map(h => {
                const isOccupied = bookedTimes.includes(h);
                return (
                  <button
                    key={h}
                    disabled={isOccupied}
                    onClick={() => setSelectedTime(h)}
                    className={`py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black transition-all border ${
                      isOccupied 
                      ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through' 
                      : selectedTime === h 
                        ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A] shadow-lg scale-[1.02]' 
                        : 'bg-white text-gray-600 border-gray-100 hover:border-[#C5A059]'
                    }`}
                  >
                    {h} HS
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Nombre Completo"
                className="w-full p-4 md:p-5 bg-gray-50 border border-gray-100 rounded-xl md:rounded-[1.5rem] outline-none focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-sm"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <div className="relative group">
                <span className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs md:text-sm pr-3 md:pr-4 border-r border-gray-200">
                  +54 9
                </span>
                <input 
                  type="tel" 
                  placeholder="Área + Número"
                  className="w-full p-4 pl-20 md:p-5 md:pl-24 bg-gray-50 border border-gray-100 rounded-xl md:rounded-[1.5rem] outline-none focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-sm"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <button 
                onClick={handleBooking}
                disabled={loading}
                className="w-full py-4 md:py-5 mt-2 bg-[#C5A059] text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl md:rounded-[1.5rem] shadow-xl shadow-[#C5A059]/20 hover:bg-[#b08e4d] active:scale-95 transition-all disabled:bg-gray-200"
              >
                {loading ? "VERIFICANDO..." : "CONFIRMAR CITA"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;