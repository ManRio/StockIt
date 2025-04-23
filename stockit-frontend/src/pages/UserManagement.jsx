import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formUsuario, setFormUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'EMPLEADO',
  });
  const [rankingMensual, setRankingMensual] = useState([]);

  const obtenerUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      toast.error('Error al obtener usuarios');
      console.error(err);
    }
  };

  const obtenerRanking = async () => {
    try {
      const res = await api.get('/ventas/ranking-mensual');
      setRankingMensual(res.data);
    } catch (err) {
      toast.error('Error al obtener ranking');
      console.error(err);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
    obtenerRanking();
  }, []);

  const handleChange = (e) => {
    setFormUsuario({ ...formUsuario, [e.target.name]: e.target.value });
  };

  const cancelar = () => {
    setEditandoId(null);
    setFormUsuario({ nombre: '', email: '', password: '', rol: 'EMPLEADO' });
  };

  const guardar = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formUsuario.nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    if (!emailRegex.test(formUsuario.email)) {
      toast.error('Introduce un email válido');
      return;
    }

    if (!editandoId && formUsuario.password.length < 4) {
      toast.error('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    try {
      if (editandoId) {
        await api.put(`/usuarios/${editandoId}`, formUsuario);
        toast.success('Usuario actualizado');
      } else {
        await api.post('/auth/register', formUsuario);
        toast.success('Usuario creado');
      }
      obtenerUsuarios();
      cancelar();
    } catch (err) {
      toast.error('Error al guardar');
      console.error(err);
    }
  };

  const editar = (u) => {
    setEditandoId(u.id);
    setFormUsuario({
      nombre: u.nombre,
      email: u.email,
      password: '',
      rol: u.rol,
    });
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      toast.success('Usuario eliminado');
      obtenerUsuarios();
    } catch (err) {
      toast.error('Error al eliminar');
      console.error(err);
    }
  };

  return (
    <div className='p-6 space-y-10'>
      <div className='grid md:grid-cols-2 gap-6'>
        <Card>
          <CardContent className='space-y-4 pt-6'>
            <h2 className='text-xl font-bold text-center'>
              {editandoId ? 'Editar Usuario' : 'Crear Usuario'}
            </h2>

            <div>
              <label className='block text-sm mb-1'>Nombre</label>
              <Input
                name='nombre'
                value={formUsuario.nombre}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className='block text-sm mb-1'>Email</label>
              <Input
                name='email'
                value={formUsuario.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className='block text-sm mb-1'>Contraseña</label>
              <Input
                type='password'
                name='password'
                value={formUsuario.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className='block text-sm mb-1'>Rol</label>
              <select
                name='rol'
                value={formUsuario.rol}
                onChange={handleChange}
                className='w-full p-2 border rounded-md'
              >
                <option value='EMPLEADO'>EMPLEADO</option>
                <option value='ADMIN'>ADMIN</option>
              </select>
            </div>

            <div className='flex gap-2'>
              <Button className='w-full' onClick={guardar}>
                {editandoId ? 'Guardar cambios' : 'Crear'}
              </Button>
              {editandoId && (
                <Button className='w-full bg-gray-400' onClick={cancelar}>
                  Cancelar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className='overflow-x-auto border rounded-md'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='p-2 border'>Nombre</th>
                <th className='p-2 border'>Email</th>
                <th className='p-2 border'>Rol</th>
                <th className='p-2 border'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className='p-2 border'>{u.nombre}</td>
                  <td className='p-2 border'>{u.email}</td>
                  <td className='p-2 border'>{u.rol}</td>
                  <td className='p-2 border space-x-2 text-center'>
                    <button
                      className='bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm'
                      onClick={() => editar(u)}
                    >
                      Editar
                    </button>
                    <button
                      className='bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm'
                      onClick={() => eliminar(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan='4' className='text-center p-4 text-gray-500'>
                    No hay usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ranking mensual */}
      <div className='bg-white rounded shadow p-4 max-w-3xl mx-auto'>
        <h3 className='text-xl font-semibold mb-3 text-center'>
          🏆 Ranking Mensual de Ventas
        </h3>
        <ul className='divide-y divide-gray-200'>
          {rankingMensual.length > 0 ? (
            rankingMensual.map((item, index) => (
              <li key={index} className='py-2 flex justify-between'>
                <span className='font-medium'>{item.usuario}</span>
                <span className='text-blue-700 font-semibold'>
                  €{Number(item.total).toFixed(2)}
                </span>
              </li>
            ))
          ) : (
            <li className='text-center text-gray-500 py-4'>
              No hay datos disponibles.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;
