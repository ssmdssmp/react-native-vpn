/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { View, Text, TouchableHighlight } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import { themeEnum } from "../types/themeEnum";
import CountryFlag from "react-native-country-flag";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setIsActiveSearch } from "../store/reducers/vpnSlice";
const SelectVpn = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { activeConnection } = useAppSelector(({ vpn }) => vpn);
  return (
    <TouchableHighlight
      style={{ backgroundColor: themeEnum.FOCUSED_COLOR }}
      className="w-9/12 bg-pink-300 h-12 flex justify-center rounded-md"
      onPress={() => {
        //@ts-ignore
        navigation.navigate("SelectVpn");
        dispatch(setIsActiveSearch(false));
      }}
      underlayColor="transparent"
    >
      <View className="flex-row px-5  justify-between items-center h-fit">
        <View className="flex-row w-fit items-center gap-5">
          <View className="rounded-full  overflow-hidden h-4 w-4 flex justify-center items-center">
            <CountryFlag
              isoCode={activeConnection.country ? activeConnection.country : ""}
              size={17}
            />
          </View>
          <View className="flex-row gap-x-2-2 items-center h-full">
            <Text
              style={{ color: themeEnum.FOCUSED_TEXT_COLOR, fontWeight: "500" }}
              className="text-[16px]"
            >
              {activeConnection.title ? activeConnection.title : ""}
            </Text>
            <Text
              style={{ color: themeEnum.FOCUSED_TEXT_COLOR, fontWeight: "500" }}
              className="text-[16px]"
            >
              {"- " + "Free"}
            </Text>
          </View>
        </View>

        <View className="rotate-180">
          <Ionicon
            name="triangle"
            size={8}
            color={themeEnum.FOCUSED_TEXT_COLOR}
          />
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default SelectVpn;
