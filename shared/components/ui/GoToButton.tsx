import React from 'react';
import Button from './Button';

interface GoToButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

/**
 * 立即前往按鈕組件
 * 用於跳轉到其他頁面或執行特定操作
 */
const GoToButton: React.FC<GoToButtonProps> = ({ 
  onClick, 
  label = '立即前往',
  className = '' 
}) => {
  return (
    <Button
      variant="blue"
      onClick={onClick}
      className={`u-flex u-items-center u-inline-flex u-visible u-opacity-100 ${className}`}
    >
      {label}
    </Button>
  );
};

export default GoToButton; 