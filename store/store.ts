import { combineReducers, configureStore } from "@reduxjs/toolkit";
import vpnSlice from "./reducers/vpnSlice";
const rootReducer = combineReducers({
  vpn: vpnSlice,
});
export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
