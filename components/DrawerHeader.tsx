import React from 'react';
import {View, Text} from 'react-native';
const DrawerHeader = () => {
  return (
    <View className="flex-row gap-1">
      <Text className="text-[3vh] uppercase font-bold text-[#5579A8]">VPN</Text>
      <Text className="text-[3vh] uppercase font-bold text-[#8DAC49]">
        3001
      </Text>
    </View>
  );
};
export default DrawerHeader;
