import React from 'react';
import {View, Text} from 'react-native';
import {themeEnum} from '../types/themeEnum';
import Ionicon from 'react-native-vector-icons/Ionicons';
import PrivacyLinks from '../components/PrivacyLinks';

const AboutScreen = () => {
  return (
    <View
      style={{backgroundColor: themeEnum.BODY_BACKGROUD_COLOR}}
      className="w-full h-screen pt-10">
      <View className="w-full gap-y-5 flex-col items-center h-fit">
        <View className="flex-col gap-y-2 items-center mt-8">
          <Ionicon
            name="planet-outline"
            size={80}
            color={themeEnum.FOCUSED_COLOR}
          />
          <Text
            style={{color: themeEnum.FOCUSED_TEXT_COLOR}}
            className="text-lg">
            Версия: {'3.2.1_243'}
          </Text>
        </View>
        <View className="w-full ">
          <PrivacyLinks />
        </View>
      </View>
    </View>
  );
};

export default AboutScreen;
