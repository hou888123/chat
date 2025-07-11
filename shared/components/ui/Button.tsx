import React from 'react';
import { ButtonProps } from '../../types';

const Button: React.FC<ButtonProps> = ({
  label,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  type = 'button',
}) => {
  const baseClasses = 'u-rounded-lg u-font-medium u-transition-colors u-duration-200 u-ease-in-out';
  
  const variantClasses = {
    primary: 'u-bg-blue-600 u-text-white hover:u-bg-blue-700 active:u-bg-blue-800',
    secondary: 'u-bg-gray-200 u-text-gray-800 hover:u-bg-gray-300 active:u-bg-gray-400',
    outline: 'u-bg-transparent u-border u-border-gray-300 u-text-gray-700 hover:u-bg-gray-50 active:u-bg-gray-100',
    blue: 'u-bg-blue-1000 u-text-white hover:u-bg-blue-900 active:u-bg-blue-800',
  };
  
  const sizeClasses = {
    small: 'u-px-3 u-py-1 u-text-sm',
    medium: 'u-px-4 u-py-2',
    large: 'u-px-6 u-py-3 u-text-lg',
  };
  
  const widthClass = fullWidth ? 'u-w-full' : '';
  const disabledClass = disabled ? 'u-opacity-50 u-cursor-not-allowed' : 'u-cursor-pointer';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children || label}
    </button>
  );
};

export default Button; 