import React from 'react';

interface LoadingDotsProps {
  text: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ text }) => {
  return (
    <>
      <style>
        {`
          @keyframes loadingDots {
            0%, 20% {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            80%, 100% {
              opacity: 0;
            }
          }
        
          .loading-dots .dot {
            animation: loadingDots 1.4s infinite;
            opacity: 0;
          }
        
          .loading-dots .dot:nth-child(2) {
            animation-delay: 0.2s;
          }
        
          .loading-dots .dot:nth-child(3) {
            animation-delay: 0.4s;
          }
        `}
      </style>
      <span className="inline-flex items-center">
        {text}
        <span className="loading-dots">
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </span>
      </span>
    </>
  );
};

export { LoadingDots };