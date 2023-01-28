import {Share} from 'react-native';

const debounce = require('lodash.debounce');

const onShare = debounce(async () => {
    try {
      
      const result = await Share.share({
        message:
          'https://freevpnplanet.com/download',
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
},450);

export default onShare;