import React, { Component, ErrorInfo, ReactNode } from "react";
import { ExclamationTriangleIcon } from "../icons/ExclamationTriangleIcon";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component untuk menangkap error di child components.
 * Mencegah crash seluruh aplikasi dan menampilkan UI fallback.
 *
 * @example
 * <ErrorBoundary>
 *   <ComponentYangMungkinError />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error ke console (atau service eksternal)
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);

    // Callback opsional untuk parent component
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback jika disediakan
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-center w-16 h-16 mb-6 bg-red-100 rounded-full">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h2>

          <p className="text-gray-600 text-center max-w-md mb-6">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba muat ulang
            halaman atau hubungi administrator.
          </p>

          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Muat Ulang Halaman
            </button>
          </div>

          {/* Detail error untuk development */}
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-6 w-full max-w-2xl">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                Detail Error (Development Only)
              </summary>
              <div className="mt-3 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-auto text-xs font-mono">
                <p className="text-red-400 font-semibold mb-2">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                <pre className="text-gray-400 whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <pre className="mt-4 text-gray-500 whitespace-pre-wrap">
                    Component Stack:{this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-Order Component untuk wrapping component dengan ErrorBoundary.
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode,
): React.FC<P> {
  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `WithErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithErrorBoundary;
}

export default ErrorBoundary;
