import { View, Text, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import React from "react";
import { useAppSelector } from "../hooks/redux";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { themeEnum } from "../types/themeEnum";
const PrivacyPolicyWebview = () => {
  const { isNetworkReachable } = useAppSelector(({ vpn }) => vpn);
  return (
    <View className="h-full w-full ">
      {isNetworkReachable ? (
        <WebView
          bounces={false}
          startInLoadingState={true}
          renderLoading={() => (
            <View className="w-full h-full bg-white flex justify-center items-center">
              <ActivityIndicator size={40} color={themeEnum.DARK_TEXT_COLOR} />
            </View>
          )}
          source={{
            uri: "https://doc-hosting.flycricket.io/vpn3001-privacy-policy/201833af-322d-4fc2-91bb-2f2a4da8e6f4/privacy",
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

export default PrivacyPolicyWebview;
