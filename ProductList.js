import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, SafeAreaView, Image, TouchableOpacity, Animated, Alert, Button } from 'react-native';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import necessary components and modules
import { Easing } from 'react-native';
import ToggleNavBarButton from './ToggleNavBarButton';  // Import the updated ToggleNavBarButton
import Carousel from 'react-native-snap-carousel'; // Import the carousel

import SearchBar from './SearchBar';
import FakeNavBar from './FakeNavBar';
import BackToTopButton from './BackToTopButton';
import DraggableFAB from './DraggableFAB';

const SkeletonCard = () => (
    <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
            flexDirection="column"
            alignItems="center"
            paddingVertical={16} // Add padding to mimic a card
            borderRadius={8} // Add borderRadius to mimic a card
            backgroundColor="#fff" // Set a background color for the card
            shadowColor="#000" // Set shadow color
            shadowOffset={{ width: 0, height: 2 }} // Set shadow offset
            shadowOpacity={0.2} // Set shadow opacity
            shadowRadius={4} // Set shadow radius
            borderWidth={2}
            borderColor={'lightgray'}
            height={290}
            width={190}
            margin={5}
        >
            {/* Box */}
            <SkeletonPlaceholder.Item
                width={150}
                height={150} // Adjust the height as needed
                marginBottom={5}
            />
            <SkeletonPlaceholder.Item flexDirection="column" alignItems='left' position='left' width={'90%'}>
                {/* Text lines */}
                <SkeletonPlaceholder.Item
                    width={120}
                    height={20}
                    borderRadius={4}
                    marginBottom={8}
                    alignSelf='flex-start'
                />
                <SkeletonPlaceholder.Item
                    width={10}
                    height={20}
                    borderRadius={4}
                    marginBottom={8}
                    alignSelf='flex-start'
                />
                <SkeletonPlaceholder.Item
                    width={90}
                    height={20}
                    borderRadius={4}
                    marginBottom={8}
                    alignSelf='flex-start'
                />
                <SkeletonPlaceholder.Item
                    width={50}
                    height={20}
                    borderRadius={4}
                    alignSelf='flex-start'
                />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
                marginTop={-20}
                width={20}
                height={20}
                borderRadius={10}
                marginLeft={-20}
            />
            <SkeletonPlaceholder.Item
                marginTop={-20}
                width={20}
                height={20}
                borderRadius={10}
                marginLeft={25}

            />
            <SkeletonPlaceholder.Item
                marginTop={-20}
                width={20}
                height={20}
                borderRadius={10}
                marginLeft={65}
            />
            <SkeletonPlaceholder.Item
                marginTop={-20}
                width={20}
                height={20}
                borderRadius={10}
                marginLeft={105}
            />
            <SkeletonPlaceholder.Item
                marginTop={-20}
                width={20}
                height={20}
                borderRadius={10}
                marginLeft={145}
            />
        </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
);

const SkeletonCarouselItem = () => (
    <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
            flexDirection="column"
            alignItems="center"
            paddingVertical={16}
            borderRadius={8}
            backgroundColor="#fff"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.2}
            shadowRadius={4}
            borderWidth={2}
            borderColor={'lightgray'}
            height={200}
            width={390}
            margin={10}
        >
            <SkeletonPlaceholder.Item
                width={370}
                height={180}
                marginBottom={10}
                borderRadius={8}
            />
        </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
);

