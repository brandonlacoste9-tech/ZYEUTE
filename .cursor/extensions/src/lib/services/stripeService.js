// src/lib/services/stripeService.js
// Stripe integration service for Zyeuté premium subscriptions

/**
 * Helper to start the Stripe checkout process
 * @param {string} tier - Subscription tier: 'bronze', 'silver', or 'gold'
 * @param {string} userEmail - User's email address
 * @param {string} userId - User's UUID from Supabase
 * @returns {Promise<{url: string, sessionId: string}>} Checkout session details
 */
export async function createStripeCheckoutSession(tier, userEmail, userId) {
    // For React Native, you'll need to configure your Netlify function URL
    // In production, use your actual Netlify site URL
    const netlifyUrl = process.env.EXPO_PUBLIC_NETLIFY_URL || 'https://your-site.netlify.app';
    const endpoint = `${netlifyUrl}/.netlify/functions/stripe-checkout`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tier, userEmail, userId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}: Failed to start checkout session.`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Stripe checkout error:', error);
        throw error;
    }
}

/**
 * Handler for the frontend button - redirects user to Stripe checkout
 * @param {string} tier - Subscription tier: 'bronze', 'silver', or 'gold'
 * @param {Object} user - User object with email and id
 * @param {Function} onError - Optional error callback
 * @returns {Promise<void>}
 */
export async function handleGoVIPClick(tier, user, onError) {
    try {
        if (!user || !user.email || !user.id) {
            throw new Error('User information is missing. Please log in first.');
        }

        if (!['bronze', 'silver', 'gold'].includes(tier)) {
            throw new Error('Invalid subscription tier.');
        }

        const { url } = await createStripeCheckoutSession(tier, user.email, user.id);
        
        // For React Native, use Linking to open the Stripe checkout URL
        // For web, use window.location.href
        if (typeof window !== 'undefined' && window.location) {
            // Web environment
            window.location.href = url;
        } else {
            // React Native environment - import Linking from react-native
            const { Linking } = require('react-native');
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                throw new Error('Cannot open checkout URL. Please check your device settings.');
            }
        }
    } catch (error) {
        console.error('Erreur lors du paiement:', error);
        
        // Use your toast notification system or alert
        const errorMessage = error.message || 'Erreur: Impossible de démarrer le paiement. Réessaie, s.t.p.!';
        
        if (onError) {
            onError(errorMessage);
        } else {
            // Fallback to alert (replace with your toast system)
            if (typeof window !== 'undefined' && window.alert) {
                alert(errorMessage);
            } else {
                // React Native - you might want to use a toast library here
                console.error('Error (no alert available):', errorMessage);
            }
        }
        
        throw error;
    }
}

/**
 * Check if user has an active premium subscription
 * @param {Object} userProfile - User profile from Supabase
 * @returns {boolean}
 */
export function isPremiumUser(userProfile) {
    return userProfile?.is_premium === true || 
           (userProfile?.subscription_tier && ['bronze', 'silver', 'gold'].includes(userProfile.subscription_tier));
}

/**
 * Get subscription tier display name
 * @param {string} tier - Tier code
 * @returns {string} Display name
 */
export function getTierDisplayName(tier) {
    const tierNames = {
        'bronze': 'Bronze',
        'silver': 'Argent',
        'gold': 'Or',
        'free': 'Gratuit',
    };
    return tierNames[tier] || tier;
}

/**
 * Get subscription tier benefits (for display in pricing page)
 * @param {string} tier - Tier code
 * @returns {Array<string>} List of benefits
 */
export function getTierBenefits(tier) {
    const benefits = {
        'bronze': [
            'Accès aux fonctionnalités de base',
            'Support par email',
            '3 documents par mois',
        ],
        'silver': [
            'Tout de Bronze, plus:',
            'Support prioritaire',
            '10 documents par mois',
            'Accès aux fonctionnalités avancées',
        ],
        'gold': [
            'Tout de Argent, plus:',
            'Support 24/7',
            'Documents illimités',
            'Accès à toutes les fonctionnalités',
            'Accès prioritaire aux nouvelles fonctionnalités',
        ],
    };
    return benefits[tier] || [];
}

