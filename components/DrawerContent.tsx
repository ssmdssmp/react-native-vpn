/* eslint-disable react-native/no-inline-styles */
import { View } from "react-native";
import React, { useState } from "react";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { themeEnum } from "../types/themeEnum";
import { DrawerItem } from "@react-navigation/drawer";
import { useAppDispatch } from "../hooks/redux";
import { NavigationIcon } from "../utils/NavigationIcon";
import {
  closeSupportPopup,
  openSupportPopup,
} from "../store/reducers/vpnSlice";
import openRateAlert from "./RateAlert";
import onShare from "./Share";
const DrawerContent = (props: DrawerContentComponentProps) => {
  const dispatch = useAppDispatch();
  const drawerItemStyle = {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 0,
    height: 55,

    display: "flex",
    justifyContent: "center",

    marginLeft: 0,
    paddingTop: 0,
  };
  return (
    <View
      style={{ backgroundColor: themeEnum.BODY_BACKGROUD_COLOR }}
      className="h-full bg-black flex-col justify-between py-3"
    >
      <View className="flex-col justify-start gap-0">
        <DrawerItem
          label="Главная"
          //@ts-ignore
          style={
            props.state.index === 0
              ? {
                ...drawerItemStyle,
                backgroundColor: themeEnum.FOCUSED_COLOR,
              }
              : { ...drawerItemStyle }
          }
          labelStyle={{
            fontSize: 18,
            fontWeight: "700",
          }}
          icon={() => <NavigationIcon name="home-outline" />}
          onPress={() => {
            props.navigation.navigate("Home");
            dispatch(closeSupportPopup());
          }}
        />
        <DrawerItem
          label="Настройки"
          labelStyle={{
            fontSize: 18,
            fontWeight: "700",
          }} //@ts-ignore
          style={
            props.state.index === 1
              ? {
                ...drawerItemStyle,
                backgroundColor: themeEnum.FOCUSED_COLOR,
                paddingTop: 0,
              }
              : { ...drawerItemStyle }
          }
          icon={() => <NavigationIcon name="settings-outline" />}
          onPress={() => {
            props.navigation.navigate("Settings");
            dispatch(closeSupportPopup());
          }}
        />
        <DrawerItem
          label="Помощь"
          labelStyle={{
            fontSize: 18,
            fontWeight: "700",
          }} //@ts-ignore
          style={
            props.state.index === 2
              ? {
                ...drawerItemStyle,
                backgroundColor: themeEnum.FOCUSED_COLOR,
              }
              : { ...drawerItemStyle }
          }
          icon={() => <NavigationIcon name="chatbox-ellipses-outline" />}
          onPress={() => {
            console.log(props.state.key);
            props.navigation.navigate("Support");
          }}
        />
        <DrawerItem
          label="Поделиться"
          labelStyle={{
            fontSize: 18,
            fontWeight: "700",
          }} //@ts-ignore
          style={drawerItemStyle}
          icon={() => <NavigationIcon name="gift-outline" />}
          onPress={() => {

            onShare();
            dispatch(closeSupportPopup());

          }
          }
        />
        <DrawerItem
          label="Оценить приложение"
          labelStyle={{
            fontSize: 17,
            fontWeight: "700",
          }} //@ts-ignore
          style={drawerItemStyle}
          icon={() => <NavigationIcon name="thumbs-up-outline" />}
          onPress={() => {
            openRateAlert(props.navigation);
            dispatch(closeSupportPopup());
          }}
        />
        <DrawerItem
          label="О приложении"
          labelStyle={{
            fontSize: 18,
            fontWeight: "700",
          }} //@ts-ignore
          style={
            props.state.index === 3
              ? {
                ...drawerItemStyle,
                backgroundColor: themeEnum.FOCUSED_COLOR,
              }
              : { ...drawerItemStyle }
          }
          icon={() => <NavigationIcon name="information-circle-outline" />}
          onPress={() => {
            props.navigation.navigate("About");
            dispatch(closeSupportPopup());
          }}
        />
      </View>
    </View>
  );
};

export default DrawerContent;
