import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, Platform, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from './CartContext';

const SearchBar = ({ onSearch }) => {
    const navigation = useNavigation();
    const [cartItemCount, setCartItemCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Update cart item count when the component mounts and when the cart changes
        updateCartItemCount();
    }, [cartItems, cartItemCount, updateCartItemCount]); // Add cartItems as a dependency

    const updateCartItemCount = async () => {
        try {
            const storedCartItems = await AsyncStorage.getItem('cart');
            if (storedCartItems) {
                const cartItems = JSON.parse(storedCartItems);
                // Alert.alert("title", JSON.stringify(cartItems))
                // const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
                const itemCount = cartItems.length;
                setCartItemCount(itemCount);
            } else {
                setCartItemCount(0);
            }
        } catch (error) {
            console.error('Error updating cart item count:', error);
        }
    };

    const SearchBar = ({ onSearch }) => {
        const navigation = useNavigation();
        const { cartItemCount } = useCart();

        useEffect(() => {
            // If you want to do something when the cart item count changes in the SearchBar, you can do it here
        }, [cartItemCount]);

        // rest of your component remains the same
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.2, padding: 10 }}>
            <TextInput
                style={{
                    flex: 1,
                    height: 45,
                    borderRadius: 50,
                    paddingHorizontal: 10,
                    backgroundColor: 'white',
                    fontSize: 17,
                    ...Platform.select({
                        ios: {
                            shadowColor: 'rgba(0, 0, 0, 0.2)',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                        },
                        android: {
                            elevation: 5,
                            borderWidth: 1,
                            borderColor: 'rgba(0, 0, 0, 0.2)',
                        },
                    }),
                }}
                placeholder=" 🔍  |  Search products..."
                onChangeText={onSearch}
            />
            <View style={{ flexDirection: 'row', marginLeft: 10, position: 'relative' }}>
                <TouchableOpacity onPress={() => console.log('Camera icon pressed')}>
                    <Image source={require('./src/camera.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
                    <Image source={require('./src/heart.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('CartList')}>
                    <Image source={require('./src/cart.png')} style={{ width: 30, height: 32, marginRight: 7 }} />
                </TouchableOpacity>
                {cartItemCount > 0 && (
                    <View>
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17 }}>{cartItemCount}</Text>
                    </View>
                )}
            </View>

        </View>
    );
};

export default SearchBar;
