import React from 'react';
import { 
  TrendingUp, Navigation, ShoppingBag, 
  Factory, GraduationCap, Zap, Map as MapIcon 
} from 'lucide-react';

const Location = () => {
  // Coordenadas exactas pasadas
  const lat = -31.445611;
  const lng = -64.367083;

  const stats = [
    { icon: <TrendingUp size={20}/>, title: "Zona en Expansión", desc: "Nuevos barrios y desarrollos comerciales en apertura inmediata." },
    { icon: <ShoppingBag size={20}/>, title: "Supermercados", desc: "Cercanía a grandes superficies y centros de servicios esenciales." },
    { icon: <Factory size={20}/>, title: "Polo Industrial", desc: "A minutos del motor económico y laboral más grande de la zona." },
    { icon: <GraduationCap size={20}/>, title: "Área Educativa", desc: "Zona rodeada de colegios y futuras instituciones de prestigio." }
  ];

  // URL de Google Maps para el iframe con el Marcador (q=lat,lng)
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  return (
    <section id="ubicacion" className="py-12 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* ENCABEZADO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-12 md:mb-20 items-end">
          <div>
            <span className="text-[#C5A059] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
              Eje Estratégico & Desarrollo
            </span>
            <h2 className="text-4xl md:text-7xl font-serif text-[#1A1A1A] leading-tight tracking-tighter">
              El corazón del <br /> 
              <span className="italic text-[#C5A059]">nuevo Malagueño</span>
            </h2>
          </div>
          <div className="pb-2">
            <p className="text-gray-500 text-base md:text-lg leading-relaxed font-light">
              Ubicada en <span className="text-[#1A1A1A] font-bold italic">Yocsina</span>, nuestra villa se encuentra en un punto de inversión clave, conectando la paz de las sierras con el progreso urbano.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* MAPA GOOGLE MAPS CON MARCADOR */}
          <div className="flex-1 h-[400px] md:h-[600px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative">
            <iframe 
              title="Mapa Villa Amanecer"
              src={mapUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              className="grayscale-[0.2] contrast-[1.1]"
            ></iframe>
          </div>

          {/* PANEL DE CARACTERÍSTICAS */}
          <div className="w-full lg:w-[400px] flex flex-col gap-4">
            {stats.map((item, i) => (
              <div key={i} className="bg-gray-50 p-5 md:p-6 rounded-[2rem] border border-gray-100 hover:border-[#C5A059]/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-tight">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* CARD DE TIEMPOS */}
            <div className="bg-[#1A1A1A] p-6 md:p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl mt-2">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-[#C5A059]">
                <Navigation size={60} />
              </div>
              <p className="text-[#C5A059] text-[9px] font-black uppercase tracking-widest mb-6">Conectividad Estratégica</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs text-gray-400 font-medium tracking-wide">Cba Capital</span>
                  <span className="text-lg font-black text-[#C5A059]">15' Min</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs text-gray-400 font-medium tracking-wide">Villa Carlos Paz</span>
                  <span className="text-lg font-black text-[#C5A059]">18' Min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-medium tracking-wide">Polo Industrial</span>
                  <span className="text-lg font-black text-[#C5A059]">05' Min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CURIOSIDADES Y BOTÓN */}
        <div className="mt-8 md:mt-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100">
          <div className="flex items-center gap-4 md:gap-6 max-w-xl">
            <div className="p-3 md:p-4 bg-white rounded-full shadow-sm flex-shrink-0">
              <Zap className="text-[#C5A059]" size={24} />
            </div>
            <p className="text-[11px] md:text-xs text-gray-500 font-medium leading-relaxed italic">
              "Yocsina es el nuevo faro de crecimiento residencial en Malagueño. Rodeado de barrios en desarrollo, ofrece la solidez de una zona industrial pujante y la paz de un entorno serrano."
            </p>
          </div>

          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} 
            target="_blank" 
            rel="noreferrer"
            className="w-full md:w-auto flex items-center justify-center gap-4 bg-white border border-gray-200 text-gray-900 px-8 py-5 rounded-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all font-black text-[10px] tracking-[0.2em] uppercase"
          >
            <MapIcon size={16} className="text-[#C5A059]" />
            Cómo llegar ahora
          </a>
        </div>
      </div>
    </section>
  );
};

export default Location;