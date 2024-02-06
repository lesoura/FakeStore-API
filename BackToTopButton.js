import React from 'react';
import { TouchableOpacity, Image, Animated } from 'react-native';

const BackToTopButton = ({ onPress, opacity }) => (
    <Animated.View style={[styles.backToTopButton, { opacity: opacity }]}>
        <TouchableOpacity
            style={styles.backToTopTouchable}
            onPress={onPress}
        >
            <Image
                source={require('./src/up.png')}  // Replace with the actual path to your image
                style={styles.backToTopImage}
            />
        </TouchableOpacity>
    </Animated.View>
);

const styles = {
    backToTopButton: {
        position: 'absolute',
        bottom: 70,
        right: 0,
        backgroundColor: '#fff',
        padding: 10,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderTopWidth: 0.5
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

export default BackToTopButton;
