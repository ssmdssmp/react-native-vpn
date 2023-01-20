import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import React from 'react';

const UseConditionsWebview = () => {
  return (
    <View className="w-full h-full">
      <WebView
        source={{
          uri: 'https://medium.com/programming-essentials/how-to-access-the-state-in-settimeout-inside-a-react-function-component-39a9f031c76f',
        }}
      />
    </View>
  );
};

export default UseConditionsWebview;
