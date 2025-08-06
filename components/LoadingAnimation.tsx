import React, { useEffect, useRef } from "react";
import { Animated, Easing, ImageSourcePropType } from "react-native";

const LoadingAnimation = ({
  source = require("@/assets/images/icon.png"),
}: {
  source?: ImageSourcePropType;
}) => {
  const translate = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translate, {
          toValue: 100,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [translate]);

  return (
    <Animated.Image
      source={source}
      style={{ width: 120, height: 120, transform: [{ translateX: translate }] }}
      resizeMode="contain"
    />
  );
};

export default LoadingAnimation;
