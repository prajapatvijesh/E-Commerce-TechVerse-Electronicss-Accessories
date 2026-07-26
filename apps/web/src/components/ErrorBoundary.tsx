import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 p-4 font-sans">
          <div className="relative bg-white dark:bg-dark-800 rounded-3xl p-10 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-dark-700 overflow-hidden text-center">
            {/* Background glowing circle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-8 relative z-10 animate-bounce-subtle">
              <AlertTriangle
                className="text-red-500"
                size={48}
                strokeWidth={1.5}
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              Oops! Something Broke
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              We've encountered an unexpected error. Our team has been notified.
              Please try refreshing the page or navigating back home.
            </p>

            {this.state.error?.message && (
              <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl text-left border border-red-100 dark:border-red-500/20">
                <p className="text-sm font-mono text-red-600 dark:text-red-400 break-words line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transition-all active:scale-95"
              >
                <RefreshCcw size={18} />
                Refresh Page
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-200 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-600 border border-gray-200 dark:border-dark-600 transition-all active:scale-95"
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
