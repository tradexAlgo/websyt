'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { buyStock, sellStock } from '@/store/slices/stockDataSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface TradingPanelProps {
  symbol: string;
  currentPrice: number;
  name: string;
}

export default function TradingPanel({ symbol, currentPrice, name }: TradingPanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    const price = orderType === 'market' ? currentPrice : parseFloat(limitPrice) || 0;
    return qty * price;
  };

  const handleTrade = async () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      setError('Please enter a valid limit price');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const orderData = {
      symbol,
      quantity: parseFloat(quantity),
      ...(orderType === 'limit' && { price: parseFloat(limitPrice) }),
      orderType,
    };

    try {
      const result = await dispatch(activeTab === 'buy' ? buyStock(orderData) : sellStock(orderData));
      
      if (result.meta.requestStatus === 'fulfilled') {
        setSuccess(`${activeTab === 'buy' ? 'Buy' : 'Sell'} order placed successfully!`);
        setQuantity('');
        setLimitPrice('');
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trade {symbol}</span>
          <Badge variant="outline">{name}</Badge>
        </CardTitle>
        <CardDescription>
          Current Price: <span className="font-semibold">${currentPrice.toFixed(2)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="text-green-600 data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="text-red-600 data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
              <TrendingDown className="h-4 w-4 mr-2" />
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-quantity">Quantity</Label>
              <Input
                id="buy-quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Order Type</Label>
              <Select value={orderType} onValueChange={(value) => setOrderType(value as 'market' | 'limit')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orderType === 'limit' && (
              <div className="space-y-2">
                <Label htmlFor="buy-limit-price">Limit Price</Label>
                <Input
                  id="buy-limit-price"
                  type="number"
                  placeholder="Enter limit price"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Estimated Total:</span>
                <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              onClick={handleTrade}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Buy Order'}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-quantity">Quantity</Label>
              <Input
                id="sell-quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Order Type</Label>
              <Select value={orderType} onValueChange={(value) => setOrderType(value as 'market' | 'limit')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orderType === 'limit' && (
              <div className="space-y-2">
                <Label htmlFor="sell-limit-price">Limit Price</Label>
                <Input
                  id="sell-limit-price"
                  type="number"
                  placeholder="Enter limit price"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Estimated Total:</span>
                <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full bg-red-600 hover:bg-red-700" 
              onClick={handleTrade}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Sell Order'}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Market orders execute immediately at the current market price</p>
          <p>• Limit orders execute only when the price reaches your specified level</p>
          <p>• All orders are subject to market availability and timing</p>
        </div>
      </CardContent>
    </Card>
  );
}