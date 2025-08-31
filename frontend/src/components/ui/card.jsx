// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ title, subtitle }) => {
  return (
    <div className="p-4 border rounded-lg shadow hover:shadow-md transition bg-white">
      <h2 className="font-semibold text-lg text-green-800">{title}</h2>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

export default Card;
