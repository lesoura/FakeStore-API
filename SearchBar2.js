import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from './CartContext';

const SearchBar2 = ({ onSearch }) => {
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

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.2, padding: 10 }}>
            <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('CartList')}>
                    {/* Use navigation.navigate to go to the CartList screen */}
                    <Image source={require('./src/cart.png')} style={{ width: 30, height: 32, marginRight: 7 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
                    <Image source={require('./src/heart.png')} style={{ width: 30, height: 30, marginRight: 10 }} />
                </TouchableOpacity>
                {/* You can add more Image components for additional icons */}
            </View>
            {cartItemCount > 0 && (
                <View>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, paddingBottom: 7 }}>{cartItemCount}</Text>
                </View>
            )}
        </View>
    );
};

export default SearchBar2;
