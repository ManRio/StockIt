import api from './api';

const getTodas = async () => {
  const res = await api.get('/ventas');
  return res.data;
};

const getPorFecha = async (inicio, fin) => {
  const res = await api.get('/ventas/por-fecha', {
    params: {
      inicio: `${inicio}T00:00:00`,
      fin: `${fin}T23:59:59`,
    },
  });
  return res.data;
};

const getPorUsuario = async (usuarioId) => {
  const res = await api.get(`/ventas/usuario/${usuarioId}`);
  return res.data;
};

const getPorUsuarioYFecha = async (usuarioId, inicio, fin) => {
  const res = await api.get(`/ventas/usuario/${usuarioId}/por-fecha`, {
    params: {
      inicio: `${inicio}T00:00:00`,
      fin: `${fin}T23:59:59`,
    },
  });
  return res.data;
};

const getReporteMensual = async () => {
  const res = await api.get('/ventas/reporte-mensual');
  return res.data;
};

const getRankingMensual = async () => {
  const res = await api.get('/ventas/ranking-mensual');
  return res.data;
};

const registrar = async (payload) => {
  const res = await api.post('/ventas', payload);
  return res.data;
};

export default {
  getTodas,
  getPorFecha,
  getPorUsuario,
  getPorUsuarioYFecha,
  getReporteMensual,
  getRankingMensual,
  registrar,
};
