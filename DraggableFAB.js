// DraggableFAB.js
import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, PanResponder, Animated, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ExpandedContent from './ExpandedContent'; // Import the ExpandedContent component
import FastImage from 'react-native-fast-image';

const DraggableFAB = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event(
            [
                null,
                {
                    dx: pan.x,
                    dy: pan.y,
                },
            ],
            { useNativeDriver: false }
        ),
        onPanResponderRelease: (event, gesture) => {
            if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
                // Check if the gesture is a tap (not a drag)
                toggleExpansion();
            }
        },
    });

    const toggleExpansion = () => {
        Animated.spring(pan, {
            toValue: isExpanded ? { x: 0, y: 0 } : { x: 100, y: 100 }, // Adjust the expanded position as needed
            useNativeDriver: false,
        }).start();

        setIsExpanded(!isExpanded);
    };

    const closeExpandedFAB = () => {
        Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();

        setIsExpanded(false);
    };

    return (
        <View style={styles.fabContainer}>
            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    styles.fab,
                    { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
                    isExpanded && styles.expandedFab,
                ]}
            >
                {isExpanded ? (
                    <TouchableOpacity onPress={closeExpandedFAB} style={styles.closeButton}>
                        <Icon name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                ) : (
                    <FastImage
                        source={require('./src/undgif.gif')} // Replace with the actual path to your GIF
                        style={{ width: 30, height: 30 }}
                    />
                )}
            </Animated.View>

            {/* Include the ExpandedContent component when FAB is expanded */}
            {isExpanded && (
                <View style={styles.expandedContentContainer}>
                    <ExpandedContent />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    fabContainer: {
        position: 'absolute',
        zIndex: 999, // Set a high zIndex to ensure it's above other components
    },
    fab: {
        backgroundColor: 'black',
        borderRadius: 60,
        top: 110,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // For Android shadow
        zIndex: 999, // Set a high zIndex to ensure it's above other components
    },
    expandedFab: {
        backgroundColor: '#CC4241', // Adjust the expanded FAB color as needed
        left: -75,
        top: 80
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 15,
        padding: 5,
    },
    expandedContentContainer: {
        height: 300,
        position: 'absolute',
        left: '80%',
        transform: [{ translateX: -50 }, { translateY: 10 }],
        zIndex: 99999, // Ensure the content appears above other components
    },
});

export default DraggableFAB;
