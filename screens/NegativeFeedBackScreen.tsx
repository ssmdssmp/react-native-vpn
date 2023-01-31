import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableHighlight } from "react-native";
import { Formik, FormikProps } from "formik";
import * as yup from "yup";
import firestore from "@react-native-firebase/firestore";
import { themeEnum } from "../types/themeEnum";
import RadioButton from "../components/RadioButton";
import { nanoid } from "@reduxjs/toolkit";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useAppSelector } from "../hooks/redux";
import { ScrollView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
import { FormValues } from "../types";

const NegativeFeedBackScreen = () => {
  const { negativeFeedBack, isNetworkReachable } = useAppSelector(
    ({ vpn }) => vpn
  );

  const [feedbackStatus, setFeedbackStatus] = useState("idle");
  const isNetworkReachableRef = useRef(isNetworkReachable);
  isNetworkReachableRef.current = isNetworkReachable;
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const isFocused = useIsFocused();
  const [reason, setReason] = useState<string>(
    () => negativeFeedBack.reasons[0]
  );
  const [message, setMessage] = useState<string>("");

  const resetFormValues = () => {
    setReason(negativeFeedBack.reasons[0]);
    setMessage("");
  };

  useEffect(() => {
    if (!isFocused) {
      resetFormValues();
      formikRef.current?.setValues({
        problemType: reason,
        message: "",
      });
    }
  }, [isFocused]);

  return (
    <ScrollView className="h-screen">
      {isNetworkReachable ? (
        <View className=" w-full h-full bg-white">
          {feedbackStatus === "idle" ? (
            <Formik
              enableReinitialize
              innerRef={formikRef}
              initialValues={{
                problemType: "",
                message: "",
              }}
              onSubmit={(values) => {
                if (isNetworkReachableRef.current) {
                  firestore()
                    .collection("feedback")
                    .add(values)
                    .then((res) => {
                      setFeedbackStatus("sent");
                      setTimeout(() => {
                        setFeedbackStatus("idle");
                      }, 5000);
                      resetFormValues();
                    })
                    .catch(() => {
                      setFeedbackStatus("error");
                      setTimeout(() => {
                        setFeedbackStatus("idle");
                      }, 5000);
                    });
                } else {
                  setFeedbackStatus("error");
                  setTimeout(() => {
                    setFeedbackStatus("idle");
                  }, 5000);
                }
                resetFormValues();
              }}
              validationSchema={() =>
                yup.object({
                  problemType: yup.string(),
                  message: yup.string(),
                })
              }
            >
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
                    style={{ color: themeEnum.FOCUSED_TEXT_COLOR }}
                    className="text-center font-semibold"
                  >
                    Пожалуйста, опишите, с какой проблемой вы столкнулись. Мы
                    обязательно исправим её в ближайших релизах
                  </Text>
                  <View className="w-full pt-5   px-4 flex-col gap-y-2">
                    {negativeFeedBack.reasons.map((item) => (
                      <TouchableHighlight
                        className="rounded-md"
                        key={nanoid()}
                        onPress={() => {
                          values.problemType = item;
                          setReason(item);
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: themeEnum.BODY_BACKGROUD_COLOR,
                          }}
                          className="h-12 rounded-md  flex-row items-center px-2 "
                        >
                          <RadioButton
                            selected={reason === item ? true : false}
                          />

                          <Text
                            className="ml-2"
                            style={{ color: themeEnum.FOCUSED_TEXT_COLOR }}
                          >
                            {item}
                          </Text>
                        </View>
                      </TouchableHighlight>
                    ))}
                    {errors.problemType && touched.problemType ? (
                      <Text className="text-red-500">{errors.problemType}</Text>
                    ) : null}
                    <View className="flex-col gap-y-2">
                      <Text style={{ color: themeEnum.FOCUSED_TEXT_COLOR }}>
                        Детали, пожелания или проблемы:
                      </Text>
                      <TextInput
                        onChangeText={(text) => setMessage(text)}
                        value={message}
                        onBlur={handleBlur("name")}
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
                    underlayColor="none"
                    onPress={handleSubmit}
                    style={{ backgroundColor: themeEnum.SUCCESS_COLOR }}
                    className="w-11/12 px-4 rounded-md h-12 flex mt-5 justify-center items-center"
                  >
                    <Text className="color-white text-lg ">Отправить</Text>
                  </TouchableHighlight>
                </View>
              )}
            </Formik>
          ) : feedbackStatus === "error" ? (
            <View className="w-full h-screen gap-4 pb-16 flex justify-center items-center">
              <MaterialIcon name="error-outline" color="red" size={40} />
              <Text className="text-center" style={{ color: "red" }}>
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
                style={{ color: themeEnum.SUCCESS_COLOR }}
              >
                Спасибо! Мы рассмотрим вашу проблему и попробуем исправить её в
                ближайших релизах
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View className="w-full pt-52 h-full gap-y-2 flex flex-col items-center justify-center">
          <MaterialIcon
            name="error-outline"
            color={themeEnum.DARK_TEXT_COLOR}
            size={45}
          />
          <Text
            className="text-xl"
            style={{ color: themeEnum.DARK_TEXT_COLOR }}
          >
            Сеть недоступна
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default NegativeFeedBackScreen;
