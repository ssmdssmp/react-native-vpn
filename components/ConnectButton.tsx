/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Platform, View, Text, TouchableHighlight } from "react-native";
import {
  setActiveConnection,
  setConnectionStartTime,
  setFreeVpnList,
  setIsNetworkReachable,
  setVpnConnectionState,
} from "../store/reducers/vpnSlice";
import { setIsFirstConnection } from "../store/reducers/vpnSlice";
import Ionicon from "react-native-vector-icons/Ionicons";
import { getCurrentIP } from "../hooks/http";
import firestore from "@react-native-firebase/firestore";
import { themeEnum } from "../types/themeEnum";
import RBSheet from "react-native-raw-bottom-sheet";
import { useState, useEffect, useRef } from "react";
import { setCurrentIPRejected } from "../store/reducers/vpnSlice";
import RNSimpleOpenvpn, {
  addVpnStateListener,
  removeVpnStateListener,
} from "react-native-simple-openvpn";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import NetInfo from "@react-native-community/netinfo";
import RNFS from "react-native-fs";
import { IConnection } from "../types";
export const ConnectButton = () => {
  const dispatch = useAppDispatch();
  const refAllowVPNconfig = useRef();
  const [log, setLog] = useState("");
  const {
    currentIP,
    user,
    connectionState,
    activeConnection,
    configFileFolder,
    freeVpnList,
    connectionStartTime,
    isNetworkReachable,
    isConfigLoading,
  } = useAppSelector(({ vpn }) => vpn);
  const connectionStateRef = useRef(connectionState);
  const isNetworkReachableRef = useRef(isNetworkReachable);
  const isConfigLoadingRef = useRef(isConfigLoading);

  const userRef = useRef(user);
  const currentIPRef = useRef(currentIP);
  const freeVpnListRef = useRef(freeVpnList);
  const activeConnectionRef = useRef(activeConnection);
  isConfigLoadingRef.current = isConfigLoading;
  freeVpnListRef.current = freeVpnList;
  activeConnectionRef.current = activeConnection;
  connectionStateRef.current = connectionState;
  isNetworkReachableRef.current = isNetworkReachable;

  userRef.current = user;
  currentIPRef.current = currentIP;
  const downloadActiveVpnConfig = (item: IConnection, folder: string) => {
    RNFS.downloadFile({
      fromUrl: `${item.url}`,
      toFile: `${folder}/${item.objectName}`,
    }).promise.catch((err) => console.log(err));
  };
  const setErrorAndReconnect = () => {
    if (isNetworkReachableRef.current) {
      dispatch(setCurrentIPRejected(true));
    }
    firestore()
      .collection("ovpn")
      .doc(activeConnectionRef.current.id)
      .set({
        ...activeConnectionRef.current,
        status: "error",
        connectionTime: 0,
      })
      .then(() => {
        const newFreeVpnList = [
          ...freeVpnList.filter(
            (el) => el.id !== activeConnectionRef.current.id
          ),
          {
            ...activeConnectionRef.current,
            status: "error",
            connectionTime: 0,
          },
        ];
        dispatch(setFreeVpnList(newFreeVpnList));
      })
      .catch((err) => console.log(err));
    if (
      freeVpnList.filter((el) => el.title === activeConnection.title).length !==
        1 &&
      freeVpnList
        .filter((el) => el.title === activeConnection.title)
        .filter((el) => el.status === "active")
        .filter((el) => el.id !== activeConnection.id).length !== 0
    ) {
      const newActiveConnection = freeVpnList
        .filter((el) => el.title === activeConnection.title)
        .filter((el) => el.id !== activeConnection.id)
        .filter((el) => el.status === "active")[0];

      dispatch(setActiveConnection(newActiveConnection));
      RNFS.downloadFile({
        fromUrl: newActiveConnection.url,
        toFile: `${configFileFolder}/${newActiveConnection.objectName}`,
      }).promise.then((res) => {
        if (res.statusCode === 200) {
          dispatch(setCurrentIPRejected(false));
          startOvpn();
        }
      });
    } else {
      stopOvpn();
      // reconnect to another country
    }
  };
  //@ts-ignore
  useEffect(() => {
    async function observeVpn() {
      if (isIPhone) {
        await RNSimpleOpenvpn.observeState();
      }
      addVpnStateListener((e) => {
        // console.log(log, e);
        dispatch(setVpnConnectionState(e));
        updateLog(JSON.stringify(e));
      });
    }

    observeVpn();

    return async () => {
      if (isIPhone) {
        await RNSimpleOpenvpn.stopObserveState();
      }

      removeVpnStateListener();
    };
  });
  useEffect(() => {
    if (
      connectionState.state === 2 &&
      new Date().getSeconds() - connectionStartTime !== 0
    ) {
      const connectionTime = new Date().getSeconds() - connectionStartTime;
      firestore()
        .collection("ovpn")
        .doc(activeConnectionRef.current.id)
        .set({
          ...activeConnectionRef.current,
          status: "active",
          connectionTime,
        });
      dispatch(
        setActiveConnection({
          ...activeConnectionRef.current,
          status: "active",
          connectionTime,
        })
      );

      dispatch(getCurrentIP());
      dispatch(setCurrentIPRejected(false));
    }
    if (connectionState.state === 4) {
      setErrorAndReconnect();
    }
  }, [connectionState.state]);
  useEffect(() => {
    setInterval(() => {
      NetInfo.fetch().then((res) => {
        dispatch(setIsNetworkReachable(res.isConnected));
      });
    }, 1000);
  }, []);
  useEffect(() => {
    if (isNetworkReachableRef.current === true) {
      dispatch(getCurrentIP());
      if (freeVpnListRef.current.length === 0) {
        let arr: IConnection[] = [];
        firestore()
          .collection("ovpn")
          .get()
          .then((res2) => {
            res2.docs.map((item) => {
              const data = { ...item.data(), id: item.id };
              arr.push(data as IConnection);
            });
          })
          .then(() => {
            const newArr = arr;
            dispatch(setFreeVpnList(newArr));
            if (userRef.current.settings.connectionType === "recommended") {
              dispatch(setActiveConnection(newArr[0]));
              downloadActiveVpnConfig(newArr[0], configFileFolder);
            } else {
              dispatch(setActiveConnection(userRef.current.lastConnection));
              downloadActiveVpnConfig(
                userRef.current.lastConnection,
                configFileFolder
              );
            }
          })
          .then(() => setCurrentIPRejected(false));
      }
    } else {
      stopOvpn();
    }
  }, [isNetworkReachable]);

  async function startOvpn() {
    await NetInfo.fetch()
      .then(async () => {
        if (isNetworkReachableRef.current) {
          dispatch(setCurrentIPRejected(false));
          dispatch(setConnectionStartTime(new Date().getSeconds()));
          try {
            const ovpnString = await RNFS.readFile(
              `${configFileFolder}/${activeConnectionRef.current.objectName}`
            );
            await RNSimpleOpenvpn.connect({
              ovpnString,
              notificationTitle: "VPN 3001",
              compatMode: RNSimpleOpenvpn.CompatMode.OVPN_TWO_THREE_PEER,
              providerBundleIdentifier: "com.vpn3001",
              localizedDescription: "VPN 3001",
            }).then(() => {
              const checkConnectionTimeout = setTimeout(() => {
                if (connectionStateRef.current.state === 1) {
                  if (activeConnectionRef.current.id === activeConnection.id) {
                    setErrorAndReconnect();
                  }
                  clearTimeout(checkConnectionTimeout);
                }
                if (connectionStateRef.current.state === 2) {
                  if (activeConnectionRef.current.status === "error") {
                    firestore()
                      .collection("ovpn")
                      .doc(activeConnectionRef.current.id)
                      .set({
                        ...activeConnectionRef.current,
                        status: "active",
                        connectionTime: 0,
                      })
                      .then(() => {
                        const newFreeVpnList = [
                          ...freeVpnList.filter(
                            (el) => el.id !== activeConnectionRef.current.id
                          ),
                          {
                            ...activeConnectionRef.current,
                            status: "active",
                            connectionTime: 0,
                          },
                        ];

                        dispatch(setFreeVpnList(newFreeVpnList));
                      })
                      .catch((err) => console.log(err));
                  } else {
                  }
                  if (userRef.current.settings.killswitch === true) {
                    const checkConnectionInterval = setInterval(() => {
                      dispatch(getCurrentIP());
                      if (connectionStateRef.current.state === 0) {
                        clearInterval(checkConnectionInterval);
                      }
                      if (currentIPRef.current.rejected) {
                        stopOvpn();
                        dispatch(setCurrentIPRejected(true));
                        setTimeout(() => {
                          dispatch(setCurrentIPRejected(false));
                        }, 5000);
                      }
                    }, 5000);
                  }
                }
              }, 15000);
            });
          } catch (error) {
            setErrorAndReconnect();
          }
        } else {
          dispatch(setIsNetworkReachable(false));
          stopOvpn();
        }
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    if (
      (user.settings.autoconnection === true &&
        activeConnection.title !== "") ||
      connectionState.state === 2
    ) {
      stopOvpn().then(() =>
        RNFS.downloadFile({
          fromUrl: `${activeConnectionRef.current.url}`,
          toFile: `${configFileFolder}/${activeConnectionRef.current.objectName}`,
        })
          .promise.then((res) => {
            if (res.statusCode === 200) {
              startOvpn();
            } else {
              return;
            }
          })
          .catch((err) => console.log(err))
      );
    }
  }, [user.settings.autoconnection, activeConnection.title]);
  async function stopOvpn() {
    try {
      await RNSimpleOpenvpn.disconnect().then(() => {
        if (isNetworkReachable) {
          dispatch(getCurrentIP());
        }
      });
    } catch (error) {
      updateLog(error);
    }
  }

  function updateLog(newLog: any) {
    const now = new Date().toLocaleTimeString();
    setLog(`${log}\n[${now}] ${newLog}`);
  }

  return (
    <TouchableHighlight
      onPress={() => {
        if (user.isFirstConnection && isNetworkReachable) {
          //@ts-ignore
          refAllowVPNconfig.current.open();
        } else {
          if (connectionState.state === 2 || connectionState.state === 1) {
            stopOvpn().then(() => dispatch(getCurrentIP()));
          } else {
            if (!isConfigLoadingRef.current) {
              startOvpn();
            }
          }
        }
      }}
      style={{
        backgroundColor:
          connectionState.state === 0
            ? themeEnum.SUCCESS_COLOR
            : connectionState.state === 1
            ? themeEnum.FOCUSED_COLOR
            : connectionState.state === 2
            ? themeEnum.DARK_TEXT_COLOR
            : themeEnum.SUCCESS_COLOR,
      }}
      className="w-9/12 h-12 mb-4  flex justify-center items-center rounded-md"
      underlayColor="none"
    >
      <View className="w-full h-full flex-row gap-x-2 justify-center items-center">
        <Ionicon color="white" name="rocket" size={22} />
        <Text className="text-white font-semibold text-[16px] ">
          {connectionState.state === 0
            ? "Подключиться"
            : connectionState.state === 1
            ? "Отмена"
            : connectionState.state === 2
            ? "Отключиться"
            : "Подключиться"}
        </Text>
        <RBSheet
          onClose={() => {
            dispatch(setIsFirstConnection(false));
            if (activeConnectionRef.current.id !== "" && isNetworkReachable) {
              startOvpn();
            }
          }}
          //@ts-ignore
          ref={refAllowVPNconfig}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.2)",
            },
            container: {
              borderRadius: 12,
              backgroundColor: themeEnum.BODY_BACKGROUD_COLOR,
            },
            draggableIcon: {
              backgroundColor: "transparent",
            },
          }}
        >
          <View className="w-full flex-col items-center gap-y-5">
            <Text
              style={{ color: themeEnum.FOCUSED_TEXT_COLOR }}
              className="text-center text-lg font-semibold"
            >
              Нам нужно ваше разрешение чтобы подключится к VPN
            </Text>
            <Text
              style={{ color: themeEnum.FOCUSED_TEXT_COLOR }}
              className="text-center px-2"
            >
              На следующем экране вам будет предложено установить VPN
              конфигурацию - разрешите установку для дальнейшей работы Planet
              VPN
            </Text>
            <TouchableHighlight
              style={{ backgroundColor: themeEnum.SUCCESS_COLOR }}
              className="w-11/12 h-14 flex justify-center items-center rounded-md "
              onPress={() => {
                //@ts-ignore
                refAllowVPNconfig.current.close();
                dispatch(setIsFirstConnection(false));
              }}
              underlayColor={themeEnum.SUCCESS_COLOR}
            >
              <Text className="color-white text-lg">Понятно</Text>
            </TouchableHighlight>
          </View>
        </RBSheet>
      </View>
    </TouchableHighlight>
  );
};

const isIPhone = Platform.OS === "ios";
