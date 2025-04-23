import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  History,
  PackageSearch,
  Users,
  BarChart,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.png';

const Sidebar = () => {
  const rol = localStorage.getItem('rol');
  const nombre = localStorage.getItem('nombre');
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { label: 'Mi Perfil', to: '/perfil', icon: <User size={18} /> },
    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Nueva Venta', to: '/ventas/nueva', icon: <ShoppingCart size={18} /> },
    { label: 'Historial de Ventas', to: '/ventas/historial', icon: <History size={18} /> },
    ...(rol === 'ADMIN'
      ? [
          { label: 'Gestión de Productos', to: '/admin/productos', icon: <PackageSearch size={18} /> },
          { label: 'Gestión de Usuarios', to: '/admin/usuarios', icon: <Users size={18} /> },
          { label: 'Reporte Mensual', to: '/ventas/reporte', icon: <BarChart size={18} /> },
        ]
      : []),
  ];

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className='flex flex-col h-full'>
      {/* LOGO + usuario */}
      <div className='flex flex-col items-center gap-1 mt-6 mb-12 px-4'>
        <img src={logo} alt='Logo' className='h-20' />
        <span className='text-sm font-medium text-gray-600 text-center'>
          Bienvenido, {nombre || 'Usuario'}
        </span>
        <button className='md:hidden mt-2 text-gray-500' onClick={() => setIsOpen(false)}>
          <X />
        </button>
      </div>

      <nav className='flex-1 space-y-2 px-2'>
        {menu.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-blue-100 ${
              location.pathname === item.to ? 'bg-blue-100 font-medium' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className='mt-auto mb-6 px-2 pb-4'>
        <button
          onClick={logout}
          className='flex items-center gap-2 text-sm text-red-600 hover:underline'
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className='hidden md:flex w-64 bg-white shadow-md h-screen sticky top-0'>
        <SidebarContent />
      </aside>

      {/* Mobile toggle button */}
      <button
        className='md:hidden fixed top-4 left-4 z-50 bg-white border rounded-full p-2 shadow'
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </button>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className='fixed inset-0 z-40 bg-black bg-opacity-30' onClick={() => setIsOpen(false)}>
          <div
            className='absolute left-0 top-0 w-64 bg-white shadow-md h-full'
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;