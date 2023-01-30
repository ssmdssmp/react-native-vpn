import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {currentIPDataType} from '../types';
import {currentIPDataError} from '../types';
export const getCurrentIP = createAsyncThunk<currentIPDataType>(
  'vpn/getCurrentIP',
  async () => {
    return await axios
      .get('http://ip-api.com/json')
      .then(res => res.data)
      .catch(() => currentIPDataError);
  },
);
