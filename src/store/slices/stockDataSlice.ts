import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { STOCK, postRequest, getRequest, deleteRequest } from '@/lib/api';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  dayHigh?: number;
  dayLow?: number;
  lastUpdate?: string;
}

interface WatchlistItem extends Stock {
  id: string;
  addedAt: string;
}

interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  quantity: number;
  price?: number;
  status: 'pending' | 'executed' | 'cancelled';
  createdAt: string;
  executedAt?: string;
}

interface Position {
  id: string;
  symbol: string;
  type: 'equity' | 'commodity';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface StockDataState {
  watchlist: WatchlistItem[];
  myStocks: Position[];
  myCommodities: Position[];
  orders: Order[];
  stockHistory: any[];
  stockListSocket: Stock[];
  loading: boolean;
  error: string | null;
  watchlistFailed: boolean;
  balance: number;
  transactions: any[];
  paymentMethods: any[];
}

const initialState: StockDataState = {
  watchlist: [],
  myStocks: [],
  myCommodities: [],
  orders: [],
  stockHistory: [],
  stockListSocket: [],
  loading: false,
  error: null,
  watchlistFailed: false,
  balance: 0,
  transactions: [],
  paymentMethods: [],
};

// Async thunks
export const getWatchList = createAsyncThunk(
  'stockData/getWatchList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(STOCK.GET_WATCHLIST_LIST);
      if (response.status && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to get watchlist');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get watchlist');
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'stockData/addToWatchlist',
  async (symbol: string, { rejectWithValue }) => {
    try {
      const response = await postRequest(STOCK.ADD_WATCHLIST, { symbol });
      if (response.status) {
        return response;
      }
      return rejectWithValue(response.message || 'Failed to add to watchlist');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to watchlist');
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'stockData/removeFromWatchlist',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await deleteRequest(STOCK.DELETE_WATCHLIST + itemId);
      if (response.status) {
        return itemId;
      }
      return rejectWithValue(response.message || 'Failed to remove from watchlist');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from watchlist');
    }
  }
);

export const getMyStocks = createAsyncThunk(
  'stockData/getMyStocks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(STOCK.MY_STOCKS);
      if (response.status && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to get stocks');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get stocks');
    }
  }
);

export const getMyCommodities = createAsyncThunk(
  'stockData/getMyCommodities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(STOCK.MY_STOCKS_Comm);
      if (response.status && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to get commodities');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get commodities');
    }
  }
);

export const getStockHistory = createAsyncThunk(
  'stockData/getStockHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(STOCK.STOCK_HISTORY);
      if (response.status && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to get stock history');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get stock history');
    }
  }
);

export const buyStock = createAsyncThunk(
  'stockData/buyStock',
  async (orderData: {
    symbol: string;
    quantity: number;
    price?: number;
    orderType: 'market' | 'limit';
  }, { rejectWithValue }) => {
    try {
      const response = await postRequest(STOCK.BUY_STOCK, orderData);
      if (response.status) {
        return response;
      }
      return rejectWithValue(response.message || 'Failed to place buy order');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place buy order');
    }
  }
);

export const sellStock = createAsyncThunk(
  'stockData/sellStock',
  async (orderData: {
    symbol: string;
    quantity: number;
    price?: number;
    orderType: 'market' | 'limit';
  }, { rejectWithValue }) => {
    try {
      const response = await postRequest(STOCK.SELL_STOCK, orderData);
      if (response.status) {
        return response;
      }
      return rejectWithValue(response.message || 'Failed to place sell order');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place sell order');
    }
  }
);

export const deposit = createAsyncThunk(
  'stockData/deposit',
  async (depositData: { amount: number; method: string; reference?: string }, { rejectWithValue }) => {
    try {
      const response = await postRequest(STOCK.DEPOSIT, depositData);
      if (response.status) {
        return response;
      }
      return rejectWithValue(response.message || 'Deposit failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Deposit failed');
    }
  }
);

export const withdraw = createAsyncThunk(
  'stockData/withdraw',
  async (withdrawData: { amount: number; method: string; accountDetails: any }, { rejectWithValue }) => {
    try {
      const response = await postRequest(STOCK.WITHDRAW, withdrawData);
      if (response.status) {
        return response;
      }
      return rejectWithValue(response.message || 'Withdrawal failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Withdrawal failed');
    }
  }
);

export const getPaymentInfo = createAsyncThunk(
  'stockData/getPaymentInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(STOCK.PAYMENT_INFO);
      if (response.status && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to get payment info');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get payment info');
    }
  }
);

export const getQuotes = createAsyncThunk(
  'stockData/getQuotes',
  async (symbols: string[], { rejectWithValue }) => {
    try {
      const response = await getRequest(STOCK.GET_QOUTES, { symbols });
      if (response.status && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to get quotes');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get quotes');
    }
  }
);

