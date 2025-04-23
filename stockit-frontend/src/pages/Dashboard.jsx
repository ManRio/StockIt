import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ModalDetalleProducto from '../components/ModalDetalleProducto';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const rol = localStorage.getItem('rol');
  const userId = localStorage.getItem('userId');

  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [reporteMensual, setReporteMensual] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [productoDetalle, setProductoDetalle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProductos = await api.get('/productos');
        setProductos(resProductos.data || []);

        if (rol === 'ADMIN') {
          const [resReporte, resUsuarios, resVentas, resPopulares] =
            await Promise.all([
              api.get('/ventas/reporte-mensual'),
              api.get('/usuarios'),
              api.get('/ventas'),
              api.get('/ventas/productos-mas-vendidos'),
            ]);

          setReporteMensual(resReporte.data || []);
          setUsuarios(resUsuarios.data || []);
          setVentas(resVentas.data || []);
          setProductosMasVendidos(resPopulares.data || []);
        } else {
          const resVentasUsuario = await api.get(`/ventas/usuario/${userId}`);
          setVentas(resVentasUsuario.data || []);
        }
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      }
    };

    fetchData();
  }, [rol, userId]);

  const ventasDelMes = ventas
    .filter(
      (v) => v.fecha && new Date(v.fecha).getMonth() === new Date().getMonth()
    )
    .reduce((acc, v) => acc + (v.total || 0), 0);

  const ultimasVentas = [...ventas]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  return (
    <div className='p-6 space-y-8'>
      <h1 className='text-2xl font-bold text-center'>
        {rol === 'ADMIN' ? 'Panel de Administrador' : 'Panel del Empleado'}
      </h1>

      <div className='flex flex-wrap gap-4 justify-center pt-4'>
        {rol === 'ADMIN' ? (
          <>
            <Link
              to='/admin/usuarios'
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Gestionar Usuarios
            </Link>
            <Link
              to='/admin/productos'
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
            >
              Gestionar Productos
            </Link>
            <Link
              to='/ventas/nueva'
              className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700'
            >
              Nueva Venta
            </Link>
            <Link
              to='/ventas/historial'
              className='bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700'
            >
              Historial de Ventas
            </Link>
            <Link
              to='/ventas/reporte'
              className='bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700'
            >
              Reporte Mensual
            </Link>
          </>
        ) : (
          <>
            <Link
              to='/ventas/nueva'
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              🛒 Nueva Venta
            </Link>
            <Link
              to='/ventas/historial'
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
            >
              📄 Historial de Ventas
            </Link>
          </>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {rol === 'ADMIN' && (
          <div className='bg-blue-100 p-4 rounded shadow'>
            <h3 className='text-lg font-semibold'>Usuarios Registrados</h3>
            <p className='text-3xl font-bold'>{usuarios.length}</p>
          </div>
        )}
        <div className='bg-green-100 p-4 rounded shadow'>
          <h3 className='text-lg font-semibold'>Productos en Inventario</h3>
          <p className='text-3xl font-bold'>{productos.length}</p>
        </div>
        <div className='bg-yellow-100 p-4 rounded shadow'>
          <h3 className='text-lg font-semibold'>Ventas del Mes</h3>
          <p className='text-3xl font-bold'>€{ventasDelMes.toFixed(2)}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {rol === 'ADMIN' && (
          <div className='bg-white p-4 rounded shadow'>
            <h2 className='text-xl font-bold mb-2'>
              Resumen mensual de ventas
            </h2>
            {reporteMensual.length > 0 ? (
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={reporteMensual}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='mes' />
                  <YAxis />
                  <Tooltip formatter={(v) => `€${v.toFixed(2)}`} />
                  <Bar dataKey='total' fill='#2563eb' />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className='text-center text-gray-500'>
                No hay datos del gráfico.
              </p>
            )}
          </div>
        )}

        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-xl font-bold mb-2'>
            {rol === 'ADMIN' ? 'Últimas Ventas' : 'Tus últimas ventas'}
          </h2>
          <ul className='divide-y divide-gray-200'>
            {ultimasVentas.length > 0 ? (
              ultimasVentas.map((venta) => (
                <li key={venta.id} className='py-2'>
                  <div className='flex justify-between'>
                    <span>{new Date(venta.fecha).toLocaleString()}</span>
                    <span className='font-semibold'>
                      €{venta.total.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className='text-gray-500 text-center py-4'>
                No hay ventas registradas.
              </li>
            )}
          </ul>
        </div>
      </div>

      {rol === 'ADMIN' && (
        <div className='bg-white p-4 rounded shadow max-w-xl mx-auto'>
          <h2 className='text-xl font-bold mb-4 text-center'>
            🏆 Productos Más Vendidos
          </h2>
          <ul className='divide-y divide-gray-200'>
            {productosMasVendidos.length > 0 ? (
              productosMasVendidos.slice(0, 10).map((item, index) => {
                const producto = productos.find(
                  (p) => p.nombre === item.nombre
                );

                return (
                  <li
                    key={index}
                    className='py-2 flex justify-between items-center'
                  >
                    <div>
                      <p className='font-medium'>{item.nombre}</p>
                      <p className='text-sm text-gray-500'>
                        {item.cantidad} vendidos
                      </p>
                    </div>
                    <button
                      className='text-indigo-600 hover:underline text-sm'
                      onClick={() => producto && setProductoDetalle(producto)}
                    >
                      Ver
                    </button>
                  </li>
                );
              })
            ) : (
              <li className='text-gray-500 text-center py-4'>
                No hay datos disponibles.
              </li>
            )}
          </ul>
        </div>
      )}

      {productoDetalle && (
        <ModalDetalleProducto
          producto={productoDetalle}
          onClose={() => setProductoDetalle(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
