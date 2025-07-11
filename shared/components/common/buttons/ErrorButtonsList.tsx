import React from 'react';
import { ErrorButtonsListProps } from '../../../types';

const ErrorButtonsList: React.FC<ErrorButtonsListProps> = ({ buttons }) => {
  return (
    <div>
      <h2 className="u-text-xl u-font-bold u-mb-4">系統狀態演示</h2>
      <div className="u-grid u-grid-cols-1 u-gap-3">
        {buttons.map((button, index) => (
          <button
            key={index}
            className="u-w-full u-bg-white u-py-3 u-px-4 u-border u-border-gray-300 u-rounded-lg u-text-left u-shadow-sm hover:u-bg-gray-50"
            onClick={button.onClick}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ErrorButtonsList; 