import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
// import * as  icon from '@fortawesome/fontawesome-svg-core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from './CartContext';

const CartList = ({ navigation }) => {
    const { updateCartItemCount } = useCart();
    const [cartItems, setCartItems] = useState([]);

    // Fetch cart items from AsyncStorage when the component mounts
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const storedCartItems = await AsyncStorage.getItem('cart');
                if (storedCartItems) {
                    setCartItems(JSON.parse(storedCartItems));
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, []);

    // Fetch cart items from AsyncStorage when the component mounts
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const storedCartItems = await AsyncStorage.getItem('cart');
                if (storedCartItems) {
                    setCartItems(JSON.parse(storedCartItems));
                    updateCartItemCount(JSON.parse(storedCartItems).length);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [updateCartItemCount]);

    const toggleCheckbox = (itemId) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === itemId) {
                return { ...item, checked: !item.checked };
            }
            return item;
        });

        setCartItems(updatedCart);
    };

    const calculateTotal = () => {
        return processedCartItems().reduce((total, item) => {
            if (item.checked) {
                return total + item.price * item.quantity;
            }
            return total;
        }, 0).toFixed(2);
    };

    // Remove a specific item from the cart or decrease its quantity by 1
    const removeItem = (itemId) => {
        const itemIndex = cartItems.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
            const updatedCart = [...cartItems];
            if (updatedCart[itemIndex].quantity > 1) {
                updatedCart[itemIndex].quantity -= 1;
            } else {
                // If quantity is 1, remove the item from the cart
                updatedCart.splice(itemIndex, 1);
            }

            setCartItems(updatedCart);

            // Save updated cart to AsyncStorage
            AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const addItem = async (itemId) => {
        const existingItem = cartItems.find(item => item.id === itemId);

        if (existingItem) {
            // If the item already exists in the cart, add a new item with the same ID
            const newItem = { ...existingItem, quantity: existingItem.quantity + 1 };
            const updatedCart = [...cartItems, newItem];
            setCartItems(updatedCart);
            await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        } else {
            // If the item doesn't exist in the cart, add it with a quantity of 1
            const newItem = { ...cartItems.find(item => item.id === itemId), quantity: 1 };
            const updatedCart = [...cartItems, newItem];
            setCartItems(updatedCart);
            await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };


    const handleCheckout = () => {
        // Filter out only the selected items
        const selectedItems = cartItems.filter(item => item.checked);

        if (selectedItems.length > 0) {
            // Calculate total quantity and price for selected items
            const totalQuantity = selectedItems.reduce((total, item) => total + item.quantity, 0);
            const totalPrice = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

            // Navigate to Checkout with selected items' details
            navigation.navigate('Checkout', { selectedItems, totalQuantity, totalPrice });
        } else {
            // Show an alert or perform any action indicating that no item is selected
            Alert.alert('No Items Selected', 'Please select at least one item to checkout.');
        }
    };



    // Remove all items from the cart
    const removeAllItems = () => {
        if (cartItems.length === 0) {
            Alert.alert('No Items', 'There is no item in the cart list.');
            return;
        }

        Alert.alert(
            'Confirmation',
            'Are you sure to remove all your items?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        setCartItems([]);
                        // Clear cart from AsyncStorage
                        AsyncStorage.removeItem('cart');
                    },
                },
            ],
            { cancelable: false }
        );
    };

    // Preprocess the data to consolidate duplicate items
    const processedCartItems = () => {
        const uniqueItems = [];
        cartItems.forEach(item => {
            const existingItem = uniqueItems.find(uniqueItem => uniqueItem.id === item.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                uniqueItems.push({ ...item, quantity: 1 });
            }
        });
        return uniqueItems;
    };

    return (
        <View style={styles.container}>
            <Image source={require('./src/categories.png')} style={{ width: 30, height: 32, marginRight: 7, alignSelf: 'center', padding: 50 }} />
            <Text style={styles.title}>My Cart List</Text>
            {cartItems.length === 0 ? (
                <Text>Your cart is empty</Text>
            ) : (
                <>
                    <FlatList
                        data={processedCartItems()}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.cartItem}>
                                <View style={styles.itemDetails}>
                                    <CheckBox
                                        value={item.checked}
                                        onValueChange={() => toggleCheckbox(item.id)}
                                    />
                                    <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                                        <Text style={styles.price}>${item.price.toFixed(2)} x {item.quantity}</Text>
                                    </View>
                                </View>
                                <View style={styles.buttonsContainer}>
                                    {/* Remove button */}
                                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                                        <Image source={require('./src/remove.png')} style={styles.deleteIcon} />
                                    </TouchableOpacity>
                                    {/* Plus button */}
                                    <TouchableOpacity onPress={() => addItem(item.id)}>
                                        <Image source={require('./src/pluss.png')} style={styles.plusIcon} />
                                    </TouchableOpacity>
                                </View>

                            </View>
                        )}
                    />
                    {/* Add Free Shipping text below the table */}
                    <View style={styles.freeShippingContainer}>
                        <Text style={styles.freeShippingText}>🚚 Free Shipping on All Orders!</Text>
                    </View>
                    {/* Checkout button */}
                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={handleCheckout}
                    >
                        <Text style={styles.checkoutButtonText}>Checkout</Text>
                    </TouchableOpacity>
                </>
            )}
            <View style={styles.rowContainer}>
                {/* Left column - Total Price */}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalPrice}>${calculateTotal()}</Text>
                </View>

                {/* Right column - Remove All and Continue Shopping */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.removeAllButton}
                        onPress={removeAllItems}
                    >
                        <Text style={styles.removeAllButtonText}>Remove All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.continueShoppingButton}
                        onPress={() => navigation.replace('ProductList')}
                    >
                        <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsContainer}>

                </View>
            </View>

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
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 0.5,
        borderStyle: 'dashed',
        marginBottom: 5,
    },
    itemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 5,
    },
    itemTitle: {
        maxWidth: 200,  // Adjust the maximum width as needed
    },
    price: {
        color: '#3498db',
        fontWeight: 'bold',
    },
    checkoutButton: {
        backgroundColor: '#007C80',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 5
    },
    checkoutButtonText: {
        color: 'white',
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
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10,
    },
    plusIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    removeAllButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginRight: 10,
        alignItems: 'center',
        width: '100%'
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
        borderTopWidth: 0.5,
        paddingTop: 15
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalLabel: {
        marginRight: 8,
    },
    totalPrice: {
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    removeAllButton: {
        marginRight: 8,
        padding: 8,
        backgroundColor: '#CC4241', // Adjust the background color as needed
        borderRadius: 8,
    },
    removeAllButtonText: {
        color: 'white', // Adjust the text color as needed
    },
    continueShoppingButton: {
        padding: 8,
        backgroundColor: '#B8DCD4',
        borderRadius: 8,
    },
    continueShoppingButtonText: {
        color: 'black', // Adjust the text color as needed

    },
    freeShippingContainer: {
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 0
    },
    freeShippingText: {
        fontWeight: 'bold',
        color: '#007C80', // You can adjust the color as needed
    },
});

export default CartList;
