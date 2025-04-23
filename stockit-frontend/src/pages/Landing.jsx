import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.jpg';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200'>
      <header className='flex justify-between items-center p-6 shadow bg-white'>
        <div className='flex items-center gap-2 cursor-pointer'>
          <img src={logo} alt='Stockit Logo' className='h-20 w-auto' />
        </div>
        <Link
          to='/login'
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'
        >
          Iniciar Sesión
        </Link>
      </header>

      <main
        className='flex-1 relative flex flex-col items-center justify-center text-center px-4'
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay para oscurecer un poco el fondo */}
        <div className='absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm'></div>

        {/* Contenido sobre el overlay */}
        <div className='relative z-10'>
          <h2 className='text-4xl font-bold mb-4 text-gray-800 max-w-2xl'>
            Gestiona tu inventario de forma sencilla y visual
          </h2>
          <p className='text-lg text-gray-700 max-w-xl mb-8'>
            Stockit es una solución SaaS pensada para pequeñas y medianas
            empresas que buscan controlar sus productos, ventas y stock en
            tiempo real.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/login'
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium'
            >
              Acceder a la App
            </Link>
            <a
              href='mailto:info@stockit.com?subject=Solicitud de información sobre Stockit'
              className='bg-white border border-blue-600 text-blue-700 hover:bg-blue-100 px-6 py-3 rounded-md font-medium'
            >
              Solicitar Información
            </a>
          </div>
        </div>
      </main>

      <footer className='bg-white text-center py-4 text-sm text-gray-500 flex flex-col items-center'>
        <img src={logo} alt='Stockit Logo' className='h-8 mb-2' />©{' '}
        {new Date().getFullYear()} Stockit · Todos los derechos reservados
      </footer>
    </div>
  );
};

export default Landing;
