import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import React from 'react';

const PrivacyPolicyWebview = () => {
  return (
    <View className="h-full w-full ">
      <WebView
        source={{
          uri: 'https://doc-hosting.flycricket.io/vpn3001-privacy-policy/201833af-322d-4fc2-91bb-2f2a4da8e6f4/privacy',
        }}
      />
    </View>
  );
};

export default PrivacyPolicyWebview;
