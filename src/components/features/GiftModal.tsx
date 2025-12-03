/**
 * GiftModal - Virtual gift sending system
 * Users can send gifts to support their favorite creators
 */

import React, { useState } from 'react';
import { Button } from '../Button';
import { Avatar } from '../Avatar';
import { supabase } from '../../lib/supabase';
import { toast } from '../Toast';
import { cn } from '../../lib/utils';
import type { User } from '../../types';
import { logger } from '../../lib/logger';

const giftModalLogger = logger.withContext('GiftModal');


interface Gift {
  id: string;
  name: string;
  emoji: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const GIFTS: Gift[] = [
  // Common (1-5$)
  { id: 'poutine', name: 'Poutine', emoji: '🍟', price: 2, rarity: 'common' },
  { id: 'maple', name: 'Sirop d\'érable', emoji: '🍁', price: 3, rarity: 'common' },
  { id: 'beaver', name: 'Castor', emoji: '🦫', price: 5, rarity: 'common' },
  { id: 'hockey', name: 'Hockey', emoji: '🏒', price: 5, rarity: 'common' },
  
  // Rare (10-20$)
  { id: 'tourtiere', name: 'Tourtière', emoji: '🥧', price: 10, rarity: 'rare' },
  { id: 'fleurdelys', name: 'Fleur-de-lys', emoji: '⚜️', price: 15, rarity: 'rare' },
  { id: 'caribou', name: 'Caribou', emoji: '🦌', price: 20, rarity: 'rare' },
  
  // Epic (25-50$)
  { id: 'chateau', name: 'Château Frontenac', emoji: '🏰', price: 25, rarity: 'epic' },
  { id: 'aurora', name: 'Aurore boréale', emoji: '🌌', price: 35, rarity: 'epic' },
  { id: 'sthubert', name: 'St-Hubert', emoji: '🍗', price: 50, rarity: 'epic' },
  
  // Legendary (100$+)
  { id: 'laurentides', name: 'Les Laurentides', emoji: '🏔️', price: 100, rarity: 'legendary' },
  { id: 'vipquebec', name: 'VIP Québec', emoji: '👑', price: 250, rarity: 'legendary' },
];

const RARITY_STYLES = {
  common: 'from-gray-500 to-gray-700',
  rare: 'from-blue-500 to-blue-700',
  epic: 'from-purple-500 to-purple-700',
  legendary: 'from-gold-500 to-yellow-600',
};

interface GiftModalProps {
  recipient: User;
  postId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({
  recipient,
  postId,
  isOpen,
  onClose,
}) => {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  // Send gift
  const handleSendGift = async () => {
    if (!selectedGift) return;

    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Tu dois être connecté!');
        return;
      }

      // Create gift record
      const { error } = await supabase
        .from('gifts')
        .insert({
          sender_id: user.id,
          recipient_id: recipient.id,
          post_id: postId,
          gift_type: selectedGift.id,
          gift_name: selectedGift.name,
          gift_emoji: selectedGift.emoji,
          price: selectedGift.price,
          message: message.trim() || null,
        });

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: recipient.id,
          actor_id: user.id,
          type: 'gift',
          message: `t'a envoyé un ${selectedGift.name} ${selectedGift.emoji}!`,
        });

      toast.success(`${selectedGift.emoji} Cadeau envoyé! ${selectedGift.name}`);
      onClose();
    } catch (error: any) {
      giftModalLogger.error('Error sending gift:', error);
      
      if (error.message?.includes('not found')) {
        toast.error('La table "gifts" n\'existe pas encore. Crée-la dans Supabase!');
      } else {
        toast.error('Erreur lors de l\'envoi du cadeau');
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] bg-gray-900 md:rounded-2xl overflow-hidden card-edge">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gold-gradient">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-black text-2xl font-bold">Envoyer un cadeau 🎁</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/10 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
          
          {/* Recipient */}
          <div className="flex items-center gap-3">
            <Avatar src={recipient.avatar_url} size="md" isVerified={recipient.is_verified} />
            <div>
              <p className="text-black font-semibold">
                Pour {recipient.display_name || recipient.username}
              </p>
              <p className="text-black/70 text-sm">Supporte ton créateur préféré!</p>
            </div>
          </div>
        </div>

        {/* Gift grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {GIFTS.map((gift) => (
              <button
                key={gift.id}
                onClick={() => setSelectedGift(gift)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all hover:scale-105',
                  selectedGift?.id === gift.id
                    ? 'border-gold-400 bg-gold-400/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                )}
              >
                <div className={`text-4xl mb-2 p-2 rounded-lg bg-gradient-to-br ${RARITY_STYLES[gift.rarity]}`}>
                  {gift.emoji}
                </div>
                <p className="text-white text-sm font-semibold truncate">{gift.name}</p>
                <p className="text-gold-400 text-xs font-bold">${gift.price}</p>
              </button>
            ))}
          </div>

          {/* Selected gift details */}
          {selectedGift && (
            <div className="card-edge p-6 mb-4">
              <h3 className="text-white font-bold mb-3">Cadeau sélectionné:</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl p-3 rounded-xl bg-gradient-to-br ${RARITY_STYLES[selectedGift.rarity]}`}>
                  {selectedGift.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-white text-xl font-bold">{selectedGift.name}</p>
                  <p className="text-gold-400 text-2xl font-bold">${selectedGift.price} CAD</p>
                  <p className="text-white/60 text-sm capitalize">{selectedGift.rarity}</p>
                </div>
              </div>

              {/* Optional message */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ajoute un message (optionnel)..."
                maxLength={200}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 resize-none focus:outline-none focus:border-gold-400"
              />
              <p className="text-white/40 text-xs mt-1">{message.length}/200</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black/50">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSending}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSendGift}
              isLoading={isSending}
              disabled={!selectedGift}
            >
              {selectedGift
                ? `Envoyer ${selectedGift.emoji} ($${selectedGift.price})`
                : 'Choisis un cadeau'}
            </Button>
          </div>

          <p className="text-white/40 text-xs text-center mt-4">
            💡 Les créateurs reçoivent 80% de la valeur du cadeau
          </p>
        </div>
      </div>
    </div>
  );
};

export default GiftModal;

