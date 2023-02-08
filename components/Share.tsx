import { Share } from "react-native";

let isOpenedShare = false;

const onShare = async () => {
  if (!isOpenedShare) {
    isOpenedShare = true;
    setTimeout(() => (isOpenedShare = false), 1000);

    try {
      const result = await Share.share({
        message: "https://freevpnplanet.com/download",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export default onShare;
