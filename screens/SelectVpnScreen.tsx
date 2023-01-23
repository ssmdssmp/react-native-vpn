import React from 'react';
import {View, Text, ScrollView} from 'react-native';

import {themeEnum} from '../types/themeEnum';
import {nanoid} from '@reduxjs/toolkit';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {useAppSelector} from '../hooks/redux';
import ConnectionItem from '../components/ConnectionItem';
const SelectVpnScreen = () => {
  const {freeVpnList} = useAppSelector(({vpn}) => vpn);

  return (
    <View className="w-full h-full justify-center flex-col items-center bg-white">
      <ScrollView className="w-full flex-col gap-y-4">
        <View className="pl-8 w-full flex-row gap-2 items-end">
          <MaterialIcon
            name="signal-cellular-alt"
            color={themeEnum.SUCCESS_COLOR}
            size={20}
          />
          <Text style={{color: themeEnum.FOCUSED_TEXT_COLOR}}>Серверы</Text>
        </View>
        <View className="flex-col gap-y-2 justify-start">
          <Text
            style={{color: themeEnum.FOCUSED_TEXT_COLOR}}
            className="uppercase pl-2">
            Бесплатные сервера
          </Text>
          <View className="flex-col ">
            {freeVpnList
              .filter(
                (value, index, self) =>
                  index === self.findIndex(t => t.title === value.title),
              )
              .sort(a => {
                if (a.status === 'active') {
                  return 1;
                } else {
                  return -1;
                }
              })
              .sort((f, s) => f.connectionTime - s.connectionTime)
              .map(item => {
                return <ConnectionItem key={nanoid()} item={item} />;
              })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SelectVpnScreen;
