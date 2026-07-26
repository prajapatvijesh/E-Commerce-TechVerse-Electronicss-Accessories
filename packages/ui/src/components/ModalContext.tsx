import { createContext, useContext, useState, ReactNode } from 'react';
import { ConfirmModal } from './ConfirmModal';

interface ModalContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    setOptions(options);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolver({ resolve });
    });
  };

  const handleConfirm = () => {
    if (resolver) resolver.resolve(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolver) resolver.resolve(false);
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <ConfirmModal
          isOpen={isOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          title={options.title}
          message={options.message}
          confirmText={options.confirmText || 'Confirm'}
          cancelText={options.cancelText || 'Cancel'}
          variant={options.variant || 'danger'}
        />
      )}
    </ModalContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ModalProvider');
  }
  return context;
};
