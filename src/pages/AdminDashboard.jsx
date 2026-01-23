import { useEffect, useState, useMemo } from 'react';
import { db, auth } from '../firebase/config';
import { 
  collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc, setDoc 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, MessageSquare, Trash2, Phone, LogOut, CheckCircle, 
  XCircle, UserCheck, Bell, BellOff, Filter, Lock, X 
} from 'lucide-react';

const AdminDashboard = () => {
  const [view, setView] = useState('visitas');
  const [chats, setChats] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [filterDate, setFilterDate] = useState(''); // Filtro de fecha para la lista
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) navigate('/login');
    });

    // Leer Configuración: Disponibilidad y Fechas Bloqueadas
    const unsubConfig = onSnapshot(doc(db, "configuracion", "estado_villa"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsAvailable(data.disponible || false);
        setBlockedDates(data.fechasBloqueadas || []);
      }
    });

    const qChats = query(collection(db, "chats"), orderBy("timestamp", "desc"));
    const unsubChats = onSnapshot(qChats, (snap) => {
      setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qAppo = query(collection(db, "reservas_visitas"), orderBy("fecha", "asc"));
    const unsubAppo = onSnapshot(qAppo, (snap) => {
      setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubscribeAuth(); unsubChats(); unsubAppo(); unsubConfig(); };
  }, [navigate]);

  // LÓGICA DE PRIORIDAD Y FILTRADO
  const sortedAppointments = useMemo(() => {
    let list = [...appointments];

    // 1. Filtrar por fecha si el usuario eligió una
    if (filterDate) {
      list = list.filter(app => app.fecha === filterDate);
    }

    // 2. Ordenar: Los "Potenciales" van primero. Luego por fecha.
    return list.sort((a, b) => {
      if (a.clasificacion === 'potencial' && b.clasificacion !== 'potencial') return -1;
      if (a.clasificacion !== 'potencial' && b.clasificacion === 'potencial') return 1;
      return 0; // Mantener orden original si son iguales
    });
  }, [appointments, filterDate]);

  // FUNCIÓN: Bloquear/Desbloquear Fechas
  const toggleBlockDate = async (date) => {
    if (!date) return;
    const configRef = doc(db, "configuracion", "estado_villa");
    let newBlocked = [...blockedDates];
    
    if (newBlocked.includes(date)) {
      newBlocked = newBlocked.filter(d => d !== date);
    } else {
      newBlocked.push(date);
    }

    await setDoc(configRef, { fechasBloqueadas: newBlocked }, { merge: true });
  };

  const toggleAvailability = async () => {
    const configRef = doc(db, "configuracion", "estado_villa");
    await setDoc(configRef, { disponible: !isAvailable }, { merge: true });
  };

  const confirmarVisita = async (app) => {
    const mensaje = `Hola ${app.cliente}, confirmo tu visita a AlquilerYocsina el ${app.fecha} a las ${app.hora} hs.`;
    window.open(`https://wa.me/${app.contacto.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`, '_blank');
    await updateDoc(doc(db, "reservas_visitas", app.id), { estado: 'confirmado' });
  };

  const clasificarCliente = async (id, tipo) => {
    await updateDoc(doc(db, "reservas_visitas", id), {
      clasificacion: tipo,
      estado: 'finalizado'
    });
  };

  const deleteAppointment = async (id) => {
    if(window.confirm("¿Deseas eliminar este registro?")) {
      await deleteDoc(doc(db, "reservas_visitas", id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#1A1A1A] text-white p-8 flex flex-col shrink-0 border-r border-white/10">
        <div className="mb-12">
          <h2 className="text-[#C5A059] font-serif text-2xl tracking-tighter">Villa Admin</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Control de Gestión</p>
        </div>
        <nav className="space-y-4 flex-1">
          <button onClick={() => setView('visitas')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${view === 'visitas' ? 'bg-[#C5A059]/10 text-[#C5A059]' : 'text-gray-400'}`}>
            <CalendarIcon size={20}/> <span className="font-bold text-sm tracking-tight">Visitas</span>
          </button>
          <button onClick={() => setView('chatbot')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${view === 'chatbot' ? 'bg-[#C5A059]/10 text-[#C5A059]' : 'text-gray-400'}`}>
            <MessageSquare size={20}/> <span className="font-bold text-sm tracking-tight">Monitor IA</span>
          </button>
        </nav>
        <button onClick={() => auth.signOut()} className="mt-auto flex items-center gap-3 text-red-400/70 p-4 font-bold text-xs uppercase tracking-widest">
          <LogOut size={18}/> Cerrar Sesión
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {view === 'visitas' ? (
          <>
            <header className="mb-10">
              <h1 className="text-4xl font-serif text-gray-900 mb-8">Gestión de Visitas</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Alerta Disponibilidad */}
                <button 
                  onClick={toggleAvailability}
                  className={`p-5 rounded-[2rem] border flex items-center justify-between transition-all shadow-sm ${isAvailable ? 'bg-green-500 text-white' : 'bg-white text-gray-400'}`}
                >
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Estado Villa</p>
                    <p className="text-xs font-bold">{isAvailable ? 'VISIBLE/ALQUILER' : 'OCULTA/ALQUILADA'}</p>
                  </div>
                  {isAvailable ? <Bell size={20}/> : <BellOff size={20}/>}
                </button>

                {/* Filtro por Fecha */}
                <div className="bg-white p-5 rounded-[2rem] border flex items-center gap-3 shadow-sm">
                  <Filter size={18} className="text-[#C5A059]"/>
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Filtrar Lista</p>
                    <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="bg-transparent outline-none text-xs font-bold w-full uppercase" />
                  </div>
                  {filterDate && <X size={14} className="text-red-400 cursor-pointer" onClick={() => setFilterDate('')}/>}
                </div>

                {/* Bloqueo Mantenimiento */}
                <div className="bg-[#1A1A1A] p-5 rounded-[2rem] text-white flex items-center gap-3 shadow-lg">
                  <Lock size={18} className="text-[#C5A059]"/>
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Mantenimiento</p>
                    <input type="date" className="bg-transparent outline-none text-[10px] font-bold uppercase w-full" onChange={(e) => toggleBlockDate(e.target.value)} />
                  </div>
                  <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded">BLOQUEAR</span>
                </div>
              </div>
            </header>

            {/* Tags de Fechas Bloqueadas */}
            {blockedDates.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 items-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Fechas inhabilitadas:</p>
                {blockedDates.map(date => (
                  <span key={date} className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-[10px] font-black border border-red-100 flex items-center gap-2">
                    {date} <X size={12} className="cursor-pointer" onClick={() => toggleBlockDate(date)}/>
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-6">
              {sortedAppointments.map((app) => (
                <div key={app.id} className={`p-6 rounded-[2.5rem] bg-white border transition-all flex flex-col lg:flex-row justify-between items-center gap-6 ${app.clasificacion === 'potencial' ? 'border-[#C5A059] shadow-xl shadow-[#C5A059]/5 ring-1 ring-[#C5A059]' : 'border-white shadow-sm'}`}>
                  
                  <div className="flex items-center gap-6 flex-1 w-full">
                    <div className={`${app.clasificacion === 'potencial' ? 'bg-[#C5A059]' : 'bg-[#1A1A1A]'} text-white p-4 rounded-2xl text-center min-w-[90px] shadow-lg`}>
                      <p className="text-[10px] font-bold mb-1 opacity-70">{app.hora} HS</p>
                      <p className="text-sm font-bold">{app.fecha?.split('-')[2]}/{app.fecha?.split('-')[1]}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 uppercase text-sm flex items-center gap-2">
                        {app.cliente} {app.clasificacion === 'potencial' && <span className="animate-pulse">🔥</span>}
                      </h4>
                      <p className="text-xs text-[#C5A059] font-bold flex items-center gap-1 mt-1">
                        <Phone size={12}/> {app.contacto}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                    {!app.estado ? (
                      <button onClick={() => confirmarVisita(app)} className="bg-[#C5A059] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Confirmar</button>
                    ) : app.estado === 'confirmado' ? (
                      <div className="flex gap-2">
                        <button onClick={() => clasificarCliente(app.id, 'potencial')} className="bg-green-500 text-white px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md hover:bg-green-600 transition-all"><UserCheck size={16}/> POTENCIAL</button>
                        <button onClick={() => clasificarCliente(app.id, 'descartado')} className="bg-gray-100 text-gray-500 px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-gray-200"><XCircle size={16}/> DESCARTAR</button>
                      </div>
                    ) : (
                      <span className="text-gray-300 font-black text-[9px] uppercase tracking-widest">Finalizada</span>
                    )}
                    
                    <button onClick={() => deleteAppointment(app.id)} className="p-3 text-red-100 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {sortedAppointments.length === 0 && (
                <div className="text-center py-20 bg-white/50 rounded-[3rem] border border-dashed border-gray-300">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No hay visitas para mostrar</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* VISTA DEL CHATBOT */
          <section className="bg-[#1A1A1A] p-10 rounded-[3rem] shadow-2xl min-h-[70vh]">
             <h2 className="text-2xl font-serif text-[#C5A059] mb-8 italic flex items-center gap-3">
               <MessageSquare /> Historial del Chatbot IA
             </h2>
             <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
               {chats.map((chat) => (
                 <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-5 rounded-3xl ${chat.sender === 'user' ? 'bg-[#C5A059] text-white shadow-lg' : 'bg-white/5 text-gray-300 border border-white/10'}`}>
                     <p className="text-[10px] font-black uppercase opacity-50 mb-2">{chat.sender === 'user' ? 'Interesado' : 'Asistente IA'}</p>
                     <p className="text-sm leading-relaxed">{chat.text}</p>
                   </div>
                 </div>
               ))}
             </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;