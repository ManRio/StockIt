import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Logo from '../assets/logo.png';

const ModalDetalleVenta = ({ venta, onClose }) => {
  const componenteRef = useRef();

  const exportarPDF = async () => {
    const canvas = await html2canvas(componenteRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`factura_venta_${venta.id}.pdf`);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-6'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-600 hover:text-black'
        >
          ✕
        </button>

        {/* Vista de factura */}
        <div
          ref={componenteRef}
          className='mx-auto bg-white text-black'
          style={{
            width: '794px',
            minHeight: '1123px',
            padding: '40px',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div className='flex justify-between items-start mb-4'>
            <div>
              <img src={Logo} alt='Logo' className='h-12 mb-1' />
              <h1 className='text-xl font-bold'>StockIt Logistics</h1>
            </div>
            <div className='text-right text-sm'>
              <p>
                <strong>Cliente:</strong> {venta.cliente?.nombre || ''}
              </p>
              <p>
                <strong>CIF/NIF:</strong> {venta.cliente?.cif || ''}
              </p>
              <p>
                <strong>Dirección:</strong> {venta.cliente?.direccion || ''}
              </p>
              <p>
                <strong>Teléfono:</strong> {venta.cliente?.telefono || ''}
              </p>
            </div>
          </div>

          <hr className='my-4' />

          <div className='mb-4'>
            <p>
              <strong>Factura ID:</strong> {venta.id}
            </p>
            <p>
              <strong>Fecha:</strong> {new Date(venta.fecha).toLocaleString()}
            </p>
            <p>
              <strong>Vendedor:</strong>{' '}
              {venta.usuario?.nombre || 'No disponible'}
            </p>
          </div>

          <table className='w-full border text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='border p-2 text-left'>Producto</th>
                <th className='border p-2 text-right'>Cantidad</th>
                <th className='border p-2 text-right'>Precio/U</th>
                <th className='border p-2 text-right'>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles?.map((detalle, i) => (
                <tr key={i}>
                  <td className='border p-2'>{detalle.producto?.nombre}</td>
                  <td className='border p-2 text-right'>{detalle.cantidad}</td>
                  <td className='border p-2 text-right'>
                    €{detalle.producto?.precio?.toFixed(2)}
                  </td>
                  <td className='border p-2 text-right'>
                    €{detalle.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className='font-bold'>
                <td colSpan={3} className='border p-2 text-right'>
                  Total:
                </td>
                <td className='border p-2 text-right'>
                  €{venta.total?.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <p className='mt-6 text-sm italic text-center text-gray-700'>
            ¡Gracias por su compra! Para cualquier duda o devolución,
            contáctenos.
          </p>
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <button
            onClick={exportarPDF}
            className='bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700'
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleVenta;
