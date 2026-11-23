
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type ToastType = 'success' | 'info' | 'error';

type ToastData = {
  message: string;
  type: ToastType;
  id: number;
};

type ToastContextType = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  info: 'i',
  error: '!',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [currentToast, setCurrentToast] = useState<ToastData | null>(null);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    setCurrentToast({
      message,
      type,
      id: Date.now(),
    });
  }, []);

  useEffect(() => {
    if (!currentToast) return;

    const timer = setTimeout(() => {
      setCurrentToast(null);
    }, 2800);

    return () => clearTimeout(timer);
  }, [currentToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="toast-container">
        <AnimatePresence mode="wait">
          {currentToast && (
            <motion.div
              key={currentToast.id}
              className={`toast toast-${currentToast.type}`}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              role="status"
              aria-live="polite"
            >
              <span className="toast-icon">
                {TOAST_ICONS[currentToast.type]}
              </span>

              <span className="toast-message">
                {currentToast.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
