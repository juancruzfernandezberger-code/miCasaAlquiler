import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // REDIRECCIÓN AUTOMÁTICA: Si el usuario ya está logueado, lo manda al admin apenas carga la página
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/admin');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Intento de inicio de sesión
      await signInWithEmailAndPassword(auth, email, password);
      // Si tiene éxito, el useEffect de arriba detectará el cambio y redirigirá, 
      // pero forzamos la navegación aquí también por rapidez.
      navigate('/admin');
    } catch (err) {
      setError('Credenciales inválidas. Revisá el usuario y la contraseña.');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#1A1A1A] flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-gray-900 mb-2">
            Panel <span className="text-[#C5A059]">Admin</span>
          </h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">AlquilerYocsina</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 text-center border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white transition-all text-gray-700"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input 
              type="password" 
              placeholder="Contraseña" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white transition-all text-gray-700"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-bold hover:bg-[#C5A059] hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-gray-400 text-xs hover:text-[#C5A059] transition-colors underline decoration-dotted">
            Volver a la web principal
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;