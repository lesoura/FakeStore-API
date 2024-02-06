// Favorites.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';

const Favorites = () => {
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const favorites = await AsyncStorage.getItem('favourites');
                if (favorites !== null) {
                    setFavoriteItems(JSON.parse(favorites));
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, []);

    const toggleCheckbox = (itemId) => {
        const updatedSelectedItems = [...selectedItems];

        if (updatedSelectedItems.includes(itemId)) {
            const index = updatedSelectedItems.indexOf(itemId);
            updatedSelectedItems.splice(index, 1);
        } else {
            updatedSelectedItems.push(itemId);
        }

        setSelectedItems(updatedSelectedItems);
    };

    const removeFavorite = (itemId) => {
        const updatedFavorites = favoriteItems.filter(item => item.id !== itemId);
        setFavoriteItems(updatedFavorites);
        saveFavorites(updatedFavorites);
    };

    const removeSelectedFavorites = () => {
        const updatedFavorites = favoriteItems.filter(item => !selectedItems.includes(item.id));
        setFavoriteItems(updatedFavorites);
        saveFavorites(updatedFavorites);
        setSelectedItems([]);
    };

    const removeAllFavorites = () => {
        Alert.alert(
            'Confirmation',
            'Are you sure to remove all favorites?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        setFavoriteItems([]);
                        saveFavorites([]);
                        setSelectedItems([]);
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const saveFavorites = async (favorites) => {
        try {
            await AsyncStorage.setItem('favourites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('./src/categories.png')} style={{ width: 30, height: 32, marginRight: 7, alignSelf: 'center', padding: 50 }} />
            <Text style={styles.title}>My Favorites</Text>
            {favoriteItems.length === 0 ? (
                <Text>Your favorites list is empty</Text>
            ) : (
                <>
                    <FlatList
                        data={favoriteItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.favoriteItem}>
                                <CheckBox
                                    value={selectedItems.includes(item.id)}
                                    onValueChange={() => toggleCheckbox(item.id)}
                                />
                                <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <TouchableOpacity onPress={() => removeFavorite(item.id)}>
                                    <Image source={require('./src/remove.png')} style={styles.removeIcon} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={removeSelectedFavorites}
                            disabled={selectedItems.length === 0}
                        >
                            <Text style={styles.buttonText}>Remove Selected</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.removeAllButton}
                            onPress={removeAllFavorites}
                        >
                            <Text style={styles.buttonText}>Remove All</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            <TouchableOpacity
                style={styles.continueShoppingButton}
                onPress={() => navigation.replace('ProductList')}
            >
                <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomWidth: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    favoriteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 0.5,
        marginBottom: 5,
        borderStyle: 'dashed'
    },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 5,
    },
    itemTitle: {
        maxWidth: 200,
        flex: 1,
    },
    removeIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        borderTopWidth: 0.5,
        paddingTop: 15
    },
    removeButton: {
        flex: 1,
        backgroundColor: '#CC4241',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    removeAllButton: {
        flex: 1,
        backgroundColor: '#CC4241',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    continueShoppingButton: {
        backgroundColor: '#B8DCD4',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    continueShoppingButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});

export default Favorites;
