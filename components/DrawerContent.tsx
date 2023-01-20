/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableHighlight} from 'react-native';
import React from 'react';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {themeEnum} from '../types/themeEnum';
import {DrawerItem} from '@react-navigation/drawer';
import {useAppDispatch} from '../hooks/redux';
import {useAppSelector} from '../hooks/redux';
import {NavigationIcon} from '../utils/NavigationIcon';
import {
  closeSupportPopup,
  openSupportPopup,
  leaveAccount,
} from '../store/reducers/vpnSlice';
import openRateAlert from './RateAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import onShare from './Share';
const DrawerContent = (props: DrawerContentComponentProps) => {
  const {user} = useAppSelector(({vpn}) => vpn);
  const dispatch = useAppDispatch();
  const drawerItemStyle = {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 0,
    height: 55,

    display: 'flex',
    justifyContent: 'center',

    marginLeft: 0,
    paddingTop: 0,
  };
  return (
    <View
      style={{backgroundColor: themeEnum.BODY_BACKGROUD_COLOR}}
      className="h-full bg-black flex-col justify-between py-3">
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
              : {...drawerItemStyle}
          }
          labelStyle={{
            fontSize: 18,
            fontWeight: '700',
          }}
          icon={() => <NavigationIcon name="home-outline" />}
          onPress={() => {
            props.navigation.navigate('Home');
            dispatch(closeSupportPopup());
          }}
        />
        <DrawerItem
          label="Настройки"
          labelStyle={{
            fontSize: 18,
            fontWeight: '700',
          }} //@ts-ignore
          style={
            props.state.index === 1
              ? {
                  ...drawerItemStyle,
                  backgroundColor: themeEnum.FOCUSED_COLOR,
                  paddingTop: 0,
                }
              : {...drawerItemStyle}
          }
          icon={() => <NavigationIcon name="settings-outline" />}
          onPress={() => {
            props.navigation.navigate('Settings');
            dispatch(closeSupportPopup());
          }}
        />
        <DrawerItem
          label="Помощь"
          labelStyle={{
            fontSize: 18,
            fontWeight: '700',
          }} //@ts-ignore
          style={drawerItemStyle}
          icon={() => <NavigationIcon name="chatbox-ellipses-outline" />}
          onPress={() => {
            props.navigation.closeDrawer();
            dispatch(openSupportPopup());
          }}
        />
        <DrawerItem
          label="Поделиться"
          labelStyle={{
            fontSize: 18,
            fontWeight: '700',
          }} //@ts-ignore
          style={drawerItemStyle}
          icon={() => <NavigationIcon name="gift-outline" />}
          onPress={() => {
            onShare();
            dispatch(closeSupportPopup());
          }}
        />
        <DrawerItem
          label="Оценить приложение"
          labelStyle={{
            fontSize: 17,
            fontWeight: '700',
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
            fontWeight: '700',
          }} //@ts-ignore
          style={
            props.state.index === 2
              ? {
                  ...drawerItemStyle,
                  backgroundColor: themeEnum.FOCUSED_COLOR,
                }
              : {...drawerItemStyle}
          }
          icon={() => <NavigationIcon name="information-circle-outline" />}
          onPress={() => {
            props.navigation.navigate('About');
            dispatch(closeSupportPopup());
          }}
        />
      </View>

      {user.email.length !== 0 && user.email !== undefined ? (
        <View className="flex-col w-full gap-y-2 items-center justify-between">
          <View className="flex-col gap-y-1 items-center w-full">
            <Text
              style={{color: themeEnum.FOCUSED_TEXT_COLOR}}
              className="text-lg font-semibold">
              {user.email}
            </Text>
            <TouchableHighlight
              underlayColor={themeEnum.SUCCESS_COLOR}
              onPress={() => {
                dispatch(leaveAccount());
                AsyncStorage.clear();
              }}
              style={{backgroundColor: themeEnum.SUCCESS_COLOR}}
              className="h-14 w-11/12 flex justify-center items-center rounded-md">
              <Text className="text-lg text-white">Выход</Text>
            </TouchableHighlight>
          </View>
        </View>
      ) : (
        <View className="flex-col items-center gap-3 px-3">
          <Text className="w-full tracking-tighter leading-5  px-8 text-center text-lg text-slate-400">
            Быстрые сервера, превосходная защита, лучшие локации
          </Text>
          <TouchableHighlight
            onPress={() => props.navigation.navigate('Login')}
            className="flex  justify-center h-12 w-full">
            <View
              style={{backgroundColor: themeEnum.SUCCESS_COLOR}}
              className=" flex   rounded-md justify-center items-center h-full">
              <Text className="text-white text-[3vh]">Авторизация</Text>
            </View>
          </TouchableHighlight>
        </View>
      )}
    </View>
  );
};

export default DrawerContent;
