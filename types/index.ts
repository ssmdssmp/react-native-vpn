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
export const currentIPDataError: currentIPDataType = {
  as: "",
  city: "",
  country: "",
  countryCode: "",
  isp: "",
  lat: 0,
  lon: 0,
  org: "",
  query: "Ошибка получения IP",
  region: "",
  regionName: "",
  status: "",
  timezone: "",
  zip: "",
};

export interface ICurrentIP {
  loadingCountryCode: string;
  data: currentIPDataType;
  loading: boolean;
  rejected: boolean;
}

export interface IUser {
  email: string;
  settings: {
    killswitch: boolean;
    autoconnection: boolean;
    connectionType: "last" | "recommended";
    protocol: "IKEv2" | "OpenVPN TCP" | "OpenVPN UDP";
  };
  isFirstConnection: boolean;
  lastConnection: IConnection;
  subscription: "free" | "premium";
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
  };
  isBadConnection: boolean;
  freeVpnList: IConnection[];
  activeConnection: IConnection;
  configFileFolder: string;
  connectionStartTime: number;
  isConfigLoading: boolean;
  isNetworkReachable: boolean;
  isActiveSearch: false;
}

export interface FormValues {
  problemType: string;
  message: string;
}
export const connectionError: IConnection = {
  title: "Error",
  country: "eu",
  url: "",
  status: "error",
  objectName: "",
  id: "1",
  connectionTime: 0,
};

export const initUser: IUser = {
  email: "",
  settings: {
    killswitch: false,
    autoconnection: false,
    connectionType: "recommended",
    protocol: "OpenVPN TCP",
  },
  isFirstConnection: true,
  lastConnection: {
    id: "",
    title: "",
    status: "active",
    url: "",
    country: "",
    objectName: "",
    connectionTime: 0,
  },
  subscription: "free",
};
export const initCurrentIP: ICurrentIP = {
  loadingCountryCode: "",
  data: {
    as: "",
    city: "",
    country: "",
    countryCode: "",
    isp: "",
    lat: 0,
    lon: 0,
    org: "",
    query: "",
    region: "",
    regionName: "",
    status: "",
    timezone: "",
    zip: "",
  },
  loading: false,
  rejected: false,
};
export const negativeFeedbackReasons = [
  "Проблема с подключением",
  "Неудобный интерфейс приложения",
  "Вопрос о регистрации или оплате",
  "Низкая скорость",
  "Нет нужной функции или сервера",
  "Предложения и идеи",
];
export const initialState: InitState = {
  currentIP: initCurrentIP,
  user: initUser,
  activeConnection: {
    id: "",
    title: "",
    objectName: "",
    country: "",
    url: "",
    status: "active",
    connectionTime: 0,
  },
  connectionState: {
    level: "",
    message: "",
    state: 3,
  },
  isBadConnection: false,
  freeVpnList: [],

  connectionStartTime: 0,
  isOpenSupportPopup: false,
  negativeFeedBack: {
    reasons: negativeFeedbackReasons,
  },
  configFileFolder: "",
  isConfigLoading: false,
  isNetworkReachable: false,
  isActiveSearch: false,
};
