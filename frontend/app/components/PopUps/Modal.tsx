// app/components/Modal.tsx
'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // The backdrop uses a blur and a semi-transparent background for a modern aesthetic.
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/30"
      onClick={onClose}  // close when clicking on backdrop
    >
      {/* Stop propagation so clicking inside the modal does not close it */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-[600px] relative" onClick={(e) => e.stopPropagation()}>
        {/* Optional title */}
        {title && <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
