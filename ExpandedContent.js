// ExpandedContent.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const ExpandedContent = () => {
    return (
        <View style={styles.container}>
            <FastImage
                source={require('./src/undgif.gif')} // Replace with the actual path to your GIF
                style={{ width: 70, height: 70, alignSelf: 'center', borderBottomWidth: 0.5, marginBottom: 5 }}
            />
            <Text style={styles.text}>Wazzuh!</Text>
            {/* Add more content here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        elevation: 3,
        position: 'absolute',
        top: '50%', // Center vertically
        left: '90%', // Center horizontally
        width: 300,
        alignSelf: 'center',
        transform: [{ translateX: 60 }, { translateY: 60 }],
        zIndex: 1,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center'
    },
});

export default ExpandedContent;
