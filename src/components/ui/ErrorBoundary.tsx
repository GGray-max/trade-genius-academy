
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Log to error monitoring service in production
    if (import.meta.env.PROD) {
      // TODO: Integrate with error monitoring service (e.g., Sentry)
      console.error('Production error:', { error, errorInfo });
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <details className="text-left mb-4 p-2 bg-gray-100 rounded text-sm">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
