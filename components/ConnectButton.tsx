/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

import {Platform, View, Text, TouchableHighlight} from 'react-native';
import {
  setActiveConnection,
  setConnectionStartTime,
  setFreeVpnList,
  setVpnConnectionState,
} from '../store/reducers/vpnSlice';
import {setIsFirstConnection} from '../store/reducers/vpnSlice';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {getCurrentIP} from '../hooks/http';
import firestore from '@react-native-firebase/firestore';
import {themeEnum} from '../types/themeEnum';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useState, useEffect, useRef} from 'react';
import {setCurrentIPRejected} from '../store/reducers/vpnSlice';
import RNSimpleOpenvpn, {
  addVpnStateListener,
  removeVpnStateListener,
} from 'react-native-simple-openvpn';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import RNFS from 'react-native-fs';
export const ConnectButton = () => {
  const dispatch = useAppDispatch();
  const refAllowVPNconfig = useRef();
  const [log, setLog] = useState('');
  const {
    currentIP,
    user,
    connectionState,
    activeConnection,
    configFileFolder,
    freeVpnList,
    connectionStartTime,
  } = useAppSelector(({vpn}) => vpn);
  const connectionStateRef = useRef(connectionState);
  const userRef = useRef(user);
  const currentIPRef = useRef(currentIP);
  const activeConnectionRef = useRef(activeConnection);
  activeConnectionRef.current = activeConnection;
  connectionStateRef.current = connectionState;
  userRef.current = user;
  currentIPRef.current = currentIP;

  //@ts-ignore
  useEffect(() => {
    async function observeVpn() {
      if (isIPhone) {
        await RNSimpleOpenvpn.observeState();
      }
      addVpnStateListener(e => {
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
      currentIP.loading === false &&
      new Date().getSeconds() - connectionStartTime !== 0
    ) {
      const connectionTime = new Date().getSeconds() - connectionStartTime;
      firestore()
        .collection('ovpn')
        .doc(activeConnectionRef.current.id)
        .set({
          ...activeConnectionRef.current,
          connectionTime,
        });
      dispatch(
        setActiveConnection({...activeConnectionRef.current, connectionTime}),
      );
      setTimeout(() => {
        dispatch(getCurrentIP());
        dispatch(setCurrentIPRejected(false));
      }, 1000);
    }
    if (connectionState.state === 4) {
      dispatch(setCurrentIPRejected(true));
      setTimeout(() => {
        dispatch(setCurrentIPRejected(false));
      }, 5000);
    }
  }, [connectionState.state]);

  async function startOvpn() {
    dispatch(setConnectionStartTime(new Date().getSeconds()));
    try {
      const ovpnString = await RNFS.readFile(
        `${configFileFolder}/${activeConnection.objectName}`,
      );
      await RNSimpleOpenvpn.connect({
        ovpnString,
        notificationTitle: 'VPN 3001',
        compatMode: RNSimpleOpenvpn.CompatMode.OVPN_TWO_THREE_PEER,
        providerBundleIdentifier: 'com.vpn3001',
        localizedDescription: 'VPN 3001',
      }).then(() => {
        setTimeout(() => {
          if (connectionStateRef.current.state !== 2) {
            stopOvpn();
            dispatch(setCurrentIPRejected(true));
            firestore()
              .collection('ovpn')
              .doc(activeConnectionRef.current.id)
              .set({...activeConnectionRef.current, status: 'error'})
              .then(() => {
                const newFreeVpnList = [
                  ...freeVpnList.filter(
                    el => el.id !== activeConnectionRef.current.id,
                  ),
                  {...activeConnectionRef.current, status: 'error'},
                ];

                dispatch(setFreeVpnList(newFreeVpnList));
              })
              .catch(err => console.log(err));
          } else {
            if (activeConnection.status === 'error') {
              firestore()
                .collection('ovpn')
                .doc(activeConnection.id)
                .set({...activeConnection, status: 'active'})
                .then(() => {
                  const newFreeVpnList = [
                    ...freeVpnList.filter(el => el.id !== activeConnection.id),
                    {...activeConnection, status: 'active'},
                  ];

                  dispatch(setFreeVpnList(newFreeVpnList));
                })
                .catch(err => console.log(err));
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
      dispatch(setCurrentIPRejected(true));
      setTimeout(() => {
        dispatch(setCurrentIPRejected(false));
      }, 5000);
    }
  }
  useEffect(() => {
    if (
      user.settings.autoconnection === true &&
      activeConnection.title !== ''
    ) {
      RNFS.downloadFile({
        fromUrl: `${activeConnection.url}`,
        toFile: `${configFileFolder}/${activeConnection.objectName}`,
      })
        .promise.then(res => {
          if (res.statusCode === 200) {
            startOvpn();
          } else {
            return;
          }
        })
        .catch(err => console.log(err));
    }
  }, [user.settings.autoconnection, activeConnection.title]);
  async function stopOvpn() {
    try {
      await RNSimpleOpenvpn.disconnect().then(() => {
        dispatch(getCurrentIP());
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
        if (user.isFirstConnection) {
          //@ts-ignore
          refAllowVPNconfig.current.open();
        } else {
          if (connectionState.state === 2 || connectionState.state === 1) {
            stopOvpn().then(() => dispatch(getCurrentIP()));
          } else {
            startOvpn();
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
      underlayColor="none">
      <View className="w-full h-full flex-row gap-x-2 justify-center items-center">
        <Ionicon color="white" name="rocket" size={22} />
        <Text className="text-white font-semibold text-[16px] ">
          {connectionState.state === 0
            ? 'Подключиться'
            : connectionState.state === 1
            ? 'Отмена'
            : connectionState.state === 2
            ? 'Отключиться'
            : 'Подключиться'}
        </Text>
        <RBSheet
          //@ts-ignore
          ref={refAllowVPNconfig}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0,0,0,0.2)',
            },
            container: {
              borderRadius: 12,
              backgroundColor: themeEnum.BODY_BACKGROUD_COLOR,
            },
            draggableIcon: {
              backgroundColor: 'transparent',
            },
          }}>
          <View className="w-full flex-col items-center gap-y-5">
            <Text className="text-center text-lg font-semibold">
              Нам нужно ваше разрешение чтобы подключится к VPN
            </Text>
            <Text className="text-center px-2">
              На следующем экране вам будет предложено установить VPN
              конфигурацию - разрешите установку для дальнейшей работы Planet
              VPN
            </Text>
            <TouchableHighlight
              style={{backgroundColor: themeEnum.SUCCESS_COLOR}}
              className="w-11/12 h-14 flex justify-center items-center rounded-md "
              onPress={() => {
                //@ts-ignore
                refAllowVPNconfig.current.close();
                dispatch(setIsFirstConnection(false));
              }}
              underlayColor={themeEnum.SUCCESS_COLOR}>
              <Text className="color-white text-lg">Понятно</Text>
            </TouchableHighlight>
          </View>
        </RBSheet>
      </View>
    </TouchableHighlight>
  );
};

const isIPhone = Platform.OS === 'ios';
