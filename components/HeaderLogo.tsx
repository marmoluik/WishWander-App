import React from "react";
import { Image } from "react-native";

export default function HeaderLogo() {
  return (
    <Image
      source={require("@/assets/images/wishwander_logo.png")}
      style={{ width: 200, height: 50, alignSelf: "flex-start" }}
      resizeMode="contain"
    />
  );
}
