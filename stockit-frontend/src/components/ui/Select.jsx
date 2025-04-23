import React from 'react';

export const Select = ({ label, value, onChange, options, name }) => {
  return (
    <div className='w-full'>
      {label && (
        <label className='block mb-1 text-sm font-medium'>{label}</label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
