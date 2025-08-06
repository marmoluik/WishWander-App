import React from "react";
import { Image } from "react-native";

export default function HeaderLogo() {
  return (
    <Image
      source={require("@/assets/images/icon.png")}
      style={{ width: 32, height: 32 }}
      resizeMode="contain"
    />
  );
}
