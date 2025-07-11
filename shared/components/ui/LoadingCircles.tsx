import React from 'react';

interface LoadingCirclesProps {
  className?: string;
  animationClass?: string;
}

const LoadingCircles: React.FC<LoadingCirclesProps> = ({
  className = '',
  animationClass = 'u-animate-loading-3d-spin'
}) => {
  return (
    <div className={`dots-container ${className}`}>
      <div className={`dots-row ${animationClass}`}>
        <div className="dot dot-1" style={{ left: '18px' }}></div>
        <div className="dot dot-2" style={{ left: '18px' }}></div>
        <div className="dot dot-3" style={{ left: '18px' }}></div>
      </div>
    </div>
  );
};

export default LoadingCircles; 