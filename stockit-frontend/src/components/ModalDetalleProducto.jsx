import { Dialog } from '@headlessui/react';
import { Fragment } from 'react';

const ModalDetalleProducto = ({ producto, onClose }) => {
  if (!producto) return null;

  return (
    <Dialog open={!!producto} onClose={onClose} as={Fragment}>
      <div className='fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center'>
        <Dialog.Panel className='bg-white rounded-lg p-6 shadow-lg w-full max-w-md'>
          <Dialog.Title className='text-xl font-bold mb-4'>
            {producto.nombre}
          </Dialog.Title>

          {producto.imagenUrl && (
            <img
              src={producto.imagenUrl}
              alt={producto.nombre}
              className='w-full h-48 object-cover rounded mb-4'
            />
          )}

          <p>
            <strong>Descripción:</strong> {producto.descripcion}
          </p>
          <p>
            <strong>Precio:</strong> €{producto.precio}
          </p>
          <p>
            <strong>Stock:</strong> {producto.stock}
          </p>
          <p>
            <strong>Ubicación:</strong> {producto.ubicacion}
          </p>

          <div className='text-right mt-4'>
            <button
              onClick={onClose}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Cerrar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalDetalleProducto;
