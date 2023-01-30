/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableHighlight} from 'react-native';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import React from 'react';
import {
  setActiveConnection,
  setCurrentIPRejected,
  setIsConfigLoading,
} from '../store/reducers/vpnSlice';
import {nanoid} from '@reduxjs/toolkit';
import {IConnection} from '../types';
import CountryFlag from 'react-native-country-flag';
import {themeEnum} from '../types/themeEnum';
import {useNavigation} from '@react-navigation/native';

const ConnectionItem = ({item}: {item: IConnection}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const {configFileFolder, user, isConfigLoading} = useAppSelector(
    ({vpn}) => vpn,
  );

  return (
    <TouchableHighlight
      key={nanoid()}
      underlayColor={isConfigLoading ? 'transparent' : themeEnum.FOCUSED_COLOR}
      className="pl-4"
      onPress={() => {
        dispatch(setCurrentIPRejected(false));
        if (isConfigLoading) {
          return;
        } else {
          dispatch(setIsConfigLoading(true));
          RNFS.downloadFile({
            fromUrl: item.url,
            toFile: `${configFileFolder}/${item.objectName}`,
          })
            .promise.then(res => {
              if (res.statusCode === 200) {
                dispatch(setActiveConnection(item));
                const jsonValue = JSON.stringify({
                  ...user,
                  lastConnection: item,
                });
                AsyncStorage.setItem('User', jsonValue);
                //@ts-ignore
                navigation.navigate('Home');
                dispatch(setIsConfigLoading(false));
              } else {
                console.log('error with download');
                dispatch(setIsConfigLoading(false));
              }
            })
            .catch(err => console.log(err));
        }
      }}>
      <View>
        <View className="flex-row gap-x-3 h-14 items-center px-4">
          <View className="rounded-full  overflow-hidden h-6 w-6 flex justify-center items-center">
            <CountryFlag isoCode={item.country} size={25} />
          </View>
          <View className="flex-row gap-x-2-2 items-center h-full">
            <Text
              style={{
                color:
                  item.status === 'active'
                    ? themeEnum.FOCUSED_TEXT_COLOR
                    : themeEnum.FOCUSED_COLOR,
                fontWeight: '500',
              }}
              className="text-[16px]">
              {item.title}
            </Text>
            <Text
              style={{
                color:
                  item.status === 'active'
                    ? themeEnum.FOCUSED_TEXT_COLOR
                    : themeEnum.FOCUSED_COLOR,
                fontWeight: '500',
              }}
              className="text-[16px]">
              {'- ' + 'Free'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default ConnectionItem;
