'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import confetti from 'canvas-confetti';

const successLogger = logger.withContext('Success');

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [user, setUser] = React.useState<any>(null);
  const [subscription, setSubscription] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        // Get session_id from URL
        const sessionId = searchParams.get('session_id');

        if (sessionId && user) {
          // Fetch subscription details
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          setSubscription(subscription);
        }

        setLoading(false);

        // Trigger confetti
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }, 500);
      } catch (error) {
        successLogger.error('Error fetching success data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-400 animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const getTierBenefits = () => {
    if (!subscription) return [];

    // This would be more sophisticated in production
    // For now, return generic benefits
    return [
      'Badge VIP exclusif',
      'Support aux créateurs québécois',
      'Accès anticipé aux nouvelles fonctionnalités',
      'Ti-Guy Assistant IA (si Argent+)',
      'Ti-Guy Artiste (si Argent+)',
      'Ti-Guy Studio (si Or)',
      'Support prioritaire (si Or)',
    ];
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gold-400">
              Zyeuté
            </Link>
          </div>
        </div>
      </div>

      {/* Success Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-gold-400 mb-4">
            Félicitations! Bienvenue dans le VIP! 🔥⚜️
          </h1>
          <p className="text-xl text-white/80">
            Merci d'avoir rejoint l'élite du Québec numérique. Ton soutien nous aide à construire
            l'avenir du contenu québécois.
          </p>
        </div>

        {/* Benefits Card */}
        <div className="bg-gradient-to-br from-gold-900/20 to-gold-800/20 rounded-2xl p-8 mb-8 border border-gold-500/20">
          <h2 className="text-2xl font-bold text-gold-400 mb-6 text-center">Tes avantages VIP</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {getTierBenefits().map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <span className="text-white">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg">
                Explorer Zyeuté
              </Button>
            </Link>

            <Link href="/profile">
              <Button variant="outline" size="lg">
                Voir mon profil
              </Button>
            </Link>
          </div>

          <p className="text-white/60 text-sm mt-8">
            Une question? Contacte-nous à{' '}
            <a href="mailto:vip@zyeute.ca" className="text-gold-400 hover:underline">
              vip@zyeute.ca
            </a>
          </p>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-16">
          <p className="text-white/40 text-sm">Fait au Québec, pour le Québec 🇨🇦</p>
        </div>
      </div>
    </div>
  );
}
