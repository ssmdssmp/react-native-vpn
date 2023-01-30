import React from "react";
import { View, Text } from "react-native";
import CountryFlag from "react-native-country-flag";
import { useAppSelector } from "../hooks/redux";
import { themeEnum } from "../types/themeEnum";

const CurrentIP = () => {
  const { currentIP, connectionState, activeConnection } = useAppSelector(
    ({ vpn }) => vpn
  );

  return (
    <View className="w-9/12 mt-3 flex-row items-end gap-x-2 justify-center">
      <Text style={{ color: themeEnum.FOCUSED_TEXT_COLOR }} className="text-xs">
        Ваш IP:
      </Text>

      <Text
        style={{ color: themeEnum.FOCUSED_TEXT_COLOR }}
        className="text-[16px] font-semibold"
      >
        {connectionState.state === 1 || currentIP.loading
          ? "Определяется..."
          : currentIP.data.query
          ? currentIP.data.query
          : "Невозможно определить IP"}
      </Text>
      <View className="rounded-full mb-1  overflow-hidden h-4 w-4 flex justify-center items-center">
        <CountryFlag
          isoCode={
            connectionState.state === 1 || currentIP.loading
              ? activeConnection.country
              : currentIP.data.countryCode
          }
          size={17}
        />
      </View>
    </View>
  );
};

export default CurrentIP;
