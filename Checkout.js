// Checkout.js
import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
// Import the necessary components from react-native-paper
import { TextInput, Button } from 'react-native-paper';

import CardIcon from './src/card.png'; // Add the correct path to your card icon
import VoucherIcon from './src/voucher.png'; // Add the correct path to your voucher icon

const Checkout = ({ route }) => {
    const selectedItems = route.params?.selectedItems || [];
    const [paymentMode, setPaymentMode] = useState('Select payment method');
    const [selectedVoucher, setSelectedVoucher] = useState('Select Voucher');
    const [shippingAddress, setShippingAddress] = useState('Select Location');
    const [message, setMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // Add this line for phone number state

    // Calculate estimated delivery date (current day + 3 days)
    const currentDate = new Date();
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(currentDate.getDate() + 3);

    // Count occurrences of each selected item
    const itemOccurrences = selectedItems.reduce((acc, item) => {
        acc[item.id] = (acc[item.id] || 0) + 1;
        return acc;
    }, {});

    // Function to check if all required fields are filled
    const isFormValid = () => {
        return (
            phoneNumber.trim() !== '' &&
            shippingAddress !== 'Select Location' &&
            paymentMode !== 'Select payment method' &&
            selectedVoucher !== 'Select Voucher'
        );
    };

    // Function to format date to "Month DD, YYYY" format
    const formatDate = (date) => {
        const options = { month: 'long', day: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    return (
        <View style={styles.container}>
            <View style={styles.cardWrapper}>
                <View style={styles.cardContent}>
                    <Image source={require('./src/categories.png')} style={{ width: 30, height: 32, marginRight: 7, alignSelf: 'center', padding: 50 }} />
                    <Text style={styles.title}>Checkout Information</Text>

                    {/* Location Icon and Subtitles */}
                    <View style={styles.locationContainer}>
                        <Image source={require('./src/location.png')} style={styles.locationIcon} />
                        <View>
                            <Text style={styles.subtitle}>Delivery Address:</Text>
                        </View>
                    </View>

                    {/* Addresses */}
                    <View style={styles.addressContainer}>
                        <Text style={styles.subtitle}>Ships From: Manila</Text>
                    </View>

                    {/* Subtitle for Phone Number */}
                    <Text style={styles.subtitle}>Phone Number:</Text>

                    {/* Phone Number Input */}
                    <TextInput
                        label="Phone Number"
                        value={phoneNumber}
                        onChangeText={(text) => setPhoneNumber(text)}
                        keyboardType="phone-pad"
                        style={styles.phoneNumberInput}
                        mode="outlined" // Use the outlined style
                        theme={{
                            colors: {
                                primary: '#3498db', // Set primary color
                            },
                        }}
                    />

                    {/* Shipping Address Dropdown */}
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.subtitle2}>Shipping To:</Text>
                        <ModalDropdown
                            options={['Manila', 'Pasay', 'Makati', 'Quezon', 'Cavite']}
                            defaultValue={shippingAddress}
                            onSelect={(index, value) => setShippingAddress(value)}
                            style={[styles.dropdown2, { fontSize: 60 }]}
                        />
                    </View>
                </View>
            </View>

            {/* Display selected items with quantity */}
            {Array.from(new Set(selectedItems.map(item => item.id))).map(itemId => (
                <View key={itemId} style={styles.selectedItemContainer}>
                    <Image source={{ uri: selectedItems.find(item => item.id === itemId).images[0] }} style={styles.itemImage} />
                    <View style={styles.itemDetails}>
                        <Text>{selectedItems.find(item => item.id === itemId).title}</Text>
                        <Text>Quantity: {itemOccurrences[itemId]}</Text>
                    </View>
                    {/* Add more item details as needed */}
                </View>
            ))}

            {/* Payment Mode Dropdown */}
            <View style={styles.dropdownContainer}>
                <Image source={CardIcon} style={styles.icon} />
                <Text style={{ fontWeight: 'bold' }}>Payment Option:</Text>
                <ModalDropdown
                    options={['Credit Card', 'Debit Card', 'Cash On Delivery', 'Gcash', "Galactical Cash"]}
                    defaultValue={paymentMode}
                    onSelect={(index, value) => setPaymentMode(value)}
                    style={styles.dropdown}
                />
            </View>

            {/* Voucher Dropdown */}
            <View style={styles.dropdownContainer}>
                <Image source={VoucherIcon} style={styles.icon} />
                <Text style={{ fontWeight: 'bold' }}>Voucher:</Text>
                <ModalDropdown
                    options={['10% Off', '10% Cashback', '5% Off Delivery Fee', 'Free Item Protection', 'Jumalolo']}
                    defaultValue={selectedVoucher}
                    onSelect={(index, value) => setSelectedVoucher(value)}
                    style={styles.dropdown}
                />
            </View>

            {/* Checkout date and Estimated Delivery labels */}
            <View style={styles.rowContainer}>
                <Text style={styles.totalLabel}>Checkout date:</Text>
                <Text>{formatDate(currentDate)}</Text>
            </View>
            <View style={styles.rowContainer2}>
                <Text style={styles.totalLabel}>Estimated Delivery:</Text>
                <Text>{formatDate(estimatedDeliveryDate)}</Text>
            </View>

            {/* Message TextInput */}
            <TextInput
                label="Message"
                value={message}
                onChangeText={(text) => setMessage(text)}
                style={styles.messageInput}
                mode="outlined" // Use the outlined style
                multiline
                numberOfLines={3} // Adjust the number of lines as needed
                theme={{
                    colors: {
                        primary: '#3498db', // Set primary color
                    },
                }}
            />

            {/* Total Price and Place Order (moved to the bottom) */}
            <View style={styles.totalOrderContainer}>
                <View style={styles.rowContainer}>
                    {/* Left column - Total Price */}
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        {/* Calculate and display the total price */}
                        <Text style={styles.totalPrice}>
                            ${selectedItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
                        </Text>
                    </View>

                    {/* Right column - Place Order */}
                    <TouchableOpacity
                        style={[styles.placeOrderButton, { backgroundColor: isFormValid() ? '#27ae60' : '#95a5a6' }]}
                        disabled={!isFormValid()} // Disable button if form is not valid
                    >
                        <Text style={styles.placeOrderButtonText}>Place Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        width: 20,
        height: 20,
        marginRight: 7,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    subtitle2: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    phoneNumberInput: {
        height: 40,
        borderColor: 'gray',
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
    },
    cardWrapper: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5, // for Android shadow
        shadowColor: 'rgba(0, 0, 0, 0.1)', // for iOS shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        padding: 20,
        marginBottom: 20, // Add margin as needed
    },
    totalOrderContainer: {
        alignSelf: 'center',
        width: '110%',
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        marginBottom: 20,
        borderBottomWidth: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        alignSelf: 'center'
    },
    mapContainer: {
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
    selectedItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#3498db',
        borderRadius: 5,
        marginBottom: 10,
    },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 5,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    dropdown: {
        height: 30,
        marginLeft: 10,
        paddingTop: 6,
        borderWidth: 0.5,
        borderStyle: 'dashed',
        padding: 10,
        borderRadius: 10
    },
    dropdown2: {
        height: 30,
        paddingTop: 10,
        marginLeft: 10,
        borderWidth: 0.5,
        borderStyle: 'dashed',
        padding: 10,
        borderRadius: 10,
        paddingBottom: -80
    },
    messageInput: {
        marginTop: 5,
        height: 30,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingTop: 5
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderStyle: 'dashed',
        marginTop: 5
    },
    rowContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderStyle: 'dashed',
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalLabel: {
        marginRight: 8,
        marginLeft: 15,
        fontWeight: 'bold',
    },
    totalPrice: {
        fontWeight: 'bold',
    },
    placeOrderButton: {
        padding: 22,
        backgroundColor: '#27ae60', // Adjust the background color as needed
    },
    placeOrderButtonText: {
        color: 'white', // Adjust the text color as needed
        fontWeight: 'bold',
    },
    addressContainer: {
        marginBottom: 10,
    },
    paymentVoucherContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 10,
        marginRight: 10
    },
});

export default Checkout;
