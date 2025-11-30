import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

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
        paddingHorizontal: 16, 
        paddingTop: 16, 
        paddingBottom: 64 
    },
    // Fur Trader Luxury Aesthetic Classes
    goldAccent: { 
        color: colors.gold 
    },
    leatherBackground: { 
        backgroundColor: colors.leather 
    },
    shadowGold: { 
        elevation: 8, 
        shadowColor: colors.gold, 
        shadowOpacity: 0.4, 
        shadowRadius: 8 
    },
    cardBorder: { 
        borderColor: 'rgba(245, 200, 66, 0.3)', 
        borderWidth: 1 
    },
});

// Mock Category Data (in Joual/French)
const categories = [
    { name: 'Restos', icon: 'restaurant', category: 'restaurant', color: '#B744FF' },
    { name: 'Bars/Clubs', icon: 'wine', category: 'bar', color: '#00D4FF' },
    { name: 'Sports', icon: 'football', category: 'sport', color: '#00FF88' },
    { name: 'Shows', icon: 'musical-notes', category: 'show', color: '#FF0080' },
];

// Component to represent a single discovery item card
const DiscoveryCard = ({ item }) => (
    <TouchableOpacity 
        style={[
            styles.leatherBackground, 
            styles.cardBorder, 
            styles.shadowGold, 
            {
                borderRadius: 16, 
                marginBottom: 16, 
                overflow: 'hidden'
            }
        ]}
    >
        <Image 
            source={{ uri: item.image_url || 'https://placehold.co/400x200/4A3728/F5C842?text=Fleur-de-Lys' }} 
            style={{ width: '100%', height: 180 }}
            resizeMode="cover"
            onError={() => console.log('Image load error')}
        />
        <View style={{ padding: 12 }}>
            <Text style={[styles.goldAccent, { fontSize: 18, fontWeight: '700', marginBottom: 4 }]}>
                {item.name}
            </Text>
            <Text style={{ color: colors.lightLeather, fontSize: 14, marginBottom: 8 }}>
                {item.description}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="location" size={14} color="#00D4FF" />
                    <Text style={{ color: '#00D4FF', fontSize: 12, marginLeft: 4 }}>
                        {item.region}
                    </Text>
                </View>
                <Text style={{ color: '#00FF88', fontWeight: '500', fontSize: 12 }}>
                    AI Score: {item.ai_score.toFixed(2)}
                </Text>
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
            // Fallback for demonstration
            setItems([
                { 
                    id: 'mock1', 
                    name: 'Le Plateau (Mock)', 
                    category: 'event', 
                    region: 'Montreal', 
                    description: 'Simule l\'API locale - vérifie que le serveur Colony OS est démarré', 
                    ai_score: 0.85, 
                    image_url: 'https://placehold.co/400x200/1a1a1a/F5C842?text=TI-GUY+DEMO' 
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
            {/* Header / Search */}
            <View style={{ 
                padding: 16, 
                backgroundColor: colors.bg, 
                borderBottomWidth: 1, 
                borderColor: colors.border 
            }}>
                <Text style={{ 
                    color: colors.gold, 
                    fontSize: 24, 
                    fontWeight: '800', 
                    marginBottom: 12 
                }}>
                    Découvrir - TRUE QUÉBEC ⚜️
                </Text>
                <Text style={{ 
                    color: colors.lightLeather, 
                    fontSize: 12, 
                    marginBottom: 8 
                }}>
                    Trouve les meilleurs spots pour toi et tes amies
                </Text>
                <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    backgroundColor: colors.leather, 
                    borderRadius: 12, 
                    padding: 12 
                }}>
                    <Ionicons name="search" size={20} color={colors.lightLeather} />
                    <Text style={{ 
                        color: colors.lightLeather, 
                        marginLeft: 8, 
                        fontSize: 14 
                    }}>
                        Trouver un spot, un événement...
                    </Text>
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
                        style={{ 
                            marginRight: 12, 
                            paddingHorizontal: 16, 
                            paddingVertical: 8, 
                            borderRadius: 20, 
                            backgroundColor: cat.category === selectedCategory 
                                ? 'rgba(245, 200, 66, 0.2)' 
                                : colors.leather,
                            borderWidth: 1,
                            borderColor: cat.category === selectedCategory 
                                ? colors.gold 
                                : 'transparent'
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons 
                                name={cat.icon} 
                                size={16} 
                                color={cat.category === selectedCategory ? colors.gold : colors.lightLeather} 
                                style={{ marginRight: 6 }}
                            />
                            <Text style={{ 
                                color: cat.category === selectedCategory ? colors.gold : colors.lightLeather, 
                                fontWeight: '600', 
                                fontSize: 13 
                            }}>
                                {cat.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Content Feed */}
            <ScrollView style={styles.container}>
                <Text style={{ 
                    color: colors.gold, 
                    fontWeight: '700', 
                    fontSize: 16, 
                    marginBottom: 16 
                }}>
                    {selectedCategory 
                        ? `${selectedCategory.toUpperCase()} SPOTS` 
                        : 'TOUS LES SPOTS LOCAUX'}
                </Text>

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
                    <ActivityIndicator size="large" color={colors.gold} style={{ marginTop: 50 }} />
                ) : items.length === 0 ? (
                    <Text style={{ 
                        color: colors.lightLeather, 
                        textAlign: 'center', 
                        marginTop: 50,
                        fontSize: 14
                    }}>
                        Aucun résultat trouvé. Essaye une autre catégorie.
                    </Text>
                ) : (
                    items.map((item) => <DiscoveryCard key={item.id} item={item} />)
                )}
            </ScrollView>
        </View>
    );
};

export default DiscoveryScreen;

