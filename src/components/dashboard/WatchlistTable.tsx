'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { removeFromWatchlist } from '@/store/slices/stockDataSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Star, Trash2, ExternalLink } from 'lucide-react';
import { WatchlistItem } from '@/store/slices/stockDataSlice';

interface WatchlistTableProps {
  data: WatchlistItem[];
  loading: boolean;
}

export default function WatchlistTable({ data, loading }: WatchlistTableProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemove = async (id: string) => {
    await dispatch(removeFromWatchlist(id));
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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading watchlist...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No items in watchlist</h3>
            <p className="text-muted-foreground">
              Add stocks to your watchlist to track their performance.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Change %</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">{item.symbol}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.symbol.includes('.') ? 'Commodity' : 'Stock'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={item.name}>
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end space-x-1 ${
                      item.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-mono text-sm">
                        {formatPrice(item.change)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono text-sm ${
                      item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(item.changePercent)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {item.volume ? item.volume.toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/trade/${item.symbol}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}