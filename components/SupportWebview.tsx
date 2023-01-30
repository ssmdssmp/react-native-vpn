import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import React, { useRef } from "react";
import { useAppSelector } from "../hooks/redux";
import { useNavigation } from "@react-navigation/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { themeEnum } from "../types/themeEnum";
const SupportWebview = () => {
  const navigation = useNavigation();
  const navigationState = navigation.getState();
  const { isNetworkReachable } = useAppSelector(({ vpn }) => vpn);
  const webViewRef = useRef();

  return (
    <SafeAreaView className="w-full h-full">
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
            uri: "https://vpn-2023-c2591.web.app/",
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
    </SafeAreaView>
  );
};

export default SupportWebview;
