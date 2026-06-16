/**
 * The user's profile + saved addresses + notification prefs, persisted on the
 * phone (AsyncStorage). Replaced by real Supabase accounts later.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

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
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
          } catch {
            // ignore corrupt data
          }
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile)).catch(() => {});
  }, [profile, loaded]);

  function update(patch: Partial<Profile>) {
    setProfile((p) => ({ ...p, ...patch }));
  }
  function addAddress(address: string) {
    setProfile((p) => (p.addresses.includes(address) ? p : { ...p, addresses: [...p.addresses, address] }));
  }
  function removeAddress(address: string) {
    setProfile((p) => ({ ...p, addresses: p.addresses.filter((a) => a !== address) }));
  }

  const value = useMemo<ProfileValue>(
    () => ({ profile, loaded, update, addAddress, removeAddress }),
    [profile, loaded],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
