/**
 * Ti-Guy - Premium Quebec Heritage Design
 * The Zyeuté Mascot & AI Assistant with embossed beaver emblem
 * Luxury leather chat widget with gold stitching
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../Button';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'tiguy';
  timestamp: Date;
}

const TI_GUY_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Allô! Moi c'est Ti-Guy, ton petit castor préféré! 🦫",
    "Salut mon ami! Comment ça va aujourd'hui? ⚜️",
    "Heille! Content de te jaser! 🇨🇦",
  ],
  help: [
    "Je peux t'aider à naviguer l'app! Pose-moi n'importe quelle question! 💡",
    "T'as besoin d'aide? Je suis là pour toi! 🦫",
  ],
  upload: [
    "Pour uploader une photo ou vidéo, clique sur le + en bas! 📸",
    "Veux-tu créer du contenu? Va dans la section Upload! 🎥",
  ],
  fire: [
    "Les feux 🔥 c'est comme des likes, mais en plus hot! Plus t'en reçois, plus ton contenu est malade!",
    "Donne des feux aux posts que tu trouves sick! C'est notre système de rating! 🔥",
  ],
  story: [
    "Les Stories disparaissent après 24 heures! Parfait pour du contenu éphémère! ⏰",
    "Crée une Story en cliquant sur ton avatar en haut du feed! ✨",
  ],
  quebec: [
    "Zyeuté, c'est fait au Québec, pour le Québec! On célèbre notre culture! 🇨🇦⚜️",
    "Utilise des hashtags québécois comme #514 #450 #quebec #montreal! 🏔️",
  ],
  gifts: [
    "Tu peux envoyer des cadeaux virtuels aux créateurs que tu aimes! 🎁",
    "Les cadeaux supportent nos créateurs québécois! C'est comme un tip! 💰",
  ],
  premium: [
    "Deviens VIP pour débloquer Ti-Guy Artiste et Studio! 👑",
    "Les membres Or ont accès à toutes mes fonctionnalités AI! ✨",
  ],
  default: [
    "Hmm, je comprends pas trop... Peux-tu reformuler? 🤔",
    "Je suis un petit castor, pas Google! Essaie une autre question! 😅",
    "Désolé, j'ai pas compris! Je suis encore en train d'apprendre! 🦫",
  ],
};

const QUICK_ACTIONS = [
  { label: "Comment ça marche?", key: "help" },
  { label: "Upload une photo", key: "upload" },
  { label: "C'est quoi les feux?", key: "fire" },
  { label: "Devenir VIP?", key: "premium" },
];

export const TiGuy: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addTiGuyMessage('greeting');
      }, 500);
    }
  }, [isOpen]);

  // Add Ti-Guy message
  const addTiGuyMessage = (responseKey: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const responses = TI_GUY_RESPONSES[responseKey] || TI_GUY_RESPONSES.default;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: 'tiguy',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle user message
  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Determine response
    const lowerText = messageText.toLowerCase();
    let responseKey = 'default';

    if (lowerText.includes('upload') || lowerText.includes('poster') || lowerText.includes('publier')) {
      responseKey = 'upload';
    } else if (lowerText.includes('feu') || lowerText.includes('fire') || lowerText.includes('like')) {
      responseKey = 'fire';
    } else if (lowerText.includes('story') || lowerText.includes('histoire')) {
      responseKey = 'story';
    } else if (lowerText.includes('québec') || lowerText.includes('quebec') || lowerText.includes('montréal')) {
      responseKey = 'quebec';
    } else if (lowerText.includes('cadeau') || lowerText.includes('gift') || lowerText.includes('tip')) {
      responseKey = 'gifts';
    } else if (lowerText.includes('premium') || lowerText.includes('vip') || lowerText.includes('abonnement')) {
      responseKey = 'premium';
    } else if (lowerText.includes('aide') || lowerText.includes('help') || lowerText.includes('comment')) {
      responseKey = 'help';
    } else if (lowerText.includes('allo') || lowerText.includes('salut') || lowerText.includes('bonjour')) {
      responseKey = 'greeting';
    }

    addTiGuyMessage(responseKey);
  };

  // Handle quick action
  const handleQuickAction = (key: string, label: string) => {
    handleSendMessage(label);
  };

  return (
    <>
      {/* Floating button - Premium Beaver Emblem */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-20 z-50 w-14 h-14 btn-gold rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform glow-gold animate-bounce"
          aria-label="Ouvre Ti-Guy"
        >
          <span className="text-3xl">🦫</span>
        </button>
      )}

      {/* Chat window - Luxury Leather Design */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] leather-card rounded-2xl shadow-2xl overflow-hidden stitched">
          {/* Header - Gold Gradient with Embossed Beaver */}
          <div className="bg-neutral-900 p-4 flex items-center justify-between border-b-2 border-gold-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center border-2 border-gold-700 glow-gold relative">
                <span className="text-2xl">🦫</span>
                {/* Embossed effect ring */}
                <div className="absolute inset-0 rounded-full border-2 border-neutral-700" style={{ transform: 'scale(1.1)' }} />
              </div>
              <div>
                <h3 className="text-gold-400 font-bold embossed">Ti-Guy</h3>
                <p className="text-stone-400 text-xs embossed">Ton assistant québécois</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gold-500/20 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Messages - Dark Leather Background */}
          <div className="h-96 overflow-y-auto p-4 space-y-3 bg-black gold-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'tiguy' && (
                  <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0 border border-gold-700 glow-gold-subtle">
                    <span className="text-lg">🦫</span>
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[70%] p-3 rounded-2xl text-sm',
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-black font-medium'
                      : 'bg-neutral-800 text-white border border-neutral-700'
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center border border-gold-700">
                  <span className="text-lg">🦫</span>
                </div>
                <div className="bg-neutral-800 p-3 rounded-2xl border border-neutral-700">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions - Leather Buttons */}
          {messages.length <= 2 && (
            <div className="p-3 border-t border-gold-700/30 bg-neutral-900">
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => handleQuickAction(action.key, action.label)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-full text-gold-400 text-xs transition-colors embossed border border-neutral-700"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input - Premium Gold Accent */}
          <div className="p-3 border-t-2 border-gold-700/50 bg-neutral-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pose une question..."
                className="input-premium text-sm"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 btn-gold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform glow-gold"
              >
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Quebec Pride Footer */}
          <div className="px-4 py-2 bg-neutral-950 border-t border-gold-700/20">
            <p className="text-center text-stone-500 text-xs embossed flex items-center justify-center gap-1">
              <span className="text-gold-500">⚜️</span>
              <span>Propulsé par l'IA québécoise</span>
              <span className="text-gold-500">🦫</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TiGuy;
