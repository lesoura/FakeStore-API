import React from 'react';
import { TouchableOpacity, Image, Animated } from 'react-native';

const ToggleNavBarButton = ({ onPress, opacity }) => (
    <Animated.View style={[styles.backToTopButton, { opacity: opacity }]}>
        <TouchableOpacity
            style={styles.backToTopTouchable}
            onPress={onPress}
        >
            <Image
                source={require('./src/categories.png')}  // Replace with the actual path to your image
                style={styles.backToTopImage}
            />
        </TouchableOpacity>
    </Animated.View>
);

const styles = {
    backToTopButton: {
        position: 'absolute',
        bottom: 120,
        right: 0,
        backgroundColor: '#fff',
        padding: 10,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8
    },
    backToTopTouchable: {
        flex: 1,
    },
    backToTopImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
};

export default ToggleNavBarButton;
