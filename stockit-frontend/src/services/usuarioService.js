import api from './api';

const getTodos = async () => (await api.get('/usuarios')).data;
const crear = async (data) => (await api.post('/auth/register', data)).data;
const actualizar = async (id, data) => (await api.put(`/usuarios/${id}`, data)).data;
const eliminar = async (id) => (await api.delete(`/usuarios/${id}`)).data;

export default {
  getTodos,
  crear,
  actualizar,
  eliminar,
};