import React, {useRef, useState} from 'react';
import {View, Text, TextInput, TouchableHighlight} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import firestore from '@react-native-firebase/firestore';
import {themeEnum} from '../types/themeEnum';
import RadioButton from '../components/RadioButton';
import {nanoid} from '@reduxjs/toolkit';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {setNegativeFeedbackReason} from '../store/reducers/vpnSlice';
import {ScrollView} from 'react-native-gesture-handler';

const NegativeFeedBackScreen = () => {
  const {negativeFeedBack, isNetworkReachable} = useAppSelector(({vpn}) => vpn);
  const [feedbackStatus, setFeedbackStatus] = useState('idle');
  const isNetworkReachableRef = useRef(isNetworkReachable);
  isNetworkReachableRef.current = isNetworkReachable;
  const dispatch = useAppDispatch();
  return (
    <ScrollView className="h-screen">
      <View className=" w-full h-full bg-white">
        {feedbackStatus === 'idle' ? (
          <Formik
            enableReinitialize={true}
            initialValues={{problemType: negativeFeedBack.reason, message: ''}}
            onSubmit={(values, actions) => {
              if (isNetworkReachableRef.current) {
                firestore()
                  .collection('feedback')
                  .add(values)
                  .then(res => {
                    console.log(res);
                    setFeedbackStatus('sent');
                    setTimeout(() => {
                      setFeedbackStatus('idle');
                    }, 5000);
                    actions.resetForm();
                  })
                  .catch(() => {
                    setFeedbackStatus('error');
                    setTimeout(() => {
                      setFeedbackStatus('idle');
                    }, 5000);
                  });
              } else {
                setFeedbackStatus('error');
                setTimeout(() => {
                  setFeedbackStatus('idle');
                }, 5000);
              }
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
                      style={{
                        backgroundColor: themeEnum.BODY_BACKGROUD_COLOR,
                        color: themeEnum.DARK_TEXT_COLOR,
                      }}
                      multiline={true}
                      textAlignVertical="top"
                      className="h-16 p-3 rounded-md font-bold"
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
        ) : feedbackStatus === 'error' ? (
          <View className="w-full h-screen gap-4 pb-16 flex justify-center items-center">
            <MaterialIcon name="error-outline" color="red" size={40} />
            <Text className="text-center" style={{color: 'red'}}>
              Ошибка отправки формы. Попробуйте еще раз через несколько секунд
            </Text>
          </View>
        ) : (
          <View className="w-full h-screen gap-4 pb-16 flex justify-center items-center">
            <MaterialIcon
              name="done-outline"
              color={themeEnum.SUCCESS_COLOR}
              size={40}
            />
            <Text
              className="text-center"
              style={{color: themeEnum.SUCCESS_COLOR}}>
              Спасибо! Мы рассмотрим вашу проблему и попробуем исправить её в
              ближайших релизах
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default NegativeFeedBackScreen;
