import axios from 'axios';

// Live API configuration
const baseURL = 'https://backend-tradex.onrender.com';
export const baseURLExport = 'https://backend-tradex.onrender.com';

// API Endpoints
export const AUTH = {
  REGISTER: `${baseURL}/user/register`,
  LOGIN: `${baseURL}/user/login`,
  SEND_OTP: `${baseURL}/user/sendotp`,
  VERIFY_OTP: `${baseURL}/user/verifyotp`,
  USER_PROFILE: `${baseURL}/user/getuserprofile`,
};

export const STOCK = {
  GET_WATCHLIST_LIST: `${baseURL}/market/watchlists`,
  WATCH_LIST: `${baseURL}/market/getwatchlist/`,
  ADD_WATCHLIST: `${baseURL}/market/addtowatchlist`,
  DELETE_WATCHLIST: `${baseURL}/market/removewatchlistitem/`,
  BUY_STOCK: `${baseURL}/market/buy`,
  BUY_COMMODITY: `${baseURL}/market/buyCommodity`,
  SELL_STOCK: `${baseURL}/market/sell`,
  SELL_COMMODITY: `${baseURL}/market/sellCommodity`,
  STOCK_HISTORY: `${baseURL}/market/getmystockhistory`,
  MY_STOCKS: `${baseURL}/market/getmystocks`,
  MY_STOCKS_Comm: `${baseURL}/market/getmystocksCommodity`,
  DECODE_STOCK_DATA: `${baseURL}/market/decodestockdata`,
  SQUARE_OFF: `${baseURL}/market/squareoff`,
  GET_NSE_LATEST_PRICE: `${baseURL}/market/getNSELatestPrice`,
  SQUARE_OFF_Commodity: `${baseURL}/market/squareOffCommodity`,
  DELETE_STOCK: `${baseURL}/market/deletestock/`,
  GET_QOUTES: `${baseURL}/market/getQuotesV2`,
  BANKNIFTY_OPTIONS: `${baseURL}/market/banknifty-options`,
  GET_QOUTES_OLD: `${baseURL}/market/getQuotes`,
  INTRO: `${baseURL}/admin/intro`,
  WITHDRAW: `${baseURL}/user/withdraw`,
  PAYMENT_INFO: `${baseURL}/user/payment-info`,
  DEPOSIT: `${baseURL}/user/deposit`,
  GET_OPTION_DATA: (symbol: string) => `https://option-chain-data.onrender.com/chain?index=${symbol}`,
  GET_ONE_STOCK_DATA: (symbol: string) => `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
  SEARCH_STOCKS: (symbol: string) => `https://query2.finance.yahoo.com/v1/finance/search?q=${symbol}&lang=en-US&region=IN&quotesCount=3&newsCount=0&listsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query&multiQuoteQueryId=multi_quote_single_token_query&enableCb=false&enableNavLinks=false&enableEnhancedTrivialQuery=false&enableResearchReports=false&enableCulturalAssets=false&enableLogoUrl=false&researchReportsCount=0`,
};

// Storage utilities for web
export const StorageItems = {
  getUserToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  },
  setUserToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  getRememberMeStatus: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rememberMe') === 'true';
    }
    return false;
  },
  setRememberMeStatus: (status: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rememberMe', status.toString());
    }
  },
  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) || '';
    }
    return '';
  }
};

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = StorageItems.getUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear token and redirect to login
      StorageItems.clearAll();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API request functions
export const postRequest = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { message: error.message, status: false };
  }
};

export const getRequest = async (endpoint: string, params: any = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { message: error.message, status: false };
  }
};

export const deleteRequest = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { message: error.message, status: false };
  }
};

export default apiClient;