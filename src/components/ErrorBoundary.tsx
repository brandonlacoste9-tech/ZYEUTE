/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 */

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">⚜️</div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Oups! Quelque chose a planté
              </h1>
              <p className="text-white/60 mb-6">
                Une erreur est survenue. Pas de panique, on règle ça!
              </p>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm font-mono text-left overflow-auto">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-gold-gradient text-black font-semibold rounded-xl hover:scale-105 transition-transform"
              >
                Recharger la page
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full px-6 py-3 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>

            <p className="mt-6 text-white/40 text-sm">
              Si le problème persiste, contacte le support 💬
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple error fallback for smaller sections
export const ErrorFallback: React.FC<{ error?: Error; onRetry?: () => void }> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-4xl mb-4">😕</div>
      <h3 className="text-lg font-bold text-white mb-2">
        Erreur de chargement
      </h3>
      {error && (
        <p className="text-white/60 text-sm mb-4 max-w-md">
          {error.message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-gold-gradient text-black font-semibold rounded-lg hover:scale-105 transition-transform"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};

