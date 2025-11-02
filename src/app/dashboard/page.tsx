'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { getWatchList, getMyStocks, getMyCommodities, getStockHistory, getPaymentInfo } from '@/store/slices/stockDataSlice';
import { getUserProfile } from '@/store/slices/authSlice';
import { logout } from '@/store/slices/authSlice';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, DollarSign, Activity, LogOut, Plus, Search, Star } from 'lucide-react';
import WatchlistTable from '@/components/dashboard/WatchlistTable';
import PortfolioTable from '@/components/dashboard/PortfolioTable';
import OrderTable from '@/components/dashboard/OrderTable';
import SearchModal from '@/components/dashboard/SearchModal';
import FundManagement from '@/components/funds/FundManagement';
import ResearchPanel from '@/components/research/ResearchPanel';
import IPOPanel from '@/components/ipo/IPOPanel';
import MutualFundsPanel from '@/components/mutual-funds/MutualFundsPanel';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { 
    watchlist, 
    myStocks, 
    myCommodities, 
    stockHistory, 
    loading, 
    error,
    balance
  } = useSelector((state: RootState) => state.stockData);

  const [showSearch, setShowSearch] = useState(false);

  // Set up WebSocket for real-time data
  const watchlistSymbols = watchlist.map(item => item.symbol);
  useWebSocket('wss://streamer.finance.yahoo.com', watchlistSymbols);

  useEffect(() => {
    // Allow access to dashboard regardless of authentication for testing
    // Load initial data
    dispatch(getWatchList({} as any));
    dispatch(getMyStocks({} as any));
    dispatch(getMyCommodities({} as any));
    dispatch(getStockHistory({} as any));
    dispatch(getPaymentInfo({} as any));
    
    // Add mock data if API calls fail (for testing)
    setTimeout(() => {
      // Check if data is loaded and add mock data if needed
      dispatch({ type: 'stockData/checkAndAddMockData' });
    }, 3000);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const calculateTotalPnL = () => {
    const stockPnL = myStocks.reduce((total, stock) => total + stock.pnl, 0);
    const commodityPnL = myCommodities.reduce((total, commodity) => total + commodity.pnl, 0);
    return stockPnL + commodityPnL;
  };

  const calculateTotalValue = () => {
    const stockValue = myStocks.reduce((total, stock) => total + (stock.currentPrice * stock.quantity), 0);
    const commodityValue = myCommodities.reduce((total, commodity) => total + (commodity.currentPrice * commodity.quantity), 0);
    return stockValue + commodityValue;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">TradeX Dashboard</h1>
              <Badge variant="secondary">
                Welcome, {user?.name || 'Demo User'}
              </Badge>
              {!isAuthenticated && (
                <Badge variant="outline" className="text-yellow-600">
                  Demo Mode
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                Search Stocks
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Available for trading
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${calculateTotalValue().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${calculateTotalPnL() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${calculateTotalPnL().toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {calculateTotalPnL() >= 0 ? '+' : ''}{((calculateTotalPnL() / calculateTotalValue()) * 100).toFixed(2)}% return
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myStocks.length + myCommodities.length}</div>
              <p className="text-xs text-muted-foreground">
                {myStocks.length} stocks, {myCommodities.length} commodities
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchlist.length}</div>
              <p className="text-xs text-muted-foreground">
                Tracking symbols
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="watchlist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="funds">Funds</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="ipo">IPO</TabsTrigger>
            <TabsTrigger value="mutual-funds">Mutual Funds</TabsTrigger>
          </TabsList>

          <TabsContent value="watchlist" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Watchlist</h2>
              <Button size="sm" onClick={() => setShowSearch(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Symbol
              </Button>
            </div>
            <WatchlistTable data={watchlist} loading={loading} />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Portfolio</h2>
              <div className="flex space-x-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Equity: {myStocks.length}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Commodity: {myCommodities.length}
                </Badge>
              </div>
            </div>
            <div className="space-y-6">
              {myStocks.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Stock Positions</h3>
                  <PortfolioTable data={myStocks} type="equity" loading={loading} />
                </div>
              )}
              {myCommodities.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Commodity Positions</h3>
                  <PortfolioTable data={myCommodities} type="commodity" loading={loading} />
                </div>
              )}
              {myStocks.length === 0 && myCommodities.length === 0 && (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No positions yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start building your portfolio by buying stocks or commodities.
                      </p>
                      <Button onClick={() => setShowSearch(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Start Trading
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Order History</h2>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            <OrderTable data={stockHistory} loading={loading} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Your trading performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Chart component will be integrated here
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                  <CardDescription>
                    Distribution of your portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Pie chart component will be integrated here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funds" className="space-y-4">
            <FundManagement />
          </TabsContent>

          <TabsContent value="research" className="space-y-4">
            <ResearchPanel />
          </TabsContent>

          <TabsContent value="ipo" className="space-y-4">
            <IPOPanel />
          </TabsContent>

          <TabsContent value="mutual-funds" className="space-y-4">
            <MutualFundsPanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Search Modal */}
      <SearchModal open={showSearch} onOpenChange={setShowSearch} />
    </div>
  );
}