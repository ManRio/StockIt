import { useEffect, useState } from 'react';
import ventasService from '../services/ventasService';
import ModalDetalleVenta from '../components/ModalDetalleVenta';
import toast from 'react-hot-toast';

const HistorialVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const rol = localStorage.getItem('rol');
  const userId = localStorage.getItem('userId');

  const cargarVentas = async () => {
    try {
      const data =
        rol === 'ADMIN'
          ? await ventasService.getTodas()
          : await ventasService.getPorUsuario(userId);

      setVentas(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Error al cargar ventas');
      console.error(error);
    }
  };

  const filtrarPorFechas = async () => {
    if (!fechaInicio || !fechaFin)
      return toast.error('Selecciona ambas fechas');

    try {
      const data =
        rol === 'ADMIN'
          ? await ventasService.getPorFecha(fechaInicio, fechaFin)
          : await ventasService.getPorUsuarioYFecha(
              userId,
              fechaInicio,
              fechaFin
            );

      setVentas(Array.isArray(data) ? data : []);
      setPaginaActual(1);
    } catch (error) {
      toast.error('Error al filtrar por fechas');
      console.error(error);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  // Protecciones para evitar errores si ventas no es un array
  const ventasSeguras = Array.isArray(ventas) ? ventas : [];
  const ventasPagina = ventasSeguras.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );
  const totalPaginas = Math.ceil(ventasSeguras.length / itemsPorPagina);

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-bold text-center'>Historial de Ventas</h2>

      {/* Filtros */}
      <div className='flex flex-wrap justify-center gap-4'>
        <input
          type='date'
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className='border p-2 rounded'
        />
        <input
          type='date'
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className='border p-2 rounded'
        />
        <button
          onClick={filtrarPorFechas}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Filtrar
        </button>
        <button
          onClick={cargarVentas}
          className='bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500'
        >
          Reset
        </button>
      </div>

      {/* Tabla */}
      <div className='overflow-x-auto border rounded-md'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-2 border'>ID</th>
              {rol === 'ADMIN' && <th className='p-2 border'>Usuario</th>}
              <th className='p-2 border'>Total</th>
              <th className='p-2 border'>Fecha</th>
              <th className='p-2 border'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventasPagina.map((venta) => (
              <tr key={venta.id}>
                <td className='p-2 border'>{venta.id}</td>
                {rol === 'ADMIN' && (
                  <td className='p-2 border'>{venta.usuario?.nombre}</td>
                )}
                <td className='p-2 border'>€{venta.total.toFixed(2)}</td>
                <td className='p-2 border'>
                  {new Date(venta.fecha).toLocaleString()}
                </td>
                <td className='p-2 border text-center'>
                  <button
                    onClick={() => setVentaSeleccionada(venta)}
                    className='bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700'
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
            {ventasPagina.length === 0 && (
              <tr>
                <td
                  colSpan={rol === 'ADMIN' ? 5 : 4}
                  className='p-4 text-center text-gray-500'
                >
                  No hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className='flex justify-between items-center'>
        <div>
          Mostrar:
          <select
            value={itemsPorPagina}
            onChange={(e) => {
              setItemsPorPagina(Number(e.target.value));
              setPaginaActual(1);
            }}
            className='ml-2 border p-1 rounded'
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className='flex gap-3 items-center'>
          <button
            onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
            disabled={paginaActual === 1}
            className='bg-gray-300 px-2 rounded disabled:opacity-50'
          >
            Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() =>
              setPaginaActual((p) => Math.min(p + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
            className='bg-gray-300 px-2 rounded disabled:opacity-50'
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de detalles */}
      {ventaSeleccionada && (
        <ModalDetalleVenta
          venta={ventaSeleccionada}
          onClose={() => setVentaSeleccionada(null)}
        />
      )}
    </div>
  );
};

export default HistorialVentas;
