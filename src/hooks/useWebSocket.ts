'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { updateStockPrice } from '@/store/slices/stockDataSlice';

interface WebSocketMessage {
  data: any;
}

export const useWebSocket = (url: string, symbols: string[]) => {
  const dispatch = useDispatch<AppDispatch>();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts.current = 0;
        
        // Subscribe to symbols
        if (symbols.length > 0) {
          wsRef.current?.send(JSON.stringify({
            subscribe: symbols,
          }));
        }
      };

      wsRef.current.onmessage = (event: WebSocketMessage) => {
        try {
          const data = JSON.parse(event.data);
          
          // Process stock price updates
          if (data && data.s && data.p && data.c) {
            const symbol = data.s;
            const price = data.p;
            const change = data.c;
            const changePercent = ((change / (price - change)) * 100);

            dispatch(updateStockPrice({
              symbol,
              price,
              change,
              changePercent,
            }));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`);
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [url, symbols, dispatch]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const subscribe = useCallback((newSymbols: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        subscribe: newSymbols,
      }));
    }
  }, []);

  const unsubscribe = useCallback((symbolsToRemove: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        unsubscribe: symbolsToRemove,
      }));
    }
  }, []);

  useEffect(() => {
    if (symbols.length > 0) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, symbols.length]);

  useEffect(() => {
    // Update subscription when symbols change
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      subscribe(symbols);
    }
  }, [symbols, subscribe]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    subscribe,
    unsubscribe,
    disconnect,
  };
};