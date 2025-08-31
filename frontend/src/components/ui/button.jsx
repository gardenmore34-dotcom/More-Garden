import React from 'react';
import classNames from 'classnames';

const Button = ({ label, onClick, variant = 'primary', type = 'button', className = '' }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition duration-200';
  
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-white text-green-700 border border-green-600 hover:bg-green-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(baseStyles, variants[variant], className)}
    >
      {label}
    </button>
  );
};

export default Button;
