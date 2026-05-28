import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  // Prevent scrolling behind modal when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-bg-card border border-border rounded-card p-6 w-full max-w-md mx-4 relative shadow-2xl animate-fade-in-up"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
