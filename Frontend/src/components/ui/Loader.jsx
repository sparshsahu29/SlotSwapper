import React from 'react';

export const Loader = ({ size = 'md', message = '', className = '' }) => {
  let spinnerSize = 'h-5 w-5';
  if (size === 'sm') spinnerSize = 'h-4 w-4 border';
  else if (size === 'lg') spinnerSize = 'h-8 w-8 border-[3px]';

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}>
      <div className={`animate-spin rounded-full border border-border border-t-accent ${spinnerSize}`} />
      {message && <p className="text-text-secondary text-sm font-medium">{message}</p>}
    </div>
  );
};

export default Loader;
