import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, vipStyles } from '../theme/colors';

// Icon imports - using Expo Vector Icons as fallback
// If you have lucide-react-native installed, use: import { MapPin, Utensils, Zap, ChevronRight, Search } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

// --- CONSTANTS & STYLING ---
const API_BASE_URL = 'http://localhost:8000/api/v1'; // Colony OS Backend
// For production, use: const API_BASE_URL = process.env.EXPO_PUBLIC_COLONY_OS_URL || 'https://your-api.com/api/v1';

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: colors.bg 
    },
    container: { 
        paddingHorizontal: 20, 
        paddingTop: 20, 
        paddingBottom: 80 
    },
    // VIP Concierge Premium Styling
    goldAccent: { 
        color: colors.gold,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    platinumAccent: {
        color: colors.platinum,
        fontWeight: '600',
    },
    leatherBackground: { 
        backgroundColor: colors.leather,
    },
    suedeBackground: {
        backgroundColor: colors.suede,
    },
    shadowGold: { 
        elevation: 12, 
        shadowColor: colors.gold, 
        shadowOpacity: 0.5, 
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 }
    },
    shadowPremium: {
        elevation: 16,
        shadowColor: colors.shadow,
        shadowOpacity: 0.6,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 }
    },
    // VIP Stitched Border Effect
    stitchedBorder: {
        borderWidth: 2,
        borderColor: colors.stitching.primary,
        borderRadius: 12,
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    // Premium Card with Stitching
    vipCard: {
        backgroundColor: colors.bgSecondary,
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: colors.borderGold,
        shadowColor: colors.shadowGold,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 12,
    },
    // VIP Header Styling
    vipHeader: {
        backgroundColor: colors.bg,
        borderBottomWidth: 2,
        borderBottomColor: colors.borderGold,
        paddingVertical: 24,
        paddingHorizontal: 20,
        shadowColor: colors.shadowGold,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    // Premium Search Bar
    vipSearchBar: {
        backgroundColor: colors.bgTertiary,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    // VIP Category Button
    vipCategoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
});

// Helper function to format region names for display
const formatRegionName = (region) => {
    if (!region) return '';
    // Convert API format (Quebec_City) to display format (Quebec City)
    return region.replace(/_/g, ' ');
};

// Mock Category Data (in Joual/French)
const categories = [
    { name: 'Restos', icon: 'restaurant', category: 'restaurant', color: '#B744FF' },
    { name: 'Bars/Clubs', icon: 'wine', category: 'bar', color: '#00D4FF' },
    { name: 'Sports', icon: 'football', category: 'sport', color: '#00FF88' },
    { name: 'Shows', icon: 'musical-notes', category: 'show', color: '#FF0080' },
];

// VIP Concierge Discovery Card with Premium Styling
const DiscoveryCard = ({ item }) => (
    <TouchableOpacity 
        style={styles.vipCard}
        activeOpacity={0.9}
    >
        <Image 
            source={{ 
                uri: item.image_url || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop'
            }} 
            style={{ 
                width: '100%', 
                height: 200,
                borderTopLeftRadius: 14,
                borderTopRightRadius: 14,
            }}
            resizeMode="cover"
            onError={(error) => {
                console.log('Image load error, using fallback');
                // Fallback to a generic Montreal/Quebec image
                return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop';
            }}
        />
        {/* VIP Stitching Effect Border */}
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: colors.stitching.primary,
            opacity: 0.6,
        }} />
        <View style={{ 
            padding: 16,
            backgroundColor: colors.bgSecondary,
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{
                    width: 4,
                    height: 20,
                    backgroundColor: colors.gold,
                    marginRight: 12,
                    borderRadius: 2,
                }} />
                <Text style={[styles.goldAccent, { fontSize: 20, flex: 1 }]}>
                    {item.name}
                </Text>
            </View>
            <Text style={{ 
                color: colors.textSecondary, 
                fontSize: 14, 
                lineHeight: 20,
                marginBottom: 12,
                marginLeft: 16,
            }}>
                {item.description}
            </Text>
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: 8,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                marginLeft: 16,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="location" size={16} color={colors.accent} />
                    <Text style={{ 
                        color: colors.accentLight, 
                        fontSize: 13, 
                        marginLeft: 6,
                        fontWeight: '500',
                    }}>
                        {formatRegionName(item.region)}
                    </Text>
                </View>
                <View style={{
                    backgroundColor: colors.gold + '20',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.borderGold,
                }}>
                    <Text style={{ 
                        color: colors.goldLight, 
                        fontWeight: '700', 
                        fontSize: 12,
                        letterSpacing: 0.5,
                    }}>
                        ⭐ {item.ai_score.toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

const DiscoveryScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    const fetchDiscoveryItems = async (category = null) => {
        setLoading(true);
        setError(null);
        let url = `${API_BASE_URL}/discovery/items?limit=20`;
        
        if (category) {
            url += `&category=${category}`;
        }
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Colony OS Discovery Fetch Failed:", error);
            setError(error.message);
            // Fallback with real Quebec places - VIP curated selection
            setItems([
                { 
                    id: 'fallback-1', 
                    name: 'Le Dagobert', 
                    category: 'bar', 
                    region: 'Quebec_City', 
                    description: 'Un classique pour les shows live et la scène musicale québécoise. Ambiance authentique et musique live tous les soirs.', 
                    ai_score: 0.88, 
                    image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop' 
                },
                { 
                    id: 'fallback-2', 
                    name: 'Stereo', 
                    category: 'bar', 
                    region: 'Montreal', 
                    description: 'Club techno légendaire - la meilleure sound system de la ville. Expérience audio immersive.', 
                    ai_score: 0.94, 
                    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop' 
                },
                { 
                    id: 'fallback-3', 
                    name: 'New City Gas', 
                    category: 'bar', 
                    region: 'Montreal', 
                    description: 'Gros événements électroniques et shows internationaux. L\'endroit pour les grandes soirées.', 
                    ai_score: 0.91, 
                    image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop' 
                },
                { 
                    id: 'fallback-4', 
                    name: 'Canadiens vs Bruins', 
                    category: 'sport', 
                    region: 'Montreal', 
                    description: 'Match de hockey épique - la rivalité classique. L\'expérience ultime du hockey québécois.', 
                    ai_score: 0.92, 
                    image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop' 
                },
                { 
                    id: 'fallback-5', 
                    name: 'Festival de Jazz de Montréal', 
                    category: 'show', 
                    region: 'Montreal', 
                    description: 'Le plus grand festival de jazz au monde. Des artistes internationaux dans les rues de Montréal.', 
                    ai_score: 0.93, 
                    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop' 
                },
                { 
                    id: 'fallback-6', 
                    name: 'MTelus', 
                    category: 'show', 
                    region: 'Montreal', 
                    description: 'Grande salle de spectacles - concerts majeurs, tous âges bienvenus. L\'expérience live par excellence.', 
                    ai_score: 0.91, 
                    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop' 
                },
                { 
                    id: 'fallback-7', 
                    name: 'Marché Jean-Talon', 
                    category: 'restaurant', 
                    region: 'Montreal', 
                    description: 'Marché public authentique avec produits locaux. L\'âme culinaire du Plateau-Mont-Royal.', 
                    ai_score: 0.87, 
                    image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=400&fit=crop' 
                },
                { 
                    id: 'fallback-8', 
                    name: 'Le Divan Orange', 
                    category: 'bar', 
                    region: 'Montreal', 
                    description: 'Bar intime avec shows acoustiques et scène folk québécoise. Ambiance chaleureuse et authentique.', 
                    ai_score: 0.88, 
                    image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop' 
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscoveryItems();
    }, []);

    const handleCategorySelect = (categoryName) => {
        const newCategory = selectedCategory === categoryName ? null : categoryName;
        setSelectedCategory(newCategory);
        fetchDiscoveryItems(newCategory);
    };

    return (
        <View style={styles.safeArea}>
            {/* VIP Concierge Header */}
            <View style={styles.vipHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{
                        width: 5,
                        height: 32,
                        backgroundColor: colors.gold,
                        marginRight: 12,
                        borderRadius: 2,
                    }} />
                    <Text style={{ 
                        color: colors.gold, 
                        fontSize: 28, 
                        fontWeight: '800',
                        letterSpacing: 1,
                    }}>
                        VIP CONCIERGE
                    </Text>
                </View>
                <Text style={{ 
                    color: colors.platinum, 
                    fontSize: 14, 
                    marginBottom: 16,
                    marginLeft: 17,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                }}>
                    Découvrir - TRUE QUÉBEC ⚜️
                </Text>
                <View style={styles.vipSearchBar}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="search" size={22} color={colors.gold} />
                        <Text style={{ 
                            color: colors.textMuted, 
                            marginLeft: 12, 
                            fontSize: 15,
                            fontWeight: '400',
                        }}>
                            Recherche exclusive...
                        </Text>
                    </View>
                </View>
            </View>

            {/* Categories */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{ 
                    paddingVertical: 16, 
                    backgroundColor: colors.bg 
                }}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                {categories.map((cat, index) => (
                    <TouchableOpacity 
                        key={index}
                        onPress={() => handleCategorySelect(cat.category)}
                        style={[
                            styles.vipCategoryButton,
                            {
                                marginRight: 14,
                                backgroundColor: cat.category === selectedCategory 
                                    ? colors.gold + '25' 
                                    : colors.bgTertiary,
                                borderColor: cat.category === selectedCategory 
                                    ? colors.borderGoldStrong
                                    : colors.border,
                            }
                        ]}
                        activeOpacity={0.8}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons 
                                name={cat.icon} 
                                size={18} 
                                color={cat.category === selectedCategory ? colors.goldLight : colors.platinum} 
                                style={{ marginRight: 8 }}
                            />
                            <Text style={{ 
                                color: cat.category === selectedCategory ? colors.goldLight : colors.textSecondary, 
                                fontWeight: '700', 
                                fontSize: 14,
                                letterSpacing: 0.3,
                            }}>
                                {cat.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Content Feed */}
            <ScrollView style={styles.container}>
                <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    marginBottom: 20,
                    paddingBottom: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.borderGold,
                }}>
                    <View style={{
                        width: 3,
                        height: 24,
                        backgroundColor: colors.gold,
                        marginRight: 12,
                        borderRadius: 2,
                    }} />
                    <Text style={{ 
                        color: colors.gold, 
                        fontWeight: '800', 
                        fontSize: 18,
                        letterSpacing: 1.5,
                    }}>
                        {selectedCategory 
                            ? `${selectedCategory.toUpperCase()} EXCLUSIF` 
                            : 'CURATED SELECTION'}
                    </Text>
                </View>

                {error && (
                    <View style={{ 
                        backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                        padding: 12, 
                        borderRadius: 8, 
                        marginBottom: 16 
                    }}>
                        <Text style={{ color: '#ff4444', fontSize: 12 }}>
                            ⚠️ Erreur: {error}. Assure-toi que le serveur Colony OS est démarré (port 8000).
                        </Text>
                    </View>
                )}

                {loading ? (
                    <View style={{ marginTop: 60, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.gold} />
                        <Text style={{
                            color: colors.platinum,
                            marginTop: 16,
                            fontSize: 14,
                            fontWeight: '500',
                            letterSpacing: 0.5,
                        }}>
                            Chargement des expériences VIP...
                        </Text>
                    </View>
                ) : items.length === 0 ? (
                    <View style={{
                        marginTop: 60,
                        padding: 24,
                        backgroundColor: colors.bgSecondary,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.borderGold,
                        alignItems: 'center',
                    }}>
                        <Ionicons name="search-outline" size={48} color={colors.platinum} />
                        <Text style={{ 
                            color: colors.textSecondary, 
                            textAlign: 'center', 
                            marginTop: 16,
                            fontSize: 15,
                            fontWeight: '500',
                        }}>
                            Aucun résultat trouvé
                        </Text>
                        <Text style={{
                            color: colors.textMuted,
                            textAlign: 'center',
                            marginTop: 8,
                            fontSize: 13,
                        }}>
                            Essayez une autre catégorie
                        </Text>
                    </View>
                ) : (
                    items.map((item) => <DiscoveryCard key={item.id} item={item} />)
                )}
            </ScrollView>
        </View>
    );
};

export default DiscoveryScreen;

