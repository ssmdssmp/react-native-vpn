import React from 'react';
import {View, Text, TextInput, TouchableHighlight} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import {closeSupportPopup} from '../store/reducers/vpnSlice';
import {themeEnum} from '../types/themeEnum';
import {useAppDispatch} from '../hooks/redux';
const SupportPopup = () => {
  const dispatch = useAppDispatch();
  return (
    <View className="absolute z-0 w-full h-screen ">
      <TouchableHighlight
        underlayColor="none"
        onPress={() => {
          dispatch(closeSupportPopup());
        }}
        className="absolute w-full h-full bg-slate-500 opacity-40">
        <View></View>
      </TouchableHighlight>
      <View className="bg-white   m-auto shadow-xl rounded-md w-10/12 pt-3 pb-10  px-8 top-12 flex-col gap-y-2 items-center">
        <Text style={{color: themeEnum.DARK_TEXT_COLOR}} className="text-lg">
          Отправьте нам сообщение
        </Text>
        <Formik
          initialValues={{name: '', email: '', message: ''}}
          onSubmit={(values, actions) => actions.resetForm()}
          validationSchema={yup.object({
            name: yup
              .string()
              .required('Это поле является обязательным')
              .min(2, 'Введите как минимум 2 символа'),
            email: yup
              .string()
              .email()
              .max(50, '50 characters max')
              .required('Это поле является обязательным'),
            message: yup
              .string()

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
            <View className="w-full flex-col gap-y-2">
              <View className="w-full flex-col gap-y-2">
                <Text
                  style={{color: themeEnum.FOCUSED_TEXT_COLOR}}
                  className="font-semibold">
                  Имя
                </Text>
                <TextInput
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  placeholder="Ваше имя"
                  style={{backgroundColor: themeEnum.BODY_BACKGROUD_COLOR}}
                  className="h-10 w-full px-2 rounded-md"
                />
                {errors.name && touched.name ? (
                  <Text className="text-red-500">{errors.name}</Text>
                ) : null}
              </View>
              <View className="w-full flex-col gap-y-2">
                <Text
                  style={{color: themeEnum.FOCUSED_TEXT_COLOR}}
                  className="font-semibold">
                  Электронный адрес
                </Text>
                <TextInput
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholder="Ваш адрес электронной почты"
                  style={{backgroundColor: themeEnum.BODY_BACKGROUD_COLOR}}
                  className="px-2 h-10 w-full rounded-md"
                />
                {errors.email && touched.email ? (
                  <Text className="text-red-500">{errors.email}</Text>
                ) : null}
              </View>
              <View className="w-full flex-col gap-y-2">
                <Text
                  style={{color: themeEnum.FOCUSED_TEXT_COLOR}}
                  className="font-semibold">
                  Как мы можем вам помочь?
                </Text>
                <TextInput
                  onChangeText={handleChange('message')}
                  onBlur={handleBlur('message')}
                  value={values.message}
                  multiline={true}
                  textAlignVertical="top"
                  textAlign="left"
                  style={{
                    backgroundColor: themeEnum.BODY_BACKGROUD_COLOR,
                  }}
                  className="h-32 w-full pl-2 rounded-md"
                />
                {errors.message && touched.message ? (
                  <Text className="text-red-500">{errors.message}</Text>
                ) : null}
              </View>
              <View className="pt-3 h-10">
                <TouchableHighlight
                  underlayColor={themeEnum.SUCCESS_COLOR}
                  style={{backgroundColor: themeEnum.SUCCESS_COLOR}}
                  onPress={handleSubmit}
                  className="h-12 w-full px-4 flex justify-center items-center rounded-md ">
                  <Text className="text-lg color-white">Отправить</Text>
                </TouchableHighlight>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default SupportPopup;
