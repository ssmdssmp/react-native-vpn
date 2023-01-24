import React from 'react';
import {View, Text, TextInput, TouchableHighlight} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import firestore from '@react-native-firebase/firestore';
import {themeEnum} from '../types/themeEnum';
import RadioButton from '../components/RadioButton';
import {nanoid} from '@reduxjs/toolkit';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {setNegativeFeedbackReason} from '../store/reducers/vpnSlice';
import {ScrollView} from 'react-native-gesture-handler';

const NegativeFeedBackScreen = () => {
  const {negativeFeedBack} = useAppSelector(({vpn}) => vpn);
  const dispatch = useAppDispatch();
  return (
    <ScrollView className="h-screen">
      <View className=" w-full h-full bg-white">
        <Formik
          enableReinitialize={true}
          initialValues={{problemType: negativeFeedBack.reason, message: ''}}
          onSubmit={(values, actions) => {
            firestore()
              .collection('feedback')
              .add(values)
              .then(res => console.log(res))
              .catch(err => console.log(err));
            actions.resetForm();
          }}
          validationSchema={() =>
            yup.object({
              problemType: yup.string().required('Выберите один вариант'),
              message: yup.string(),
            })
          }>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View className=" flex-col mt-5  items-center w-full">
              <Text
                style={{color: themeEnum.FOCUSED_TEXT_COLOR}}
                className="text-center font-semibold">
                Пожалуйста, опишите, с какой проблемой вы столкнулись. Мы
                обязательно исправим её в ближайших релизах
              </Text>
              <View className="w-full pt-5   px-4 flex-col gap-y-2">
                {negativeFeedBack.reasons.map(item => (
                  <TouchableHighlight
                    className="rounded-md"
                    key={nanoid()}
                    onPress={() => {
                      dispatch(setNegativeFeedbackReason(item));
                    }}>
                    <View
                      style={{
                        backgroundColor: themeEnum.BODY_BACKGROUD_COLOR,
                      }}
                      className="h-12 rounded-md  flex-row items-center px-2 ">
                      <RadioButton
                        selected={
                          negativeFeedBack.reason === item ? true : false
                        }
                      />
                      <Text
                        className="ml-2"
                        style={{color: themeEnum.FOCUSED_TEXT_COLOR}}>
                        {item}
                      </Text>
                    </View>
                  </TouchableHighlight>
                ))}
                {errors.problemType && touched.problemType ? (
                  <Text className="text-red-500">{errors.problemType}</Text>
                ) : null}
                <View className="flex-col gap-y-2">
                  <Text style={{color: themeEnum.FOCUSED_TEXT_COLOR}}>
                    Детали, пожелания или проблемы:
                  </Text>
                  <TextInput
                    onChangeText={handleChange('message')}
                    value={values.message}
                    onBlur={handleBlur('name')}
                    style={{backgroundColor: themeEnum.BODY_BACKGROUD_COLOR}}
                    multiline={true}
                    textAlignVertical="top"
                    className="h-16 p-3 rounded-md"
                  />
                </View>
              </View>
              <TouchableHighlight
                onPress={handleSubmit}
                style={{backgroundColor: themeEnum.SUCCESS_COLOR}}
                className="w-11/12 px-4 rounded-md h-12 flex mt-5 justify-center items-center">
                <Text className="color-white text-lg ">Отправить</Text>
              </TouchableHighlight>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default NegativeFeedBackScreen;