const stockDataSlice = createSlice({
  name: 'stockData',
  initialState,
  reducers: {
    setStockListSocket: (state, action: PayloadAction<Stock[]>) => {
      state.stockListSocket = action.payload;
    },
    updateStockPrice: (state, action: PayloadAction<{ symbol: string; price: number; change: number; changePercent: number }>) => {
      const { symbol, price, change, changePercent } = action.payload;
      
      // Update watchlist
      const watchlistIndex = state.watchlist.findIndex(item => item.symbol === symbol);
      if (watchlistIndex !== -1) {
        state.watchlist[watchlistIndex].price = price;
        state.watchlist[watchlistIndex].change = change;
        state.watchlist[watchlistIndex].changePercent = changePercent;
      }
      
      // Update my stocks
      const stockIndex = state.myStocks.findIndex(item => item.symbol === symbol);
      if (stockIndex !== -1) {
        state.myStocks[stockIndex].currentPrice = price;
        const pnl = (price - state.myStocks[stockIndex].avgPrice) * state.myStocks[stockIndex].quantity;
        const pnlPercent = ((price - state.myStocks[stockIndex].avgPrice) / state.myStocks[stockIndex].avgPrice) * 100;
        state.myStocks[stockIndex].pnl = pnl;
        state.myStocks[stockIndex].pnlPercent = pnlPercent;
      }
      
      // Update socket data
      const socketIndex = state.stockListSocket.findIndex(item => item.symbol === symbol);
      if (socketIndex !== -1) {
        state.stockListSocket[socketIndex].price = price;
        state.stockListSocket[socketIndex].change = change;
        state.stockListSocket[socketIndex].changePercent = changePercent;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    checkAndAddMockData: (state) => {
      // Add mock data if no data is present
      if (state.watchlist.length === 0) {
        state.watchlist = [
          { id: '1', symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24, volume: 50000000, addedAt: new Date().toISOString() },
          { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: -1.23, changePercent: -0.85, volume: 30000000, addedAt: new Date().toISOString() },
          { id: '3', symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.91, change: 3.45, changePercent: 0.92, volume: 40000000, addedAt: new Date().toISOString() },
        ];
      }
      
      if (state.myStocks.length === 0) {
        state.myStocks = [
          { id: '1', symbol: 'AAPL', type: 'equity', quantity: 100, avgPrice: 150.00, currentPrice: 175.43, pnl: 2543.00, pnlPercent: 16.95 },
          { id: '2', symbol: 'GOOGL', type: 'equity', quantity: 50, avgPrice: 140.00, currentPrice: 142.56, pnl: 128.00, pnlPercent: 1.83 },
        ];
      }
      
      if (state.balance === 0) {
        state.balance = 10000;
        state.transactions = [
          { id: '1', type: 'deposit', amount: 5000, method: 'card', status: 'completed', createdAt: new Date().toISOString() },
          { id: '2', type: 'deposit', amount: 5000, method: 'bank', status: 'completed', createdAt: new Date().toISOString() },
        ];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Watchlist
      .addCase(getWatchList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWatchList.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlist = action.payload;
        state.watchlistFailed = false;
      })
      .addCase(getWatchList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.watchlistFailed = true;
      })
      // Add to Watchlist
      .addCase(addToWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWatchlist.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove from Watchlist
      .addCase(removeFromWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlist = state.watchlist.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get My Stocks
      .addCase(getMyStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.myStocks = action.payload;
      })
      .addCase(getMyStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get My Commodities
      .addCase(getMyCommodities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyCommodities.fulfilled, (state, action) => {
        state.loading = false;
        state.myCommodities = action.payload;
      })
      .addCase(getMyCommodities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Stock History
      .addCase(getStockHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStockHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.stockHistory = action.payload;
      })
      .addCase(getStockHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Buy Stock
      .addCase(buyStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buyStock.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(buyStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sell Stock
      .addCase(sellStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellStock.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sellStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Quotes
      .addCase(getQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuotes.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Deposit
      .addCase(deposit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deposit.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data?.newBalance) {
          state.balance = action.payload.data.newBalance;
        }
        if (action.payload.data?.transaction) {
          state.transactions.unshift(action.payload.data.transaction);
        }
      })
      .addCase(deposit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Withdraw
      .addCase(withdraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data?.newBalance) {
          state.balance = action.payload.data.newBalance;
        }
        if (action.payload.data?.transaction) {
          state.transactions.unshift(action.payload.data.transaction);
        }
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Payment Info
      .addCase(getPaymentInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance || 0;
        state.transactions = action.payload.transactions || [];
        state.paymentMethods = action.payload.paymentMethods || [];
      })
      .addCase(getPaymentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setStockListSocket, updateStockPrice, clearError, checkAndAddMockData } = stockDataSlice.actions;
export default stockDataSlice.reducer;