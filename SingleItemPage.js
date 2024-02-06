import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { Dimensions } from 'react-native';

const SingleItemPage = ({ route, navigation }) => {
    const { item } = route.params;
    const [cartItems, setCartItems] = useState([{ ...item, quantity: 1 }]);
    const SCREEN_WIDTH = Dimensions.get('window').width;

    const handleCheckout = () => {
        // Display an alert before navigating to 'ProductList'
        Alert.alert(
            'Check Out',
            'Thank you for your purchase!',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Navigate to 'ProductList' after the alert is dismissed
                        navigation.navigate('ProductList');
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const removeItem = (itemId) => {
        // Display an alert without removing the item
        Alert.alert(
            'Cancel Item',
            'Are you sure you want to cancel this item?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        // Navigate back to 'ProductList' without removing the item
                        navigation.navigate('ProductList');
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.container}>
            <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.price}>${item.price.toFixed(2)} x {item.quantity}</Text>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Image source={require('./src/remove.png')} style={styles.deleteIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FontAwesome5Icon
                name="chevron-right"
                color="rgba(255, 255, 255, 1)"
                size={Platform.select({
                    ios: SCREEN_WIDTH * 0.06,
                    android: SCREEN_WIDTH * 0.05,
                })}
            />
            <Image source={require('./src/cart.png')} style={styles.cartIcon} />
            <View style={styles.header}>
                <Text style={styles.title}>My Cart List</Text>
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />

            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalPrice}>${item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.removeAllButton} onPress={() => removeItem(item.id)}>
                    <Text style={styles.continueShoppingButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.continueShoppingButton} onPress={handleCheckout}>
                    <Text style={styles.removeAllButtonText}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartIcon: {
        width: 30,
        height: 32,
        marginRight: 7,
        alignSelf: 'center',
        padding: 24
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        marginLeft: 7,
        borderBottomWidth: 0.5,
        width: '100%'
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 0.5,
        marginBottom: 5,
    },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 5,
    },
    itemTitle: {
        maxWidth: 200,
    },
    price: {
        color: '#3498db',
        fontWeight: 'bold',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        borderTopWidth: 0.5,
        paddingTop: 10,
    },
    totalLabel: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    totalPrice: {
        color: '#3498db',
        fontWeight: 'bold',
        fontSize: 16,
    },
    deleteIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10,
    },
    removeAllButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginRight: 10,
        alignItems: 'center',
        width: '100%',
    },
    removeAllButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    continueShoppingButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    continueShoppingButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SingleItemPage;
