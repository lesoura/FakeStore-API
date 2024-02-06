import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, BackHandler, ScrollView, Alert, Modal as RNModal } from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-snap-carousel'; // Import the carousel
import Modal from 'react-native-modal';
import ImageView from 'react-native-image-view'; // Import the ImageView component

import FakeNavBar from './FakeNavBar';
import SearchBar2 from './SearchBar2';

const ProductDetails = ({ route, navigation }) => {
    const { item } = route.params;
    const [searchText, setSearchText] = useState('');
    const [isFavourite, setIsFavourite] = useState(false);
    const fakeNavBarRef = useRef(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [lastTap, setLastTap] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    // State for ImageView
    const [isImageViewVisible, setImageViewVisible] = useState(false);
    const [selectedImageIndex2, setSelectedImageIndex2] = useState(0);
    const [isImageViewModalVisible, setImageViewModalVisible] = useState(false);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        // Check if the item is in favourites when the component mounts
        checkFavouriteStatus();

        // Set the ref when the component mounts
        fakeNavBarRef.current = (triggerAnimation) => (fakeNavBarRef.current = triggerAnimation);
    }, []);

    const backAction = () => {
        navigation.navigate("ProductList");
    }

    // Data for ImageView
    const images = item.images.map(imageUri => ({
        source: { uri: imageUri },
        width: 806,
        height: 720,
    }));

    // Function to open ImageView
    const openImageView = () => {
        setImageViewVisible(true);
    };

    // Function to close ImageView
    const closeImageView = () => {
        setImageViewVisible(false);
    };

    const onMainImageClick = () => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastTap;

        if (timeDiff < 300) {
            toggleFavourite2();
        } else {
            // Single click, update last tap time
            setLastTap(currentTime);
        }
    };

    const onMainImageClick2 = () => {
        openImageView();
    };

    const onSmallImageClick = (index) => {
        // Update the selected image index for both main and small images
        setSelectedImageIndex2(index);
        mainCarouselRef.current.snapToItem(index);
    };

    const checkFavouriteStatus = async () => {
        try {
            const favourites = await AsyncStorage.getItem('favourites');
            if (favourites) {
                const parsedFavourites = JSON.parse(favourites);
                const isItemInFavourites = parsedFavourites.some(favItem => favItem.id === item.id);
                setIsFavourite(isItemInFavourites);
            }
        } catch (error) {
            console.error('Error checking favourite status:', error);
        }
    };

    const toggleFavourite = async () => {
        try {
            if (isFavourite) {
                // Remove item from favourites
                removeFromFavourites();
            } else {
                // Add item to favourites
                addToFavourites();
            }
            // Toggle the state
            setIsFavourite(!isFavourite);
        } catch (error) {
            console.error('Error toggling favourite:', error);
        }
    };

    const addToFavourites = async () => {
        try {
            const favourites = await AsyncStorage.getItem('favourites');
            const parsedFavourites = favourites ? JSON.parse(favourites) : [];
            parsedFavourites.push(item);
            await AsyncStorage.setItem('favourites', JSON.stringify(parsedFavourites));
            Alert.alert('Favourite', 'Product added to favourites!');
        } catch (error) {
            console.error('Error adding to favourites:', error);
        }
    };

    const toggleFavourite2 = async () => {
        try {
            if (isFavourite) {
                // Remove item from favourites
                removeFromFavourites2();
            } else {
                // Add item to favourites
                addToFavourites2();
            }
            // Toggle the state
            setIsFavourite(!isFavourite);
        } catch (error) {
            console.error('Error toggling favourite:', error);
        }
    };

    const addToFavourites2 = async () => {
        try {
            const favourites = await AsyncStorage.getItem('favourites');
            const parsedFavourites = favourites ? JSON.parse(favourites) : [];
            parsedFavourites.push(item);
            await AsyncStorage.setItem('favourites', JSON.stringify(parsedFavourites));
            // Double click detected
            openModal();

            // Close the modal after 2000 milliseconds (adjust as needed)
            setTimeout(() => {
                closeModal();
            }, 2000);
        } catch (error) {
            console.error('Error adding to favourites:', error);
        }
    };

    const removeFromFavourites2 = async () => {
        try {
            const favourites = await AsyncStorage.getItem('favourites');
            if (favourites) {
                const parsedFavourites = JSON.parse(favourites);
                const updatedFavourites = parsedFavourites.filter(favItem => favItem.id !== item.id);
                await AsyncStorage.setItem('favourites', JSON.stringify(updatedFavourites));
            }
        } catch (error) {
            console.error('Error removing from favourites:', error);
        }
    };

    const removeFromFavourites = async () => {
        try {
            const favourites = await AsyncStorage.getItem('favourites');
            if (favourites) {
                const parsedFavourites = JSON.parse(favourites);
                const updatedFavourites = parsedFavourites.filter(favItem => favItem.id !== item.id);
                await AsyncStorage.setItem('favourites', JSON.stringify(updatedFavourites));
                Alert.alert('Favourite', 'Product removed from favourites!');
            }
        } catch (error) {
            console.error('Error removing from favourites:', error);
        }
    };

    const addToCart = async () => {
        try {
            // Retrieve existing cart items from AsyncStorage
            const existingCart = await AsyncStorage.getItem('cart');
            const cartItems = existingCart ? JSON.parse(existingCart) : [];

            // Add the selected product to the cart
            cartItems.push(item);

            // Refresh the screen by replacing it with itself
            navigation.replace('ProductDetails', { item: item }); // Replace with the same screen

            // Save updated cart to AsyncStorage
            await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
            Alert.alert('Add to Cart', 'Product added to cart!');

            // Set the ref when the component mounts
            fakeNavBarRef.current = (triggerAnimation) => (fakeNavBarRef.current = triggerAnimation);
        } catch (error) {
            console.error('Add to Cart', 'Error adding to cart:', error);
        }
    };

    const buyNow = () => {
        // Navigate to the SingleItemPage and pass the item as a parameter
        navigation.navigate('SingleItemPage', { item: item });
    };

    const mainCarouselRef = React.createRef();

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const openImageViewModal = () => {
        setImageViewModalVisible(true);
    };

    const closeImageViewModal = () => {
        setImageViewModalVisible(false);
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 10 }}>
                <SearchBar2 />
                <View style={{ padding: 10, alignItems: 'center' }}>
                    {/* Horizontal Scrollable Main Image Carousel */}
                    <Carousel
                        ref={mainCarouselRef}
                        data={item.images}
                        renderItem={({ item }) => (
                            <View style={{ padding: 10, zIndex: 0 }}>
                                <TouchableOpacity onPress={onMainImageClick} onLongPress={openImageViewModal}>
                                    <Image
                                        style={{ width: '100%', height: 350, resizeMode: 'cover', borderRadius: 10 }}
                                        source={{ uri: item }}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        sliderWidth={390}
                        itemWidth={390}
                        onSnapToItem={(index) => onMainImageClick(index)}
                    />

                    {/* Small Images Scrollable Container */}
                    <ScrollView horizontal style={styles.smallImagesContainer}>
                        {item.images.map((image, index) => (
                            <TouchableOpacity key={index} onPress={() => onSmallImageClick(index)}>
                                <Image
                                    style={styles.smallImage}
                                    source={{ uri: image }}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <Text style={styles.title}>{item.title}</Text>

                <View style={styles.view1}>
                    <Text style={{ textAlign: 'justify' }}>
                        <Text style={styles.label}>Description: </Text>
                        {item.description}
                    </Text>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.column}>
                        <Text style={styles.label}>Category:</Text>
                        <Text>{item.category.name}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Seller:</Text>
                        <Text>JJBuilders</Text>
                    </View>
                </View>
                <View style={styles.view2}>
                    {/* First row */}
                    <View style={styles.rowContainer}>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>Rating:</Text>
                            <View style={styles.starHeartContainer}>
                                <Text>
                                    ⭐⭐⭐⭐⭐
                                </Text>

                            </View>
                        </View>
                        <TouchableOpacity onPress={toggleFavourite} style={styles.favoriteButton}>
                            <Image
                                source={isFavourite ? require('./src/hearted.png') : require('./src/heart.png')}
                                style={styles.favoriteIcon}
                            />

                        </TouchableOpacity>
                        <Image
                            source={isFavourite ? require('./src/share.png') : require('./src/share.png')}
                            style={styles.shareIcon2}
                        />
                        <Text style={styles.price}>${item.price}</Text>
                    </View>

                    {/* Second row */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={addToCart}>
                            <Text style={styles.buttonText}>Add to Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button2, { backgroundColor: '#B8DCD4' }]}
                            onPress={buyNow}
                        >
                            <Text style={styles.buttonText}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Modal for additional image */}
                <Modal
                    isVisible={isModalVisible}
                    backdropColor="rgba(0,0,0,0)"
                    backdropOpacity={0}
                    animationIn="bounce"
                    animationOut="slideOutUp"
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={closeModal}>
                            <Image
                                style={{ width: 200, height: 200, resizeMode: 'contain' }}
                                source={require('./assets/heart2.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </Modal>

                {/* Image Modal */}
                <RNModal
                    animationType="slide"
                    transparent={true}
                    visible={isImageViewModalVisible}
                    onRequestClose={closeImageViewModal}
                >
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                        onPress={closeImageViewModal}
                    >
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                source={{ uri: item.images[selectedImageIndex] }}
                            />

                            {/* Exit Button */}
                            <TouchableOpacity
                                style={{ position: 'absolute', top: 20, right: 20, padding: 10 }}
                                onPress={closeImageViewModal}
                            >
                                <Text style={{ color: 'white', fontSize: 18 }}>Exit</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </RNModal>

            </View>
            <FakeNavBar onCartAdd={fakeNavBarRef.current} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginRight: 5,
        fontWeight: 'bold',
    },
    starHeartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    view1: {
        marginBottom: 10,
        textAlign: 'justify', // Add this line to justify the text
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        borderBottomWidth: 0.5,
        borderStyle: 'dashed',
        paddingBottom: 10,
        width: '100%',
        textAlign: 'center'
    },
    description: {
        marginTop: 10,
    },
    detailsContainer: {
        paddingTop: -5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    column: {
        width: '48%', // Adjust as needed
    },
    view2: {
        borderTopWidth: 0.5,
        paddingBottom: 60,
        marginBottom: 10,
        paddingTop: 5,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        backgroundColor: '#79ABCD',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    button2: {
        flex: 1,
        backgroundColor: '#00FFC6',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    label: {
        fontWeight: 'bold',
    },
    description: {
        marginTop: 10,
    },
    favoriteButton: {
        marginLeft: -10
    },
    favoriteIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    shareIcon2: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginLeft: -60
    },
    smallImagesContainer: {
        marginTop: 10,
        height: 500,
        alignSelf: 'center',
        marginBottom: -420
    },
    smallImage: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 5,
        marginRight: 10, // Adjust as needed for spacing
    },
});

export default ProductDetails;
