import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const goToDashboard = () => navigate('/dashboard');

  const goToPerfil = () => navigate('/perfil');

  return (
    <header className='bg-white shadow-md py-4 px-6 flex justify-between items-center'>
      <div className='flex items-center cursor-pointer' onClick={goToDashboard}>
        <img src={logo} alt='Logo' className='h-20 w-auto' />
      </div>

      <div className='flex items-center space-x-4'>
        <button
          onClick={goToDashboard}
          className='text-sm text-blue-600 hover:underline'
        >
          Ir al Dashboard
        </button>

        <button
          onClick={goToPerfil}
          className='text-sm text-blue-600 hover:underline'
        >
          Mi Perfil
        </button>

        <button
          onClick={logout}
          className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm'
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Navbar;