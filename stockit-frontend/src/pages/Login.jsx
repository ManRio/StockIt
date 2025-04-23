import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Introduce un email válido');
      return;
    }

    setEmailError('');

    try {
      const res = await api.post('/auth/login', { email, password });

      const { token, rol, id, nombre } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol);
      localStorage.setItem('userId', id);
      localStorage.setItem('nombre', nombre);

      toast.success('Inicio de sesión exitoso');

      navigate('/dashboard');
    } catch (error) {
      console.error('Error de login:', error);
      toast.error('Email o contraseña incorrectos');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
        <div className='flex justify-center mb-6'>
          <img src={logo} alt='StockIt Logo' className='w-80 h-auto' />
        </div>
        <h2 className='text-2xl font-bold text-center mb-4'>Login</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-1 font-medium text-sm'>Email</label>
            <input
              type='email'
              className='w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && (
              <p className='text-red-500 text-sm mt-1'>{emailError}</p>
            )}
          </div>

          <div>
            <label className='block mb-1 font-medium text-sm'>Contraseña</label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='w-full border border-gray-300 p-2 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition'
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
