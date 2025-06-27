// src/components/3-organisms/Dialog/dialog.component.tsx
import React, { type ReactNode } from 'react';
import './dialog.component.scss';

// Define the props for our new Dialog component
interface DialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode; // 'children' will be the content inside the dialog
}

export const Dialog: React.FC<DialogProps> = ({ title, onClose, children }) => {
  return (
    // The dark background overlay. Clicking it will close the dialog.
    <div className="dialog-overlay" onClick={onClose}>
      {/* 
        The main dialog box. We stop click propagation here so that
        clicking inside the dialog doesn't close it.
      */}
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2 className="dialog-title">{title}</h2>
          <button className="dialog-close-button" onClick={onClose} title="Close">
            ×
          </button>
        </div>
        <div className="dialog-body">
          {children}
        </div>
      </div>
    </div>
  );
};