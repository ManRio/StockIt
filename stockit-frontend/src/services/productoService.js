import api from './api';

const getTodos = async () => (await api.get('/productos')).data;
const crear = async (data) => (await api.post('/productos', data)).data;
const actualizar = async (id, data) => (await api.put(`/productos/${id}`, data)).data;
const eliminar = async (id) => (await api.delete(`/productos/${id}`)).data;

export default {
  getTodos,
  crear,
  actualizar,
  eliminar,
};