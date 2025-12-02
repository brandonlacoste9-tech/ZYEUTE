/**
 * VIP Concierge High-End Theme Colors
 * Premium color palette for luxury, high-end aesthetic
 */

export const colors = {
  // Primary Backgrounds - Deep, rich tones
  bg: '#0A0A0F',           // Deep navy-black background
  bgSecondary: '#121218',  // Slightly lighter for cards
  bgTertiary: '#1A1A22',   // Elevated surfaces
  
  // Text Colors - Refined hierarchy
  text: '#FFFFFF',         // Pure white primary text
  textSecondary: '#E5E5E5', // Soft white for secondary text
  textMuted: '#B8B8C0',    // Muted text for hints
  textGold: '#D4AF37',     // Gold accent text
  
  // VIP Gold Accents - Premium metallic
  gold: '#D4AF37',         // Classic gold
  goldLight: '#E5C158',    // Lighter gold for highlights
  goldDark: '#B8941F',     // Darker gold for depth
  goldGradient: 'linear-gradient(135deg, #D4AF37 0%, #F5D76E 100%)',
  
  // Platinum/Silver Accents - Alternative premium
  platinum: '#C0C0C0',      // Platinum silver
  platinumLight: '#E8E8E8', // Light platinum
  platinumDark: '#A0A0A0', // Dark platinum
  
  // Luxury Surfaces - Rich materials
  leather: '#1F1F28',      // Deep leather brown-black
  leatherLight: '#2A2A35', // Lighter leather
  suede: '#252530',         // Suede texture
  velvet: '#15151D',       // Velvet deep purple-black
  
  // Accent Colors - Refined palette
  accent: '#4A90E2',       // Premium blue
  accentLight: '#6BA3E8',  // Light blue
  accentDark: '#2E5C8A',   // Dark blue
  
  // Borders & Dividers - Subtle elegance
  border: '#2A2A35',       // Subtle border
  borderLight: '#3A3A45',  // Lighter border
  borderGold: 'rgba(212, 175, 55, 0.3)', // Gold border glow
  borderGoldStrong: 'rgba(212, 175, 55, 0.6)', // Stronger gold border
  
  // Shadows - Premium depth
  shadow: 'rgba(0, 0, 0, 0.5)',
  shadowGold: 'rgba(212, 175, 55, 0.2)', // Gold glow shadow
  shadowStrong: 'rgba(0, 0, 0, 0.7)',
  
  // Status Colors - Refined feedback
  success: '#4CAF50',      // Success green
  warning: '#FFB74D',      // Warning amber
  error: '#E57373',        // Error red
  info: '#64B5F6',         // Info blue
  
  // Overlay & Backdrop
  overlay: 'rgba(10, 10, 15, 0.85)', // Dark overlay
  backdrop: 'rgba(0, 0, 0, 0.6)',     // Backdrop blur
  
  // Gradient Presets
  gradients: {
    gold: ['#D4AF37', '#F5D76E', '#FFD700'],
    platinum: ['#C0C0C0', '#E8E8E8', '#FFFFFF'],
    luxury: ['#0A0A0F', '#1A1A22', '#2A2A35'],
    vip: ['#1F1F28', '#2A2A35', '#353540'],
  },
  
  // VIP Stitching Effect Colors
  stitching: {
    primary: 'rgba(212, 175, 55, 0.4)',   // Gold stitching
    secondary: 'rgba(192, 192, 192, 0.3)', // Platinum stitching
    accent: 'rgba(74, 144, 226, 0.3)',     // Blue stitching
  },
};

/**
 * VIP Concierge Theme Styles
 * Premium styling utilities for high-end look
 */
export const vipStyles = {
  // Premium Card Styling
  card: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 12,
    shadowColor: colors.shadowGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  
  // Stitched Border Effect
  stitchedBorder: {
    borderWidth: 2,
    borderColor: colors.stitching.primary,
    borderStyle: 'solid',
    borderRadius: 8,
    // Creates a "stitched" appearance with multiple borders
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  // Premium Button
  button: {
    backgroundColor: colors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: colors.shadowGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  
  // VIP Text Styling
  text: {
    primary: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    gold: {
      color: colors.gold,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    secondary: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '400',
    },
  },
  
  // Premium Input Field
  input: {
    backgroundColor: colors.bgTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 16,
  },
  
  // Luxury Header
  header: {
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGold,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
};

export default colors;

