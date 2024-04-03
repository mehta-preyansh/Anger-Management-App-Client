import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

const AngryToHappyAnimation = () => {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 2000, // Adjust the duration as needed
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  const emojiTransform = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['translateY(100%)', 'translateY(0)'] // Adjust the translation as needed
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.Text style={{ fontSize: 40, transform: [{ translateY: emojiTransform }] }}>😠</Animated.Text>
    </View>
  );
};

export default AngryToHappyAnimation;
