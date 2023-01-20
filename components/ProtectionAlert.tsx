import React from 'react';
import {View, Text} from 'react-native';
import {useAppSelector} from '../hooks/redux';
import {themeEnum} from '../types/themeEnum';

const ProtectionAlert = () => {
  const {connectionState} = useAppSelector(({vpn}) => vpn);
  if (connectionState.state === 2) {
    return (
      <View
        style={{backgroundColor: themeEnum.SUCCESS_COLOR}}
        className="mt-2 w-fit flex h-fit rounded-lg p-1">
        <Text className="text-white text-xs">Защищено</Text>
      </View>
    );
  } else {
    return (
      <View className="mt-2 w-fit flex h-fit bg-red-500 rounded-lg p-1">
        <Text className="text-white text-xs">не защищено</Text>
      </View>
    );
  }
};

export default ProtectionAlert;
