import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const VideoBackground: React.FC = () => {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Video
                source={{ uri: "background" }} // References android/app/src/main/res/raw/background.mp4
                style={styles.video}
                resizeMode="cover"
                repeat
                muted
                playInBackground={false}
                playWhenInactive={false}
            />
            <View style={styles.overlay} />
        </View>
    );
};

const styles = StyleSheet.create({
    video: {
        width: width + 20, // Slight overshoot to prevent edges
        height: height + 20,
        position: 'absolute',
        top: -10,
        left: -10,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.7)', // Dark blue-ish overlay matching theme
    },
});

export default VideoBackground;