const carouselData = [
    {
        id: 1,
        source: 'https://wallpaperaccess.com/full/1860315.jpg',
    },
    {
        id: 2,
        source: 'https://uploads.audi-mediacenter.com/system/production/media/70272/images/3c92d2acbf6ab5f85be8006f854786f0f0ff36be/A1813681_web_2880.jpg?1698341967',
    },
    {
        id: 3,
        source: 'https://hips.hearstapps.com/hmg-prod/images/vol-15-lexus-lfa-lead-1-1676071477.jpg',
    },
    {
        id: 4,
        source: 'https://cdn.elferspot.com/wp-content/uploads/2022/12/09/2015-Porsche-918-Spyder-Weissach-Package-for-sale-USA-01.jpg?class=xl',
    },
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
// Add these declarations within the ProductList component
const AnimatedBackToTopButton = Animated.createAnimatedComponent(BackToTopButton);

const handleCategoriesPress = () => {
    // Trigger the animation in FakeNavBar
    fakeNavBarRef.current.triggerCircleAnimation();
};

// ProductList component
const ProductList = () => {
    const [isNavBarVisible, setIsNavBarVisible] = useState(true);
    // Add a new Animated.Value for the navBarOpacity
    const navBarOpacityValue = useRef(new Animated.Value(1)).current;
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const scrollY = useRef(new Animated.Value(0)).current;
    const navBarOpacity = scrollY.interpolate({
        inputRange: [0, 50],  // Adjust the range as needed
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });
    const backToTopOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });
    const flatListRef = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);
    // Use useState to manage the opacity of the BackToTopButton

    const fakeNavBarRef = useRef(null);  // Use useRef for the FakeNavBar component
    const [cart, setCart] = useState([]);
    const [cartKey, setCartKey] = useState(0);

    const toggleNavBarVisibility = () => {
        // Set navBarOpacity to 1 to force the navbar to appear
        navBarOpacityValue.setValue(1);
        setIsNavBarVisible((prevVisibility) => !prevVisibility);
    };

    const addToCart = async (item) => {
        try {
            // Retrieve the existing cart from AsyncStorage
            const existingCartString = await AsyncStorage.getItem('cart');
            const existingCart = existingCartString ? JSON.parse(existingCartString) : [];

            // Add the selected product to the existing cart
            const updatedCart = [...existingCart, item];

            // Save the updated cart to AsyncStorage
            await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));

            // Update the local state with the updated cart
            setCart(updatedCart);

            // Increment the cartKey to trigger a re-render of the SearchBar
            setCartKey((prevKey) => prevKey + 1);

            // Trigger the animation in FakeNavBar
            if (fakeNavBarRef.current) {
                fakeNavBarRef.current.triggerCircleAnimation();
            }

            Alert.alert('Add to Cart', 'Product added to cart!');
        } catch (error) {
            console.error('Add to Cart', 'Error adding to cart:', error);
        }
    };

    useEffect(() => {
        axios
            .get('https://api.escuelajs.co/api/v1/products')
            .then((response) => {
                setProducts(response.data.filter(data => data.title !== "sasdsad" && data.title !== "newwww"))
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, []);

    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleItemPress = (item) => {
        navigation.navigate('ProductDetails', { item });
    };

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false },
        (event, gestureState) => {
            // Check if scrolling down
            if (gestureState.dy > 0) {
                setIsScrolling(true);
            } else {
                // Check if scrolling up and not currently scrolling
                if (!isScrolling) {
                    setIsScrolling(true);
                    toggleNavBarVisibility();  // Toggle visibility when scrolling up
                }
            }
        }
    );

    const handleScrollEndDrag = () => {
        console.log("jumalolo");
    };

    // Modify the handleScrollUp function
    const handleScrollUp = () => {
        // Update scrollY directly to ensure navBarOpacity is 1
        setIsScrolling(false);
        console.log("Scrolling up");

        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });

        // Trigger the animation in FakeNavBar
        if (fakeNavBarRef.current) {
            fakeNavBarRef.current.triggerCircleAnimation();
        }
    };

    const handleToggle = () => {
        setIsScrolling(false);
        scrollY.setValue(0); // Set the value to 0 instead of 1
        console.log("Scrolling up");

        // Trigger the animation in FakeNavBar
        if (fakeNavBarRef.current) {
            fakeNavBarRef.current.triggerCircleAnimation();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <SearchBar key={cartKey} onSearch={setSearchText} />

            <View style={{ padding: 10 }}>
                <Carousel
                    data={isLoading ? [1, 2, 3, 4] : carouselData}
                    renderItem={({ item }) => (
                        isLoading ? <SkeletonCarouselItem /> : (
                            <View style={{ padding: 10, zIndex: 0 }}>
                                <Image
                                    style={{ width: '100%', height: 200, resizeMode: 'cover', borderRadius: 10 }}
                                    source={{ uri: item.source }}
                                />
                            </View>
                        )
                    )}
                    sliderWidth={390}
                    itemWidth={390}
                />
                <Text style={{ fontSize: 27, fontWeight: 'bold', margin: 10, borderBottomWidth: 0.5, textDecorationLine: 'line-through', textTransform: 'uppercase' }}>UNDEFEATED LIST</Text>
            </View>
            {!isLoading && (
                <View style={{ flex: 1, padding: 10 }}>
                    <AnimatedFlatList
                        data={filteredProducts}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.cardContainer}
                                onPress={() => handleItemPress(item)}>
                                <View style={styles.card}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FastImage
                                            style={{
                                                width: 165,        // Adjust the width as needed
                                                height: 165,       // Adjust the height as needed
                                                borderRadius: 8,   // Add border radius for a rounded look
                                                borderWidth: 1,     // Add border width if you want a border
                                                borderColor: '#ccc' // Set border color
                                            }}
                                            source={{ uri: item.images[0] }}
                                            resizeMode={FastImage.resizeMode.cover} // You can change the resizeMode if needed
                                        />
                                    </View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                        {item.title.length > 17 ? `${item.title.substring(0, 17)}...` : item.title}
                                    </Text>
                                    <Text style={{ fontWeight: 'bold' }}>${item.price}</Text>
                                    <Text>Category: {item.category.name}</Text>
                                    <View style={styles.ratingContainer}>
                                        <Text style={styles.ratingText}>Rating:</Text>
                                        <View style={styles.starContainer}>
                                            <Text>
                                                ⭐⭐⭐⭐⭐
                                            </Text>
                                        </View>
                                    </View>
                                    {/* Add the "Add to Cart" TouchableOpacity button */}
                                    <TouchableOpacity
                                        style={styles.addToCartButton}
                                        onPress={() => addToCart(item)}
                                    >
                                        <Text style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Add to Cart</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ paddingBottom: 15 }}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        ref={flatListRef}
                        onScrollEndDrag={handleScrollEndDrag}
                        onScrollToTop={handleScrollUp}
                    />
                </View>
            )}

            {isLoading && (
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5].map((row) => (
                        <View key={row} style={{ flexDirection: 'row' }}>
                            {[1, 2].map((key) => (
                                <SkeletonCard key={key} />
                            ))}
                        </View>
                    ))}
                </View>
            )}

            <Animated.View
                style={{
                    ...styles.fakeNavBarContainer,
                    opacity: navBarOpacity,
                    display: isNavBarVisible ? 'flex' : 'none', // Show/hide based on state
                }}
            >
                <FakeNavBar onCartAdd={(triggerAnimation) => (fakeNavBarRef.current = { triggerCircleAnimation: triggerAnimation })} />
            </Animated.View>

            {/* Add the ToggleNavBarButton component */}
            <ToggleNavBarButton onPress={handleToggle} opacity={backToTopOpacity} />

            {/* Render the BackToTopButton component with dynamic opacity */}
            <BackToTopButton onPress={handleScrollUp} opacity={backToTopOpacity} />

            {/* Render the DraggableFAB component */}
            <DraggableFAB />
        </SafeAreaView>
    );
};

