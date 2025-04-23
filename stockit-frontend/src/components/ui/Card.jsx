export function Card({ children }) {
  return (
    <div className='bg-white rounded-2xl shadow-md border p-6'>{children}</div>
  );
}

export function CardContent({ children }) {
  return <div className='mt-4'>{children}</div>;
}
