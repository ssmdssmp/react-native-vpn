import { Alert } from "react-native";

const openRateAlert = (navigation: any) => {
  Alert.alert(
    "Вам нравится наше приложение?",
    "Нам важно слышать ваше мнение и делать приложение лучше",
    [
      {
        text: "Нет",
        onPress: () => navigation.navigate("NegativeFeedback"),
        style: "destructive",
      },
      { text: "Да", onPress: () => console.log("OK Pressed") },
    ],
    { cancelable: true }
  );
};

export default openRateAlert;
