import {View, Text, TouchableHighlight} from 'react-native';
import React from 'react';
import {themeEnum} from '../types/themeEnum';
import {useNavigation} from '@react-navigation/native';
const PrivacyLinks = () => {
  const navigation = useNavigation();
  return (
    <View className="w-full flex-col items-center gap-y-6">
      <TouchableHighlight
        underlayColor="none"
        //@ts-ignore
        onPress={() => navigation.navigate('PrivacyPolicy')}
        style={{
          borderColor: themeEnum.SUCCESS_COLOR,
        }}
        className="w-11/12 h-12 rounded-md flex justify-center items-center border">
        <Text
          className="text-lg font-semibold"
          style={{color: themeEnum.SUCCESS_COLOR}}>
          Политика конфиденциальности
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor="none"
        //@ts-ignore
        onPress={() => navigation.navigate('UseConditions')}
        style={{
          borderColor: themeEnum.SUCCESS_COLOR,
        }}
        className="w-11/12 h-12 rounded-md flex justify-center items-center border">
        <Text
          className="text-lg font-semibold"
          style={{color: themeEnum.SUCCESS_COLOR}}>
          Условия использования
        </Text>
      </TouchableHighlight>
    </View>
  );
};

export default PrivacyLinks;
