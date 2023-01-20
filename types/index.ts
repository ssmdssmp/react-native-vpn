export interface IConnectionState {
  level: string;
  message: string;
  state: number;
}
export type currentIPDataType = {
  as: string;
  city: string;
  country: string;
  countryCode: string;
  isp: string;
  lat: number;
  lon: number;
  org: string;
  query: string;
  region: string;
  regionName: string;
  status: string;
  timezone: string;
  zip: string;
};

export interface ICurrentIP {
  data: currentIPDataType;
  loading: boolean;
  rejected: boolean;
}

export interface IUser {
  email: string;
  settings: {
    killswitch: boolean;
    autoconnection: boolean;
    connectionType: 'last' | 'recommended';
    protocol: 'IKEv2' | 'OpenVPN TCP' | 'OpenVPN UDP';
  };
  isFirstConnection: boolean;
  lastConnection: IConnection;
  subscription: 'free' | 'premium';
}
export interface IConnection {
  title: string;
  country: string;
  url: string;
  status: string;
  objectName: string;
  id: string;
  connectionTime: number;
}
export interface InitState {
  currentIP: ICurrentIP;

  connectionState: IConnectionState;
  user: IUser;
  isOpenSupportPopup: boolean;

  negativeFeedBack: {
    reasons: string[];
    reason: string;
  };
  isBadConnection: boolean;
  freeVpnList: IConnection[];
  activeConnection: IConnection;
  configFileFolder: string;
  connectionStartTime: number;
}

export const initUser: IUser = {
  email: '',
  settings: {
    killswitch: false,
    autoconnection: false,
    connectionType: 'recommended',
    protocol: 'OpenVPN TCP',
  },
  isFirstConnection: true,
  lastConnection: {
    id: '',
    title: '',
    status: 'active',
    url: '',
    country: '',
    objectName: '',
    connectionTime: 0,
  },
  subscription: 'free',
};
export const initCurrentIP: ICurrentIP = {
  data: {
    as: '',
    city: '',
    country: '',
    countryCode: '',
    isp: '',
    lat: 0,
    lon: 0,
    org: '',
    query: '',
    region: '',
    regionName: '',
    status: '',
    timezone: '',
    zip: '',
  },
  loading: false,
  rejected: false,
};
// export const freeVpnList = [
//   {ovpnString: 'Poland1', country: 'pl', title: 'Poland 1'},
//   {ovpnString: 'Turkey1', country: 'tr', title: 'Turkey 1'},
//   {ovpnString: 'Sweden1', country: 'se', title: 'Sweden 1'},
//   {ovpnString: 'KualaLumpur1', country: 'my', title: 'Kuala Lumpur 1'},
//   {ovpnString: 'HongKong1', country: 'hk', title: 'Hong Kong 1'},
//   {ovpnString: 'Japan_old', country: 'jp', title: 'Japan [killswitch test]'},
// ];
// export const premiumVpnList = [
//   {ovpnString: 'London', country: 'gb', title: 'London'},
//   {ovpnString: 'Paris', country: 'fr', title: 'Paris'},
//   {ovpnString: 'Barcelona', country: 'es', title: 'Barcelona'},
//   {ovpnString: 'Rome', country: 'it', title: 'Rome'},
//   {ovpnString: 'Berlin', country: 'de', title: 'Berlin'},
//   {ovpnString: 'Kyiv', country: 'ua', title: 'Kyiv'},
// ];
export const negativeFeedbackReasons = [
  'Проблема с подключением',
  'Неудобный интерфейс приложения',
  'Вопрос о регистрации или оплате',
  'Низкая скорость',
  'Нет нужной функции или сервера',
  'Предложения и идеи',
];
export const initialState: InitState = {
  currentIP: initCurrentIP,
  user: initUser,
  activeConnection: {
    id: '',
    title: '',
    objectName: '',
    country: '',
    url: '',
    status: 'active',
    connectionTime: 0,
  },
  connectionState: {
    level: '',
    message: '',
    state: 3, // 0 binded for error 1 - loading, 2 - connected
  },
  isBadConnection: false,
  freeVpnList: [],

  connectionStartTime: 0,
  isOpenSupportPopup: false,
  negativeFeedBack: {
    reasons: negativeFeedbackReasons,
    reason: '',
  },
  configFileFolder: '',
};
