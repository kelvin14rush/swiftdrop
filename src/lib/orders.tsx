/**
 * Orders. When the user is signed in (Supabase configured + session), orders live
 * in the cloud `orders` table and sync across devices. Otherwise they fall back to
 * on-device storage (AsyncStorage). Adds are optimistic so the UI updates instantly.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export type OrderType = 'package' | 'buy';

export type Order = {
  id: string;
  type: OrderType;
  title: string;
  subtitle: string;
  total: number;
  status: string;
  pin: string;
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

function makePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToOrder(r: any): Order {
  return {
    id: String(r.id),
    type: r.type,
    title: r.title,
    subtitle: r.subtitle,
    total: Number(r.total),
    status: r.status,
    pin: r.pin,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
  };
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user, configured } = useAuth();
  const cloud = configured && !!user && !!supabase;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function fetchCloud() {
    if (!supabase) return;
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) setOrders(data.map(rowToOrder));
  }

  // Load orders whenever the cloud/auth status changes.
  useEffect(() => {
    let active = true;
    setLoaded(false);

    if (cloud) {
      fetchCloud().finally(() => {
        if (active) setLoaded(true);
      });
    } else {
      AsyncStorage.getItem(STORAGE_KEY)
        .then((raw) => {
          if (!active) return;
          if (raw) {
            try {
              setOrders(JSON.parse(raw) as Order[]);
            } catch {
              setOrders([]);
            }
          } else {
            setOrders([]);
          }
        })
        .finally(() => {
          if (active) setLoaded(true);
        });
    }

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloud, user?.id]);

  // Persist locally only in local mode (cloud is the source of truth otherwise).
  useEffect(() => {
    if (loaded && !cloud) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders)).catch(() => {});
  }, [orders, loaded, cloud]);

  function addOrder(input: NewOrderInput): Order {
    const order: Order = {
      id: (cloud ? 'tmp_' : 'ord_') + Date.now().toString(36),
      createdAt: Date.now(),
      status: input.status ?? 'Finding a rider',
      pin: makePin(),
      type: input.type,
      title: input.title,
      subtitle: input.subtitle,
      total: input.total,
    };

    // Optimistic: show it immediately.
    setOrders((prev) => [order, ...prev]);

    if (cloud && supabase && user) {
      supabase
        .from('orders')
        .insert({
          user_id: user.id,
          type: order.type,
          title: order.title,
          subtitle: order.subtitle,
          total: order.total,
          status: order.status,
          pin: order.pin,
        })
        .then(({ error }) => {
          if (error) {
            console.warn('Order save failed:', error.message);
            return;
          }
          // Reconcile temp row with the canonical cloud rows.
          fetchCloud();
        });
    }

    return order;
  }

  function clear() {
    setOrders([]);
    if (!cloud) AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }

  const value = useMemo<OrdersValue>(() => ({ orders, loaded, addOrder, clear }), [orders, loaded, cloud, user?.id]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within an OrdersProvider');
  return ctx;
}
