/**
 * Language Settings Page
 */

import React from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useSettingsPreferences } from '@/hooks/useSettingsPreferences';
import { toast } from '@/components/Toast';
import { useHaptics } from '@/hooks/useHaptics';

export const LanguageSettings: React.FC = () => {
  const { preferences, setPreference } = useSettingsPreferences();
  const { tap } = useHaptics();

  const handleLanguageSelect = (lang: 'fr' | 'en') => {
    tap();
    setPreference('language', lang);
    toast.success(`Langue changée: ${lang === 'fr' ? 'Français' : 'English'}! ✨`);
  };

  return (
    <div className="min-h-screen bg-black leather-overlay pb-20">
      <Header title="Langue" showBack={true} showSearch={false} />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Info */}
        <div className="leather-card rounded-xl p-4 stitched bg-gold-500/10 border border-gold-500/30">
          <p className="text-white text-sm">
            Choisis la langue d&apos;affichage de l&apos;application. 🇨🇦⚜️
          </p>
        </div>

        {/* Language Selection */}
        <div className="leather-card rounded-xl p-4 stitched">
          <h3 className="text-white font-semibold mb-4">Langue d&apos;affichage</h3>
          <div className="space-y-2">
            {([
              { code: 'fr' as const, name: 'Français', flag: '🇨🇦', description: 'Langue principale du Québec' },
              { code: 'en' as const, name: 'English', flag: '🇬🇧', description: 'English language' },
            ]).map((lang) => {
              const isSelected = preferences.language === lang.code;
              
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-gold-500/20 border-2 border-gold-500'
                      : 'bg-leather-800/50 border-2 border-transparent hover:bg-leather-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <p className="text-white font-medium">{lang.name}</p>
                        <p className="text-leather-400 text-xs">{lang.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-gold-500 text-xl">✓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div className="leather-card rounded-xl p-4 stitched">
          <p className="text-leather-400 text-xs">
            Note: La plupart du contenu sur Zyeuté est en français québécois (joual). Le changement de langue affecte principalement l&apos;interface.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default LanguageSettings;

