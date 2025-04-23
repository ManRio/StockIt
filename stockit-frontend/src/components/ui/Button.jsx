export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className='bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2 py-2 px-4 rounded-lg transition-colors duration-200'
    >
      {children}
    </button>
  );
}
