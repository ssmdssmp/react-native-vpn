import {Share} from 'react-native';

const onShare = async () => {
  try {
    const result = await Share.share({
      message:
        'Использую бесплатный VPN, рекомендую: https://freevpnplanet.com/download',
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
};

export default onShare;
