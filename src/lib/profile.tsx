/**
 * The user's profile + saved addresses + notification prefs.
 * Name & phone sync to the Supabase `profiles` table when signed in; addresses
 * and notification prefs stay on-device for now. Falls back fully to local
 * storage when signed out / Supabase not configured.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export type Profile = {
  name: string;
  phone: string;
  addresses: string[];
  notifyOrders: boolean;
  notifyPromos: boolean;
};

const DEFAULT_PROFILE: Profile = {
  name: '',
  phone: '',
  addresses: [],
  notifyOrders: true,
  notifyPromos: false,
};

type ProfileValue = {
  profile: Profile;
  loaded: boolean;
  update: (patch: Partial<Profile>) => void;
  addAddress: (address: string) => void;
  removeAddress: (address: string) => void;
};

const STORAGE_KEY = 'swiftdrop.profile.v1';
const ProfileContext = createContext<ProfileValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, configured } = useAuth();
  const cloud = configured && !!user && !!supabase;

  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  // Load local first, then overlay cloud name/phone if signed in.
  useEffect(() => {
    let active = true;
    setLoaded(false);
    (async () => {
      let base = DEFAULT_PROFILE;
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) base = { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
      } catch {
        // ignore corrupt cache
      }
      if (cloud && supabase && user) {
        const { data } = await supabase.from('profiles').select('name, phone').eq('id', user.id).maybeSingle();
        if (data) base = { ...base, name: data.name ?? base.name, phone: data.phone ?? base.phone };
      }
      if (active) {
        setProfile(base);
        setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloud, user?.id]);

  // Cache locally on every change.
  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile)).catch(() => {});
  }, [profile, loaded]);

  function update(patch: Partial<Profile>) {
    setProfile((p) => {
      const next = { ...p, ...patch };
      // Sync name/phone to the cloud when signed in.
      if (cloud && supabase && user && (patch.name !== undefined || patch.phone !== undefined)) {
        supabase
          .from('profiles')
          .upsert({ id: user.id, name: next.name, phone: next.phone })
          .then(({ error }) => {
            if (error) console.warn('Profile save failed:', error.message);
          });
      }
      return next;
    });
  }

  function addAddress(address: string) {
    setProfile((p) => (p.addresses.includes(address) ? p : { ...p, addresses: [...p.addresses, address] }));
  }
  function removeAddress(address: string) {
    setProfile((p) => ({ ...p, addresses: p.addresses.filter((a) => a !== address) }));
  }

  const value = useMemo<ProfileValue>(
    () => ({ profile, loaded, update, addAddress, removeAddress }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, loaded, cloud, user?.id],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
