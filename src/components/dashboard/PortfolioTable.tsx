'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';
import { Position } from '@/store/slices/stockDataSlice';

interface PortfolioTableProps {
  data: Position[];
  type: 'equity' | 'commodity';
  loading: boolean;
}

export default function PortfolioTable({ data, type, loading }: PortfolioTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const calculateTotalValue = (position: Position) => {
    return position.currentPrice * position.quantity;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading {type} positions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{type === 'equity' ? 'Stock' : 'Commodity'} Positions</span>
          <Badge variant={type === 'equity' ? 'default' : 'secondary'}>
            {data.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead className="text-right">P&L %</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">{position.symbol}</span>
                      <Badge variant="outline" className="text-xs">
                        {position.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {position.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPrice(position.avgPrice)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPrice(position.currentPrice)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {formatPrice(calculateTotalValue(position))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end space-x-1 ${
                      position.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {position.pnl >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-mono text-sm">
                        {formatPrice(position.pnl)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono text-sm ${
                      position.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(position.pnlPercent)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Handle buy more */}}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Handle sell */}}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-lg font-semibold">
                {formatPrice(data.reduce((total, pos) => total + calculateTotalValue(pos), 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p className={`text-lg font-semibold ${
                data.reduce((total, pos) => total + pos.pnl, 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPrice(data.reduce((total, pos) => total + pos.pnl, 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Best Performer</p>
              <p className="text-lg font-semibold text-green-600">
                {data.length > 0 ? 
                  formatPercent(Math.max(...data.map(pos => pos.pnlPercent))) : 
                  'N/A'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Worst Performer</p>
              <p className="text-lg font-semibold text-red-600">
                {data.length > 0 ? 
                  formatPercent(Math.min(...data.map(pos => pos.pnlPercent))) : 
                  'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}