const styles = {
    cardContainer: {
        flex: 1,
        margin: 5,
        width: '50%', // Occupies half of the container width for two columns
    },
    card: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        height: 'auto',
        borderWidth: 1,
        borderColor: 'rgba(200,200,200,0.5)', // Initial color
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginRight: 10,
    },
    starContainer: {
        flexDirection: 'row',
    },
    star: {
        fontSize: 18,
        color: '#f1c40f',
    },
    skeletonImage: {
        width: '100%',
        height: 100,
        backgroundColor: '#ddd',
        marginBottom: 7,
        borderRadius: 8,
    },
    skeletonText: {
        width: '70%',
        height: 20,
        backgroundColor: '#ddd',
        marginBottom: 5,
        borderRadius: 4,
    },
    skeletonRating: {
        width: 50,
        height: 20,
        backgroundColor: '#ddd',
        marginRight: 10,
        borderRadius: 4,
    },
    skeletonStarContainer: {
        flexDirection: 'row',
    },
    skeletonStar: {
        width: 15,
        height: 15,
        backgroundColor: '#ddd',
        marginRight: 5,
        borderRadius: 50,
    },
    fakeNavBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingVertical: 10,
        zIndex: 2,
    },
    addToCartButton: {
        backgroundColor: '#B8DCD4',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
};

export default ProductList;