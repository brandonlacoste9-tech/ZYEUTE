/**
 * 💳 SUBSCRIBE BUTTON COMPONENT
 * Reusable button component for initiating Stripe checkout
 */

import React, { useState } from 'react';
import { Button } from './Button';
import { supabase } from '../lib/supabase';

interface SubscribeButtonProps {
  priceId: string;
  className?: string;
  children?: React.ReactNode;
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  priceId,
  className = '',
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ tier: priceId }), // The backend expects "tier", not "priceId"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Erreur lors de la création du paiement: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className={className} variant="primary">
      {isLoading ? 'Chargement...' : children || "S'abonner"}
    </Button>
  );
};
