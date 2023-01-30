import { View, Text } from "react-native";
import { WebView } from "react-native-webview";
import React from "react";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useAppSelector } from "../hooks/redux";
import { themeEnum } from "../types/themeEnum";
import { useNavigation } from "@react-navigation/native";
const UseConditionsWebview = () => {
  const navigation = useNavigation();
  const navigationState = navigation.getState();
  console.log(navigationState.index);
  const { isNetworkReachable } = useAppSelector(({ vpn }) => vpn);
  return (
    <View className="w-full h-full">
      {isNetworkReachable && navigationState.index === 7 ? (
        <WebView
          source={{
            uri: "https://doc-hosting.flycricket.io/vpn3001-terms-of-use/b02f844e-a7ae-4628-ae00-55c9304484a4/terms",
          }}
        />
      ) : (
        <View className="w-full h-full gap-y-5 flex items-center justify-center">
          <MaterialIcon
            name="error-outline"
            color={themeEnum.DARK_TEXT_COLOR}
            size={45}
          />
          <Text
            className="text-xl"
            style={{ color: themeEnum.DARK_TEXT_COLOR }}
          >
            Сеть недоступна
          </Text>
        </View>
      )}
    </View>
  );
};

export default UseConditionsWebview;
