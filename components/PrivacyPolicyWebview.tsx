import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import React from 'react';

const PrivacyPolicyWebview = () => {
  return (
    <View className="h-full w-full ">
      <WebView source={{uri: 'https://reactnative.dev/'}} />
    </View>
  );
};

export default PrivacyPolicyWebview;
