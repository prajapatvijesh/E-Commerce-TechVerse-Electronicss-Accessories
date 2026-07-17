import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-8 max-w-lg w-full shadow-lg border border-red-100 dark:border-red-900/30">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">An unexpected error occurred in the application.</p>
            <pre className="bg-gray-100 dark:bg-dark-900 p-4 rounded-lg text-sm text-red-500 overflow-auto max-h-64 whitespace-pre-wrap">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 w-full bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
