'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { SubscribeButton } from '@/components/SubscribeButton';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

const premiumLogger = logger.withContext('Premium');

export default function PremiumPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, [supabase]);

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gold-400">
              Zyeuté VIP
            </Link>
            <Link href="/">
              <Button variant="outline">Retour à l'accueil</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gold-400 mb-6">Deviens VIP 🔥⚜️</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Rejoins l'élite du Québec numérique. Accès exclusif, fonctionnalités premium et soutien
            aux créateurs d'ici.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Bronze */}
          <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 rounded-2xl p-8 border border-amber-500/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-amber-400 mb-2">Bronze</h3>
              <div className="text-3xl font-bold text-white mb-1">4,99$</div>
              <div className="text-white/60">par mois</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Support aux créateurs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Badge Bronze exclusif</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Accès anticipé aux nouvelles features</span>
              </li>
            </ul>

            <SubscribeButton tier="bronze" />
          </div>

          {/* Silver */}
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 rounded-2xl p-8 border-2 border-gray-400 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gray-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                POPULAIRE
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-300 mb-2">Argent</h3>
              <div className="text-3xl font-bold text-white mb-1">9,99$</div>
              <div className="text-white/60">par mois</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Tout ce qu'il y a dans Bronze</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Badge Argent exclusif</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Ti-Guy Assistant (IA)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Ti-Guy Artiste (Génération d'images)</span>
              </li>
            </ul>

            <SubscribeButton tier="silver" />
          </div>

          {/* Gold */}
          <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 rounded-2xl p-8 border border-yellow-500/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">Or</h3>
              <div className="text-3xl font-bold text-white mb-1">19,99$</div>
              <div className="text-white/60">par mois</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Tout ce qu'il y a dans Argent</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Badge Or exclusif</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Ti-Guy Studio (Édition vidéo)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Support prioritaire</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Fonctionnalités VIP exclusives</span>
              </li>
            </ul>

            <SubscribeButton tier="gold" />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>

          <div className="space-y-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Puis-je annuler à tout moment?</h3>
              <p className="text-white/80">
                Oui, tu peux annuler ton abonnement à tout moment. Aucun frais caché, aucune période
                d'engagement.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Comment ça fonctionne?</h3>
              <p className="text-white/80">
                Ton abonnement se renouvelle automatiquement chaque mois. Tu peux gérer ou annuler
                dans tes paramètres de compte.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Est-ce que c'est sécurisé?</h3>
              <p className="text-white/80">
                Oui, nous utilisons Stripe pour traiter les paiements. Tes informations bancaires
                sont cryptées et sécurisées.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Où va l'argent?</h3>
              <p className="text-white/80">
                Ton abonnement soutient directement Zyeuté et les créateurs québécois. 70% des
                revenus vont aux fonctionnalités et au développement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
