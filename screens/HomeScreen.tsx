/* eslint-disable react-native/no-inline-styles */
import { View, Text } from "react-native";
import React from "react";
import { ConnectButton } from "../components/ConnectButton";
import { themeEnum } from "../types/themeEnum";
import SelectVpn from "../components/SelectVpn";
import CurrentIP from "../components/CurrentIP";
import ProtectionAlert from "../components/ProtectionAlert";
import { useAppSelector } from "../hooks/redux";
import Ionicon from "react-native-vector-icons/Ionicons";

const HomeScreen = () => {
  const { connectionState, currentIP } = useAppSelector(({ vpn }) => vpn);

  return (
    <View
      style={{ backgroundColor: themeEnum.BODY_BACKGROUD_COLOR }}
      className="w-full  h-full pt-3 pb-10 relative justify-between items-center"
    >
      <View className="flex-col items-center w-full">
        <SelectVpn />
        <CurrentIP />
        <ProtectionAlert />
        <Text
          className="text-center mt-2"
          style={{
            paddingTop: 5,
            color: currentIP.rejected
              ? themeEnum.RED_COLOR
              : currentIP.loading
              ? themeEnum.ORANGE_COLOR
              : themeEnum.RED_COLOR,
          }}
        >
          {currentIP.rejected
            ? "Ошибка подключения. Проверьте настройки сети или попробуйте другой сервер"
            : currentIP.loading
            ? " Проверка IP-адреса"
            : ""}
        </Text>
      </View>

      <Ionicon
        name="planet-outline"
        size={250}
        color={
          currentIP.rejected
            ? themeEnum.RED_COLOR
            : connectionState.state === 0
            ? themeEnum.FOCUSED_COLOR
            : connectionState.state === 1 || currentIP.loading === true
            ? themeEnum.ORANGE_COLOR
            : connectionState.state === 2
            ? themeEnum.SUCCESS_COLOR
            : themeEnum.FOCUSED_COLOR
        }
      />

      <View className="flex-col w-full items-center">
        <ConnectButton />
      </View>
    </View>
  );
};
export default HomeScreen;
