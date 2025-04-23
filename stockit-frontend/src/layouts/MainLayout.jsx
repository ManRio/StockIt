import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className='min-h-screen flex'>
      <Sidebar />
      <div className='flex-1 bg-gray-50 overflow-y-auto'>
        <main className='p-6'>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
