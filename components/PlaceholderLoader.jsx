// LoadingAnimation.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export const PlaceholderLoader = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const styles = getLocalStyles();

  const animation = (dot, delay)=>  Animated.sequence([
    Animated.timing(dot, {
      toValue: -10,
      duration: 300,
      delay: delay,
      useNativeDriver: true,
    }),
    Animated.timing(dot, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }),
  ])

  useEffect(() => {
      Animated.loop(
        Animated.parallel([animation(dot1, 0), animation(dot2, 150), animation(dot3, 300)])
      ).start()
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
    </View>
  );
};

const getLocalStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 8,
      marginHorizontal: 4,
      backgroundColor: "#ffffff",
    },
  });
  return styles
}


