import {View, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import React from 'react';
import {useAppSelector} from '../hooks/redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {themeEnum} from '../types/themeEnum';
const SupportWebview = () => {
  const {isNetworkReachable} = useAppSelector(({vpn}) => vpn);
  return (
    <View className="w-full h-full">
      {isNetworkReachable ? (
        <WebView
          source={{
            uri: 'https://vpn-2023-c2591.web.app/',
          }}
        />
      ) : (
        <View className="w-full h-full gap-y-5 flex items-center justify-center">
          <MaterialIcon
            name="error-outline"
            color={themeEnum.DARK_TEXT_COLOR}
            size={45}
          />
          <Text className="text-xl" style={{color: themeEnum.DARK_TEXT_COLOR}}>
            Сеть недоступна
          </Text>
        </View>
      )}
    </View>
  );
};

export default SupportWebview;
