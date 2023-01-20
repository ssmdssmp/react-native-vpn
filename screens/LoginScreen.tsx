import React from 'react';
import {View, Text, TextInput, TouchableHighlight} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {themeEnum} from '../types/themeEnum';
import {createNewUser} from '../store/reducers/vpnSlice';
import {useAppDispatch, useAppSelector} from '../hooks/redux';

import * as yup from 'yup';
import {useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Formik} from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginScreen = () => {
  const {user} = useAppSelector(({vpn}) => vpn);
  const refNewUserPopup = useRef();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  return (
    <View className="w-full h-screen py-10 flex-col gap-y-5 items-center">
      <View className="w-full flex-row justify-end pr-4">
        <TouchableHighlight
          underlayColor="transparent"
          //@ts-ignore
          onPress={() => navigation.navigate('Home')}>
          <Ionicon name="close" size={25} />
        </TouchableHighlight>
      </View>
      <Ionicon
        name="planet-outline"
        size={150}
        color={themeEnum.FOCUSED_COLOR}
      />
      <Text
        style={{color: themeEnum.FOCUSED_TEXT_COLOR}}
        className="text-2xl font-semibold">
        Войти
      </Text>
      <Formik
        initialValues={{name: '', email: '', message: ''}}
        onSubmit={values => {
          const jsonValue = JSON.stringify({...user, email: values.email});
          console.log(jsonValue);
          AsyncStorage.setItem('User', jsonValue);
          //@ts-ignore
          refNewUserPopup.current.open();
          dispatch(createNewUser(values.email));
        }}
        validationSchema={yup.object({
          email: yup
            .string()
            .email('Введите корректный email адрес')
            .required('Это поле является обязательным'),
        })}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              textAlignVertical="center"
              style={{
                borderColor: themeEnum.FOCUSED_COLOR,
                color: themeEnum.FOCUSED_TEXT_COLOR,
              }}
              className="border   px-2 h-14  w-11/12 rounded-md"
              placeholder="Ваш email"
            />
            {errors.email && touched.email ? (
              <View className="w-full px-4">
                <Text className="text-red-500">{errors.email}</Text>
              </View>
            ) : null}
            <TouchableHighlight
              underlayColor={themeEnum.SUCCESS_COLOR}
              style={{backgroundColor: themeEnum.SUCCESS_COLOR}}
              onPress={() => {
                handleSubmit();
              }}
              className="w-11/12 rounded-md mt-5 h-14 justify-center items-center ">
              <Text className="text-white font-semibold">Войти</Text>
            </TouchableHighlight>
          </>
        )}
      </Formik>
      <View
        style={{backgroundColor: themeEnum.FOCUSED_COLOR}}
        className="w-11/12 h-fit px-2 py-4 rounded-md">
        <Text
          style={{color: themeEnum.FOCUSED_TEXT_COLOR}}
          className="text-[16px] text-center ">
          Если вы не зарегистрированы на Planet VPN, введите свой email и мы
          откроем вам аккаунт
        </Text>
      </View>
      <RBSheet
        //@ts-ignore
        ref={refNewUserPopup}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={600}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
          container: {
            borderRadius: 12,
            paddingTop: 0,
            margin: 0,

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            backgroundColor: themeEnum.BODY_BACKGROUD_COLOR,
          },
          draggableIcon: {
            backgroundColor: 'transparent',
          },
        }}>
        <View className="flex-col items-center h-full w-full gap-y-2 pt-20 px-5">
          <Text
            style={{color: themeEnum.FOCUSED_TEXT_COLOR}}
            className="text-center text-xl ">
            Вы авторизованы как
          </Text>
          <Text
            style={{color: themeEnum.DARK_TEXT_COLOR}}
            className="text-center text-xl font-semibold ">
            {user.email}
          </Text>
          <Text
            style={{color: themeEnum.FOCUSED_TEXT_COLOR}}
            className="text-center text-xl ">
            пароль для учетной записи отправлен вам на email{' '}
          </Text>
          <View className="w-full flex-row justify-center pt-10">
            <TouchableHighlight
              underlayColor={themeEnum.SUCCESS_COLOR}
              onPress={() => {
                //@ts-ignore
                navigation.navigate('Home');
                //@ts-ignore
                refNewUserPopup.current.close();
              }}
              style={{backgroundColor: themeEnum.SUCCESS_COLOR}}
              className="w-11/12  h-14 flex justify-center items-center rounded-md ">
              <Text className="text-white">Перейти к VPN</Text>
            </TouchableHighlight>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

export default LoginScreen;
