import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableHighlight,
} from "react-native";
import { setIsActiveSearch } from "../store/reducers/vpnSlice";
import { themeEnum } from "../types/themeEnum";
import { nanoid } from "@reduxjs/toolkit";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import ConnectionItem from "../components/ConnectionItem";
const SelectVpnScreen = () => {
  const dispatch = useAppDispatch();
  const { freeVpnList, isNetworkReachable, isActiveSearch } = useAppSelector(
    ({ vpn }) => vpn
  );
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    !isActiveSearch ? setSearchValue("") : null;
  }, [isActiveSearch]);

  return (
    <View className="w-full h-full justify-center flex-col items-center bg-white">
      <ScrollView className="w-full flex-col gap-y-4">
        <View className="mt-2 pl-6 w-full flex-row gap-2 items-center justify-between">
          {isActiveSearch ? (
            <TextInput
              onChangeText={(e) => setSearchValue(e)}
              value={searchValue}
              className="w-10/12 h-10 text-[#677BA0]  border-b-[1px] border-[#677BA0]"
            />
          ) : (
            <View className="flex flex-row h-10 items-center gap-x-2">
              <MaterialIcon
                name="signal-cellular-alt"
                color={themeEnum.SUCCESS_COLOR}
                size={20}
              />
              <Text style={{ color: themeEnum.FOCUSED_TEXT_COLOR }}>
                Серверы
              </Text>
            </View>
          )}
          <View>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                if (isActiveSearch) {
                  setSearchValue("");
                }
                dispatch(setIsActiveSearch(!isActiveSearch));
              }}
            >
              {isActiveSearch ? (
                <MaterialIcon
                  name="cancel"
                  color={themeEnum.FOCUSED_TEXT_COLOR}
                  size={24}
                />
              ) : (
                <EvilIcon
                  name="search"
                  size={30}
                  color={themeEnum.FOCUSED_TEXT_COLOR}
                />
              )}
            </TouchableHighlight>
          </View>
        </View>
        <View className="flex-col gap-y-2 justify-start">
          <Text
            style={{ color: themeEnum.FOCUSED_TEXT_COLOR }}
            className="uppercase pl-8"
          >
            Бесплатные сервера
          </Text>
          {isNetworkReachable ? (
            <View className="flex-col ">
              {freeVpnList
                .filter(
                  (value, index, self) =>
                    index === self.findIndex((t) => t.title === value.title)
                )
                .sort((a) => {
                  if (a.status === "active") {
                    return -1;
                  } else {
                    return 1;
                  }
                })
                .filter((el) => el.title.length !== 0)
                .filter((el) =>
                  el.title.toLowerCase().includes(searchValue.toLowerCase())
                )

                .map((item) => {
                  return <ConnectionItem key={nanoid()} item={item} />;
                })}
            </View>
          ) : (
            <View className=" gap-y-5 flex items-center justify-center">
              <MaterialIcon
                name="error-outline"
                color={themeEnum.DARK_TEXT_COLOR}
                size={25}
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
      </ScrollView>
    </View>
  );
};

export default SelectVpnScreen;
