import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import React from 'react';

const SupportWebview = () => {
  return (
    <View className="w-full h-full">
      <WebView
        source={{
          uri: 'https://vpn-2023-c2591.web.app/',
        }}
      />
    </View>
  );
};

export default SupportWebview;
