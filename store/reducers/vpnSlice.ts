import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../../types/";
import { getCurrentIP } from "../../hooks/http";
import { initUser } from "../../types/";

const vpnSlice = createSlice({
  name: "vpn",
  initialState,
  reducers: {
    createNewUser: (state, { payload }) => {
      state.user = { ...initUser, email: payload };
    },
    leaveAccount: (state) => {
      state.user = initUser;
    },

    openSupportPopup: (state) => {
      state.isOpenSupportPopup = true;
    },
    closeSupportPopup: (state) => {
      state.isOpenSupportPopup = false;
    },
    toggleKillswitch: (state) => {
      state.user.settings.killswitch = !state.user.settings.killswitch;
    },
    setIsFirstConnection: (state, { payload }) => {
      state.user.isFirstConnection = payload;
    },
    toggleAutoconnection: (state) => {
      state.user.settings.autoconnection = !state.user.settings.autoconnection;
    },
    setConnectionType: (state, { payload }) => {
      state.user.settings.connectionType = payload;
    },
    setProtocol: (state, { payload }) => {
      state.user.settings.protocol = payload;
    },
    setVpnConnectionState: (state, { payload }) => {
      state.connectionState = payload;
    },
    setCurrentIP: (state, { payload }) => {
      state.currentIP = payload;
    },
    setLoadingCountryCode: (state, { payload }) => {
      state.currentIP = payload;
    },
    setIsConfigLoading: (state, { payload }) => {
      state.isConfigLoading = payload;
    },
    setActiveConnection: (state, { payload }) => {
      state.activeConnection = payload;
      state.user.lastConnection = payload;
    },
    setCurrentIPRejected: (state, { payload }) => {
      state.currentIP.rejected = payload;
    },
    setLocalUser: (state, { payload }) => {
      state.user = payload;
    },
    setFreeVpnList: (state, { payload }) => {
      state.freeVpnList = payload;
    },
    checkConnection: (state) => {
      if (state.connectionState.state === 1) {
        state.isBadConnection === true;
      }
    },
    setConfigFileFolder: (state, { payload }) => {
      state.configFileFolder = payload;
    },
    setConnectionStartTime: (state, { payload }) => {
      state.connectionStartTime = payload;
    },
    setIsNetworkReachable: (state, { payload }) => {
      state.isNetworkReachable = payload;
      if (payload === false) {
        state.currentIP.loading = false;
        state.currentIP.data.query = "Сеть недоступна";
      }
    },
    setIsActiveSearch: (state, { payload }) => {
      state.isActiveSearch = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentIP.fulfilled, (state, { payload }) => {
        if (payload.query !== undefined) {
          state.currentIP.data = payload;
          state.currentIP.loading = false;
        } else {
          state.currentIP.data.query = " Ошибка получения IP";
        }
      })
      .addCase(getCurrentIP.pending, (state) => {
        state.currentIP.loading = true;
        //  state.currentIP.data.countryCode=
      })
      .addCase(getCurrentIP.rejected, (state) => {
        state.currentIP.data.query = "Ошибка получения IP";
        state.currentIP.loading = false;
        state.currentIP.rejected = true;
      });
  },
});

export const {
  setIsActiveSearch,
  setIsNetworkReachable,
  setIsConfigLoading,
  setFreeVpnList,
  setConfigFileFolder,
  setLocalUser,
  setCurrentIPRejected,
  setCurrentIP,
  setActiveConnection,
  createNewUser,
  leaveAccount,
  setVpnConnectionState,
  openSupportPopup,
  closeSupportPopup,
  toggleKillswitch,
  toggleAutoconnection,
  setConnectionType,
  setConnectionStartTime,
  setIsFirstConnection,
  setProtocol,
  setLoadingCountryCode,
} = vpnSlice.actions;

export default vpnSlice.reducer;
