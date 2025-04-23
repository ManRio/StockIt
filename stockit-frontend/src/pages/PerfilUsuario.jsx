import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const PerfilUsuario = () => {
  const userId = localStorage.getItem('userId');
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await api.get(`/usuarios/${userId}`);
        setUsuario({ ...res.data, password: '' }); // no mostramos la contraseña real
      } catch (err) {
        toast.error('Error al cargar datos del usuario');
        console.error(err);
      }
    };

    cargarPerfil();
  }, [userId]);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (!usuario.nombre || !usuario.email) {
      toast.error('Nombre y email son obligatorios');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usuario.email)) {
      toast.error('Email no válido');
      return;
    }

    if (usuario.password && usuario.password.length < 4) {
      toast.error('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    try {
      await api.put(`/usuarios/${userId}`, usuario);
      toast.success('Perfil actualizado');
      setUsuario({ ...usuario, password: '' });
    } catch (err) {
      toast.error('Error al actualizar perfil');
      console.error(err);
    }
  };

  return (
    <div className='max-w-xl mx-auto p-6 bg-white rounded shadow space-y-6'>
      <h2 className='text-2xl font-bold text-center'>Mi Perfil</h2>

      <div>
        <label className='block text-sm mb-1'>Nombre</label>
        <Input name='nombre' value={usuario.nombre} onChange={handleChange} />
      </div>

      <div>
        <label className='block text-sm mb-1'>Email</label>
        <Input name='email' value={usuario.email} onChange={handleChange} />
      </div>

      <div>
        <label className='block text-sm mb-1'>
          Nueva contraseña (opcional)
        </label>
        <Input
          type='password'
          name='password'
          value={usuario.password}
          onChange={handleChange}
        />
      </div>

      <Button className='w-full' onClick={handleGuardar}>
        Guardar cambios
      </Button>
    </div>
  );
};

export default PerfilUsuario;
