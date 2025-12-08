/**
 * ✅ PAYMENT SUCCESS PAGE
 * Shown after successful Stripe checkout
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('session_id');
    setSessionId(id);

    // Simple confetti effect (optional - just a visual celebration)
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      background: radial-gradient(circle, rgba(245,200,66,0.1) 0%, transparent 70%);
      animation: fadeOut 2s ease-out forwards;
    `;
    document.body.appendChild(confetti);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      setTimeout(() => {
        document.body.removeChild(confetti);
        document.head.removeChild(style);
      }, 2000);
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black leather-overlay pb-20">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="leather-card rounded-2xl p-8 stitched text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-6 glow-gold animate-pulse-slow">
            <span className="text-5xl">✅</span>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-black text-gold-400 mb-4 embossed">Paiement Réussi! 🎉</h1>
          <p className="text-leather-200 text-lg mb-6">
            Merci pour ton abonnement! Ton compte VIP est maintenant actif.
          </p>

          {/* Session ID (for debugging) */}
          {sessionId && (
            <div className="bg-leather-800 rounded-lg p-4 mb-6 text-left">
              <p className="text-leather-400 text-xs mb-1">Session ID:</p>
              <p className="text-gold-500 font-mono text-sm break-all">{sessionId}</p>
            </div>
          )}

          {/* Benefits Reminder */}
          <div className="bg-leather-800 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-white font-bold mb-3">🎁 Ce que tu obtiens maintenant:</h2>
            <ul className="space-y-2 text-leather-200 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-gold-500">✓</span>
                <span>Accès à toutes les fonctionnalités premium</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-500">✓</span>
                <span>Génération AI illimitée</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-500">✓</span>
                <span>Badge VIP vérifié</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-500">✓</span>
                <span>Boost de visibilité dans le feed</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/premium')} variant="primary" className="px-8 py-3">
              Voir Mon Abonnement
            </Button>
            <Button onClick={() => navigate('/')} variant="secondary" className="px-8 py-3">
              Aller au Feed
            </Button>
          </div>

          {/* Quebec Pride */}
          <div className="mt-8 pt-6 border-t border-leather-700">
            <p className="text-leather-400 text-sm flex items-center justify-center gap-2">
              <span className="text-gold-500">⚜️</span>
              <span>Merci de supporter Zyeuté!</span>
              <span className="text-gold-500">🇨🇦</span>
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
