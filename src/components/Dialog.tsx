import React, { PropsWithChildren, useEffect } from 'react';

export type DialogProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
}>;

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
  // Handle the Escape key press to close the dialog
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  // Close dialog when clicking outside of it
  const handleClickOutside = (
    event: React.MouseEvent<HTMLDialogElement, MouseEvent>,
  ) => {
    if ((event.target as HTMLElement).nodeName === 'DIALOG') {
      onClose();
    }
  };

  return (
    <dialog
      open={isOpen}
      className="fixed inset-0 z-10 overflow-y-auto w-full bg-transparent min-h-screen px-4 text-center"
      onClick={handleClickOutside}
    >
      <div
        className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </dialog>
  );
};

export default Dialog;
