/**
 * Orders the user has placed, kept in React Context and saved to the phone
 * (AsyncStorage) so they survive app restarts. Later this is replaced by
 * Supabase so orders sync across devices and reach riders.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type OrderType = 'package' | 'buy';

export type Order = {
  id: string;
  type: OrderType;
  title: string;
  subtitle: string;
  total: number;
  status: string;
  createdAt: number;
};

type NewOrderInput = {
  type: OrderType;
  title: string;
  subtitle: string;
  total: number;
  status?: string;
};

type OrdersValue = {
  orders: Order[];
  loaded: boolean;
  addOrder: (input: NewOrderInput) => Order;
  clear: () => void;
};

const STORAGE_KEY = 'swiftdrop.orders.v1';
const OrdersContext = createContext<OrdersValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved orders once on startup.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setOrders(JSON.parse(raw) as Order[]);
          } catch {
            // ignore corrupt data
          }
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  // Persist whenever orders change (after the initial load).
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders)).catch(() => {});
    }
  }, [orders, loaded]);

  function addOrder(input: NewOrderInput): Order {
    const order: Order = {
      id: 'ord_' + Date.now().toString(36),
      createdAt: Date.now(),
      status: input.status ?? 'Finding a rider',
      type: input.type,
      title: input.title,
      subtitle: input.subtitle,
      total: input.total,
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }

  function clear() {
    setOrders([]);
  }

  const value = useMemo<OrdersValue>(() => ({ orders, loaded, addOrder, clear }), [orders, loaded]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within an OrdersProvider');
  return ctx;
}
