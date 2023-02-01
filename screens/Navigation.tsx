/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import firestore from "@react-native-firebase/firestore";
// import storage from "@react-native-firebase/storage";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import {
  setActiveConnection,
  setConfigFileFolder,
  setFreeVpnList,
  setIsActiveSearch,
  setIsNetworkReachable,
  setLocalUser,
} from "../store/reducers/vpnSlice";
import SupportWebview from "../components/SupportWebview";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { themeEnum } from "../types/themeEnum";
import { TouchableHighlight } from "react-native";
import SettingsScreen from "./SettingsScreen";
import AboutScreen from "./AboutScreen";
import SelectVpnScreen from "./SelectVpnScreen";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import NegativeFeedBackScreen from "./NegativeFeedBackScreen";
import { closeSupportPopup } from "../store/reducers/vpnSlice";
import { getCurrentIP } from "../hooks/http";
import onShare from "../components/Share";
import Ionicon from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import DrawerHeader from "../components/DrawerHeader";
import DrawerContent from "../components/DrawerContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IConnection, initUser, IUser } from "../types";
import PrivacyPolicyWebview from "../components/PrivacyPolicyWebview";
import UseConditionsWebview from "../components/UseConditionsWebview";
import RNFS from "react-native-fs";
import NetInfo from "@react-native-community/netinfo";

const Drawer = createDrawerNavigator();

export const Navigation = () => {
  const { configFileFolder } = useAppSelector(({ vpn }) => vpn);
  const configFileForlderRef = useRef(configFileFolder);
  configFileForlderRef.current = configFileFolder;
  const downloadActiveVpnConfig = (item: IConnection, folder: string) => {
    RNFS.downloadFile({
      fromUrl: `${item.url}`,
      toFile: `${folder}/${item.objectName}`,
    }).promise.catch((err) => console.log(err));
  };
  const dispatch = useAppDispatch();
  const setCurrentConfigFileFolder = async () => {
    await RNFS.getAllExternalFilesDirs()
      .then((res) => {
        dispatch(setConfigFileFolder(res[0]));
      })
      .catch((err) => err);
  };

  useEffect(() => {
    // storage()
    //   .ref("ovpn")
    //   .listAll()
    //   .then((res) =>
    //     res.items.map((item) =>
    //       item.getDownloadURL().then((res) => console.log(res))
    //     )
    //   );
    NetInfo.fetch()
      .then((res) => dispatch(setIsNetworkReachable(res.isConnected)))
      .catch((err) => console.log(err));
    dispatch(getCurrentIP());
    setCurrentConfigFileFolder();
    let arr: IConnection[] = [];
    AsyncStorage.getItem("User").then((res) => {
      if (res === null) {
        const jsonValue = JSON.stringify(initUser);
        AsyncStorage.setItem("User", jsonValue);
        dispatch(setLocalUser(initUser));
        firestore()
          .collection("ovpn")
          .get()
          .then((res2) => {
            res2.docs.map((item) => {
              const data = { ...item.data(), id: item.id };
              arr.push(data as IConnection);
            });
          })
          .then(() => {
            const newArr = arr;

            dispatch(setFreeVpnList(newArr));
            dispatch(setActiveConnection(newArr[0]));
            downloadActiveVpnConfig(newArr[0], configFileForlderRef.current);
          });
      } else {
        const value: IUser = JSON.parse(res);
        dispatch(setLocalUser(value));
        firestore()
          .collection("ovpn")
          .get()
          .then((res2) => {
            res2.docs.map((item) => {
              const data = { ...item.data(), id: item.id };
              arr.push(data as IConnection);
            });
          })
          .then(() => {
            const newArr = arr;
            dispatch(setFreeVpnList(newArr));
            if (
              value.settings.connectionType === "last" &&
              value.lastConnection.objectName !== ""
            ) {
              dispatch(setActiveConnection(value.lastConnection));
              downloadActiveVpnConfig(
                value.lastConnection,
                configFileForlderRef.current
              );
            } else {
              dispatch(setActiveConnection(newArr[0]));
              downloadActiveVpnConfig(newArr[0], configFileForlderRef.current);
            }
          })
          .catch((err) => console.log(err));
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerTitle: () => <DrawerHeader />,
          drawerContentContainerStyle: { paddingTop: 0 },
          drawerType: "front",
          headerStyle: { backgroundColor: themeEnum.BODY_BACKGROUD_COLOR },
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableHighlight
              underlayColor="none"
              className=" pr-3"
              onPress={() => {
                onShare();
              }}
            >
              <Ionicon
                name="share-social"
                size={25}
                color={themeEnum.SUCCESS_COLOR}
              />
            </TouchableHighlight>
          ),
          headerLeft: () => (
            <TouchableHighlight
              className="pl-3"
              underlayColor="transparent"
              onPress={() => {
                navigation.openDrawer();
                dispatch(closeSupportPopup());
              }}
            >
              <EvilIcons name="navicon" size={30} color="#5579A8" />
            </TouchableHighlight>
          ),
        })}
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />

        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerTitle: "Настройки",

            headerTitleStyle: {
              color: themeEnum.DARK_TEXT_COLOR,
              fontWeight: "700",
            },
          }}
        />
        <Drawer.Screen
          name="Support"
          options={{ unmountOnBlur: true }}
          component={SupportWebview}
        />
        <Drawer.Screen name="About" component={AboutScreen} />
        <Drawer.Screen
          name="SelectVpn"
          component={SelectVpnScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableHighlight
                className="pl-4"
                underlayColor="transparent"
                onPress={() => {
                  navigation.navigate("Home");
                  dispatch(setIsActiveSearch(false));
                }}
              >
                <Ionicon
                  name="chevron-back"
                  size={25}
                  color={themeEnum.FOCUSED_TEXT_COLOR}
                />
              </TouchableHighlight>
            ),
          })}
        />

        <Drawer.Screen
          name="NegativeFeedback"
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableHighlight
                onPress={() => {
                  navigation.goBack();
                }}
                underlayColor="none"
                className="flex justify-center items-center pl-4"
              >
                <Ionicon
                  name="chevron-back"
                  size={25}
                  color={themeEnum.FOCUSED_TEXT_COLOR}
                />
              </TouchableHighlight>
            ),
          })}
          component={NegativeFeedBackScreen}
        />
        <Drawer.Screen
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableHighlight
                className="ml-3"
                underlayColor="transparent"
                onPress={() => {
                  navigation.navigate("About");
                }}
              >
                <Ionicon
                  name="chevron-back"
                  size={25}
                  color={themeEnum.FOCUSED_TEXT_COLOR}
                />
              </TouchableHighlight>
            ),
          })}
          name="PrivacyPolicy"
          component={PrivacyPolicyWebview}
        />
        <Drawer.Screen
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableHighlight
                className="ml-3"
                underlayColor="transparent"
                onPress={() => {
                  navigation.navigate("About");
                }}
              >
                <Ionicon
                  name="chevron-back"
                  size={25}
                  color={themeEnum.FOCUSED_TEXT_COLOR}
                />
              </TouchableHighlight>
            ),
          })}
          name="UseConditions"
          component={UseConditionsWebview}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
