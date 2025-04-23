import { useEffect, useState } from 'react';
import ventasService from '../services/ventasService';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const ReporteMensual = () => {
  const [datos, setDatos] = useState([]);
  const [rankingMensual, setRankingMensual] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await ventasService.getReporteMensual();
        setDatos(data);

        const ranking = await ventasService.getRankingMensual();
        setRankingMensual(ranking);
      } catch (err) {
        toast.error('Error al obtener reporte o ranking');
        console.error(err);
      }
    };
    cargar();
  }, []);

  const totalVendido = datos.reduce((sum, v) => sum + (v.total || 0), 0);
  const totalProductos = datos.reduce((sum, v) => {
    return sum + (Array.isArray(v.detalles) ? v.detalles.reduce((acc, d) => acc + (d.cantidad || 0), 0) : 0);
  }, 0);

  return (
    <div className='p-6 space-y-8'>
      <h2 className='text-2xl font-bold text-center'>
        📊 Reporte de Ventas Mensual
      </h2>

      {/* Tarjetas resumen */}
      <div className='flex flex-wrap justify-center gap-6 text-center'>
        <div className='bg-blue-100 rounded p-4 shadow'>
          <h4 className='text-sm text-gray-600'>Total Vendido</h4>
          <p className='text-lg font-bold text-green-600'>
            €{totalVendido.toFixed(2)}
          </p>
        </div>
        <div className='bg-yellow-100 rounded p-4 shadow'>
          <h4 className='text-sm text-gray-600'>Productos Vendidos</h4>
          <p className='text-lg font-bold'>{totalProductos}</p>
        </div>
        <div className='bg-purple-100 rounded p-4 shadow'>
          <h4 className='text-sm text-gray-600'>Ventas Totales</h4>
          <p className='text-lg font-bold'>{datos.length}</p>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className='h-[400px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='fecha' />
            <YAxis />
            <Tooltip formatter={(v) => `€${v.toFixed(2)}`} />
            <Bar dataKey='total' fill='#2563eb' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ranking mensual */}
      <div className='bg-white rounded shadow p-4 max-w-3xl mx-auto'>
        <h3 className='text-xl font-semibold mb-4 text-center'>
          🏆 Ranking de Usuarios por Ventas (Mes Actual)
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

export default ReporteMensual;