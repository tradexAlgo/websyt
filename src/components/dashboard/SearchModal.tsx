'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { addToWatchlist } from '@/store/slices/stockDataSlice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, TrendingUp, TrendingDown, Star } from 'lucide-react';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'commodity';
}

export default function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock search results - in real app, this would call an API
  const mockSearchResults: SearchResult[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24, type: 'stock' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: -1.23, changePercent: -0.85, type: 'stock' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.91, change: 3.45, changePercent: 0.92, type: 'stock' },
    { symbol: 'GOLD', name: 'Gold Futures', price: 2045.30, change: 15.20, changePercent: 0.75, type: 'commodity' },
    { symbol: 'OIL', name: 'Crude Oil Futures', price: 78.45, change: -2.10, changePercent: -2.60, type: 'commodity' },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      setLoading(true);
      // Simulate API call
      const timer = setTimeout(() => {
        const filtered = mockSearchResults.filter(item =>
          item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [searchQuery]);

  const handleAddToWatchlist = async (symbol: string) => {
    await dispatch(addToWatchlist(symbol));
    setSearchQuery('');
    setSearchResults([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Stocks & Commodities</DialogTitle>
          <DialogDescription>
            Find and add stocks, commodities, and other trading instruments to your watchlist.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by symbol or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <Card key={result.symbol} className="hover:bg-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-mono font-semibold">{result.symbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {result.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {result.name}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-mono">{formatPrice(result.price)}</span>
                            <div className={`flex items-center space-x-1 ${
                              result.change >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {result.change >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              <span className="text-xs font-mono">
                                {formatPrice(result.change)} ({formatPercent(result.changePercent)})
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToWatchlist(result.symbol)}
                          className="ml-4"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="text-center py-12">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords or symbols.
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Start searching</h3>
                <p className="text-muted-foreground">
                  Enter a stock symbol or company name to begin.
                </p>
              </div>
            )}
          </div>

          {/* Popular Searches */}
          {!searchQuery && !loading && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Popular Searches</h4>
              <div className="flex flex-wrap gap-2">
                {['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'GOLD', 'OIL'].map((symbol) => (
                  <Button
                    key={symbol}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(symbol)}
                  >
                    {symbol}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}