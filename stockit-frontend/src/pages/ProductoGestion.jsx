import { useEffect, useState } from 'react';
import productoService from '../services/productoService';
import toast from 'react-hot-toast';
import ModalDetalleProducto from '../components/ModalDetalleProducto';

const ProductoGestion = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('nombre');
  const [direccion, setDireccion] = useState('asc');
  const [itemsPorPagina, setItemsPorPagina] = useState(25);
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtroStock, setFiltroStock] = useState('TODOS');

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    ubicacion: '',
  });

  const [editando, setEditando] = useState(null);
  const [productoDetalle, setProductoDetalle] = useState(null);

  const cargarProductos = async () => {
    try {
      const data = await productoService.getTodos();
      setProductos(data);
    } catch (err) {
      toast.error('Error al cargar productos');
      console.error(err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async () => {
    try {
      if (editando) {
        await productoService.actualizar(editando, form);
        toast.success('Producto actualizado');
      } else {
        await productoService.crear(form);
        toast.success('Producto creado');
      }
      setForm({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        imagenUrl: '',
        ubicacion: '',
      });
      setEditando(null);
      cargarProductos();
    } catch (err) {
      toast.error('Error al guardar producto');
      console.error(err);
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await productoService.eliminar(id);
      toast.success('Producto eliminado');
      cargarProductos();
    } catch (err) {
      toast.error('Error al eliminar producto');
      console.error(err);
    }
  };

  const productosFiltrados = productos
    .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((p) => {
      if (filtroStock === 'BAJO') return p.stock > 0 && p.stock < 5;
      if (filtroStock === 'SIN') return p.stock === 0;
      return true;
    })
    .sort((a, b) => {
      const campoA = a[orden];
      const campoB = b[orden];

      if (!campoA || !campoB) return 0;
      const aVal = typeof campoA === 'string' ? campoA.toLowerCase() : campoA;
      const bVal = typeof campoB === 'string' ? campoB.toLowerCase() : campoB;

      return direccion === 'asc'
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });

  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const ultimosCinco = [...productos]
    .sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))
    .slice(0, 5);

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-bold text-center'>Gestión de Productos</h2>

      <div className='grid md:grid-cols-2 gap-6'>
        {/* Formulario */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-center'>
            {editando ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          {[
            'nombre',
            'descripcion',
            'precio',
            'stock',
            'imagenUrl',
            'ubicacion',
          ].map((campo) => (
            <input
              key={campo}
              type={campo === 'precio' || campo === 'stock' ? 'number' : 'text'}
              name={campo}
              value={form[campo]}
              onChange={handleChange}
              placeholder={campo}
              className='w-full border p-2 rounded'
            />
          ))}
          <button
            className='bg-blue-600 text-white py-2 px-4 rounded w-full'
            onClick={guardar}
          >
            {editando ? 'Actualizar' : 'Crear'}
          </button>
        </div>

        {/* Últimos 5 */}
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold text-center'>
            Últimos 5 Productos
          </h3>
          <ul className='space-y-1'>
            {ultimosCinco.map((p) => (
              <li
                key={p.id}
                className='border p-2 rounded flex justify-between'
              >
                <span>{p.nombre}</span>
                <button
                  className='text-indigo-600 hover:underline'
                  onClick={() => setProductoDetalle(p)}
                >
                  Ver
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Buscador y filtros */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <input
          type='text'
          placeholder='Buscar producto...'
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className='border p-2 rounded w-full md:w-1/4'
        />

        <div className='flex gap-2'>
          <button
            onClick={() => setFiltroStock('TODOS')}
            className={`px-3 py-1 rounded ${
              filtroStock === 'TODOS' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroStock('BAJO')}
            className={`px-3 py-1 rounded ${
              filtroStock === 'BAJO'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            Bajo stock
          </button>
          <button
            onClick={() => setFiltroStock('SIN')}
            className={`px-3 py-1 rounded ${
              filtroStock === 'SIN' ? 'bg-red-500 text-white' : 'bg-gray-200'
            }`}
          >
            Sin stock
          </button>
        </div>

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className='border p-2 rounded'
        >
          <option value='nombre'>Nombre</option>
          <option value='ubicacion'>Ubicación</option>
          <option value='creadoEn'>Fecha creación</option>
        </select>

        <select
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className='border p-2 rounded'
        >
          <option value='asc'>Ascendente</option>
          <option value='desc'>Descendente</option>
        </select>

        <select
          value={itemsPorPagina}
          onChange={(e) => {
            setItemsPorPagina(Number(e.target.value));
            setPaginaActual(1);
          }}
          className='border p-2 rounded'
        >
          {[25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} por página
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className='overflow-auto max-h-[600px] border rounded'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='border p-2'>Nombre</th>
              <th className='border p-2'>Ubicación</th>
              <th className='border p-2'>Stock</th>
              <th className='border p-2'>Creado</th>
              <th className='border p-2'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPagina.map((p) => (
              <tr
                key={p.id}
                className={`${
                  p.stock === 0
                    ? 'bg-red-100'
                    : p.stock < 5
                    ? 'bg-yellow-100'
                    : ''
                }`}
              >
                <td className='border p-2'>{p.nombre}</td>
                <td className='border p-2'>{p.ubicacion}</td>
                <td className='border p-2'>{p.stock}</td>
                <td className='border p-2'>
                  {new Date(p.creadoEn).toLocaleString()}
                </td>
                <td className='border p-2 space-x-2'>
                  <button
                    className='text-blue-600 hover:underline'
                    onClick={() => {
                      setEditando(p.id);
                      setForm(p);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className='text-red-600 hover:underline'
                    onClick={() => eliminar(p.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className='text-indigo-600 hover:underline'
                    onClick={() => setProductoDetalle(p)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className='flex justify-center items-center gap-4 pt-4'>
        <button
          onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
          disabled={paginaActual === 1}
          className='px-3 py-1 bg-gray-300 rounded disabled:opacity-50'
        >
          Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className='px-3 py-1 bg-gray-300 rounded disabled:opacity-50'
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      {productoDetalle && (
        <ModalDetalleProducto
          producto={productoDetalle}
          onClose={() => setProductoDetalle(null)}
        />
      )}
    </div>
  );
};

export default ProductoGestion;
