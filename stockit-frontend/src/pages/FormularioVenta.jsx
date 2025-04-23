import { useEffect, useState } from 'react';
import ventasService from '../services/ventasService';
import productoService from '../services/productoService';
import toast from 'react-hot-toast';

const FormularioVenta = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState({
    nombre: '',
    cif: '',
    direccion: '',
    telefono: '',
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(25);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await productoService.getTodos();
      setProductos(data);
    } catch (error) {
      toast.error('Error al obtener productos');
      console.error(error);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const agregarAlCarrito = (producto) => {
    if (carrito.some((item) => item.producto.id === producto.id)) {
      return toast.error('Este producto ya está en el carrito');
    }
    if (producto.stock === 0) {
      return toast.error('Producto sin stock');
    }
    setCarrito([...carrito, { producto, cantidad: 1 }]);
  };

  const actualizarCantidad = (id, cantidad) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.producto.id === id ? { ...item, cantidad } : item
      )
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.producto.id !== id));
  };

  const totalVenta = carrito.reduce(
    (acc, item) => acc + item.cantidad * item.producto.precio,
    0
  );

  const registrarVenta = async () => {
    if (carrito.length === 0) return toast.error('El carrito está vacío');

    const detalles = carrito.map((item) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
    }));

    const payload = {
      usuarioId: Number(localStorage.getItem('userId')),
      detalles,
      cliente: Object.values(cliente).some(Boolean) ? cliente : undefined,
    };

    try {
      await ventasService.registrar(payload);
      toast.success('Venta registrada correctamente');
      setCarrito([]);
      setCliente({ nombre: '', cif: '', direccion: '', telefono: '' });
    } catch (error) {
      toast.error('Error al registrar venta');
      console.error(error);
    }
  };

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-bold text-center'>Nueva Venta</h2>

      <div className='flex flex-wrap justify-between items-center gap-4'>
        <input
          type='text'
          className='flex-1 border p-2 rounded-md'
          placeholder='Buscar producto'
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className='border p-2 rounded-md'
          value={itemsPorPagina}
          onChange={(e) => {
            setItemsPorPagina(Number(e.target.value));
            setPaginaActual(1);
          }}
        >
          {[25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} por página
            </option>
          ))}
        </select>
      </div>

      {/* Productos */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {productosPagina.map((p) => (
          <div key={p.id} className='border p-4 rounded-md shadow-sm'>
            <h3 className='font-semibold text-lg'>{p.nombre}</h3>
            <p className='text-sm text-gray-600'>{p.descripcion}</p>
            <p className='text-sm'>Stock: {p.stock}</p>
            <p className='text-sm'>€{p.precio}</p>
            <button
              onClick={() => agregarAlCarrito(p)}
              disabled={p.stock === 0}
              className={`mt-2 w-full px-3 py-1 rounded text-white ${
                p.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {p.stock === 0 ? 'Sin stock' : 'Añadir'}
            </button>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className='flex justify-center gap-4 mt-4'>
        <button
          onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
          disabled={paginaActual === 1}
          className='px-3 py-1 border rounded disabled:opacity-50'
        >
          Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className='px-3 py-1 border rounded disabled:opacity-50'
        >
          Siguiente
        </button>
      </div>

      {/* Cliente + Carrito */}
      <div className='grid md:grid-cols-3 gap-6'>
        <div className='md:col-span-2'>
          <h3 className='text-xl font-semibold mb-2'>Carrito</h3>
          {carrito.length === 0 ? (
            <p className='text-gray-500'>No hay productos en el carrito.</p>
          ) : (
            <table className='w-full border text-sm'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='p-2 border'>Producto</th>
                  <th className='p-2 border'>Precio</th>
                  <th className='p-2 border'>Cantidad</th>
                  <th className='p-2 border'>Subtotal</th>
                  <th className='p-2 border'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.producto.id}>
                    <td className='p-2 border'>{item.producto.nombre}</td>
                    <td className='p-2 border'>€{item.producto.precio}</td>
                    <td className='p-2 border'>
                      <input
                        type='number'
                        className='w-16 p-1 border rounded'
                        min='1'
                        max={item.producto.stock}
                        value={item.cantidad}
                        onChange={(e) =>
                          actualizarCantidad(
                            item.producto.id,
                            Number(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td className='p-2 border'>
                      €{(item.producto.precio * item.cantidad).toFixed(2)}
                    </td>
                    <td className='p-2 border'>
                      <button
                        onClick={() => eliminarDelCarrito(item.producto.id)}
                        className='text-red-600 hover:underline'
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className='text-right mt-4'>
            <span className='font-semibold text-lg'>
              Total: €{totalVenta.toFixed(2)}
            </span>
          </div>

          <div className='text-right mt-4'>
            <button
              onClick={registrarVenta}
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
            >
              Registrar Venta
            </button>
          </div>
        </div>

        {/* Datos Cliente */}
        <div>
          <h3 className='text-lg font-semibold mb-2'>
            Datos del cliente (opcional)
          </h3>
          {['nombre', 'cif', 'direccion', 'telefono'].map((campo) => (
            <input
              key={campo}
              type='text'
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
              value={cliente[campo]}
              onChange={(e) =>
                setCliente({ ...cliente, [campo]: e.target.value })
              }
              className='w-full border p-2 rounded mb-2'
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormularioVenta;
