/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {Switch} from 'react-native-gesture-handler';
import {themeEnum} from '../types/themeEnum';
import RadioButton from '../components/RadioButton';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {
  toggleAutoconnection,
  toggleKillswitch,
  setConnectionType,
} from '../store/reducers/vpnSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SettingsScreen = () => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(({vpn}) => vpn);
  return (
    <View
      className="w-full h-full "
      style={{backgroundColor: themeEnum.BODY_BACKGROUD_COLOR}}>
      <View className="w-full flex-col items-center ">
        <View
          style={{borderColor: themeEnum.FOCUSED_COLOR}}
          className="h-24 px-4 py-2 border-b border-t w-full flex-col justify-between">
          <View className="flex-row w-full  items-center  justify-between">
            <Text
              style={{color: themeEnum.DARK_TEXT_COLOR}}
              className="text-lg font-semibold">
              Killswitch
            </Text>
            <Switch
              trackColor={{
                true: themeEnum.SUCCESS_COLOR,
                false: themeEnum.DARK_TEXT_COLOR,
              }}
              //@ts-ignore
              onValueChange={() => {
                dispatch(toggleKillswitch());
                const jsonValue = JSON.stringify({
                  ...user,
                  settings: {
                    ...user.settings,
                    killswitch: !user.settings.killswitch,
                  },
                });

                AsyncStorage.setItem('User', jsonValue);
              }}
              value={user.settings.killswitch}
              style={{
                backgroundColor: 'transparent',
                borderRadius: 16,
              }}
            />
          </View>
          <Text style={{color: 'grey'}} className="text-xs w-full">
            Приложение автоматически разрывает подключение при недоступности VPN
          </Text>
        </View>
        <View
          style={{borderColor: themeEnum.FOCUSED_COLOR}}
          className="h-24 px-4 py-2 border-b  w-full flex-col justify-between">
          <View className="flex-row w-full  items-center  justify-between">
            <Text
              style={{color: themeEnum.DARK_TEXT_COLOR}}
              className="text-lg font-semibold">
              Автоподключение
            </Text>
            <Switch
              trackColor={{
                true: themeEnum.SUCCESS_COLOR,
                false: themeEnum.DARK_TEXT_COLOR,
              }}
              // @ts-ignore
              onValueChange={() => {
                dispatch(toggleAutoconnection());

                const jsonValue = JSON.stringify({
                  ...user,
                  settings: {
                    ...user.settings,
                    autoconnection: !user.settings.autoconnection,
                  },
                });

                AsyncStorage.setItem('User', jsonValue);
              }}
              value={user.settings.autoconnection}
              style={{
                backgroundColor: 'transparent',
                borderRadius: 16,
              }}
            />
          </View>
          <Text style={{color: 'grey'}} className="text-xs w-full">
            Автоматически подключаться к последнему использованному серверу
          </Text>
        </View>

        <TouchableHighlight
          underlayColor="none"
          onPress={() => {
            dispatch(setConnectionType('last'));
            const jsonValue = JSON.stringify({
              ...user,
              settings: {
                ...user.settings,
                connectionType: 'last',
              },
            });

            AsyncStorage.setItem('User', jsonValue);
          }}
          style={{borderColor: themeEnum.FOCUSED_COLOR}}
          className="h-12 px-4  border-b  w-full flex-col justify-center items-center ">
          <View className="flex-row w-full  items-center  justify-between">
            <Text
              style={{color: themeEnum.DARK_TEXT_COLOR}}
              className="text-lg font-semibold">
              Последний выбранный
            </Text>
            <RadioButton
              selected={user.settings.connectionType === 'last' ? true : false}
            />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor="none"
          onPress={() => {
            dispatch(setConnectionType('recommended'));
            const jsonValue = JSON.stringify({
              ...user,
              settings: {
                ...user.settings,
                connectionType: 'recommended',
              },
            });

            AsyncStorage.setItem('User', jsonValue);
          }}
          style={{borderColor: themeEnum.FOCUSED_COLOR}}
          className="h-12 px-4  border-b  w-full flex-col justify-center items-center ">
          <View className="flex-row w-full  items-center  justify-between">
            <Text
              style={{color: themeEnum.DARK_TEXT_COLOR}}
              className="text-lg font-semibold">
              Рекомендованный
            </Text>
            <RadioButton
              selected={
                user.settings.connectionType === 'recommended' ? true : false
              }
            />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default SettingsScreen;
