import React, { type ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  title?: string;
  children: ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  // Create a div for the modal root if it doesn't exist
  const modalRoot = document.getElementById('modal-root') || createModalRoot();

  useEffect(() => {
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>,
    modalRoot
  );
};

function createModalRoot() {
  const root = document.createElement('div');
  root.id = 'modal-root';
  document.body.appendChild(root);
  return root;
}

export default Modal;
