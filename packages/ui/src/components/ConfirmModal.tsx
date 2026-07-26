import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X } from 'lucide-react';
import { Button } from './Button';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const Icon =
    variant === 'danger'
      ? AlertTriangle
      : variant === 'warning'
        ? AlertTriangle
        : Info;
  const iconColor =
    variant === 'danger'
      ? 'text-red-500'
      : variant === 'warning'
        ? 'text-yellow-500'
        : 'text-blue-500';
  const iconBg =
    variant === 'danger'
      ? 'bg-red-100 dark:bg-red-500/20'
      : variant === 'warning'
        ? 'bg-yellow-100 dark:bg-yellow-500/20'
        : 'bg-blue-100 dark:bg-blue-500/20';
  const buttonVariant = variant === 'danger' ? 'danger' : 'primary';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden border border-gray-100 dark:border-dark-700"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl flex-shrink-0 ${iconBg}`}>
                <Icon className={iconColor} size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {message}
                </p>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    {cancelText}
                  </Button>
                  <Button variant={buttonVariant as any} onClick={onConfirm}>
                    {confirmText}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
