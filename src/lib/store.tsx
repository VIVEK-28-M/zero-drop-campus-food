import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  ITEMS,
  SEED_ORDERS,
  itemById,
  type Item,
  type Order,
  type Review,
} from "./data";
import { currentPrice, MIN } from "./pricing";

export type Role = "student" | "vendor" | null;

interface NotifPrefs {
  whatsapp: boolean;
  sms: boolean;
  email: boolean;
}

interface AppState {
  hydrated: boolean;
  role: Role;
  userName: string;
  hostelBlock: string;
  orders: Order[];
  favorites: string[];
  favVendors: string[];
  priceAlerts: Record<string, boolean>;
  notif: NotifPrefs;
  customItems: Item[];
  stockLeft: Record<string, number>;
  priceOverride: Record<string, number>;
  extraReviews: Record<string, Review[]>;
  verifiedCodes: string[];
}

interface AppActions {
  login: (role: Exclude<Role, null>, name: string) => void;
  logout: () => void;
  setHostelBlock: (b: string) => void;
  placeOrder: (item: Item, qty: number, method: Order["method"], pickupSlot: string) => Order;
  cancelOrder: (id: string) => void;
  rateOrder: (id: string, rating: number, review: string, freshness: string[]) => void;
  toggleFavorite: (itemId: string) => void;
  toggleFavVendor: (vendorId: string) => void;
  setPriceAlert: (itemId: string, on: boolean) => void;
  setNotif: (key: keyof NotifPrefs, value: boolean) => void;
  addItem: (item: Omit<Item, "id" | "listedAt" | "sold">) => void;
  decrementStock: (itemId: string, by?: number) => void;
  markSoldOut: (itemId: string) => void;
  overridePrice: (itemId: string, price: number) => void;
  verifyOrder: (code: string) => boolean;
}

type Ctx = AppState & AppActions;

const AppContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "zerodrop-state-v1";

const DEFAULTS = {
  role: null as Role,
  userName: "Aarav Verma",
  hostelBlock: "H4 · Satpura",
  orders: SEED_ORDERS,
  favorites: ["i2", "i9"],
  favVendors: ["v5"],
  priceAlerts: { i2: true } as Record<string, boolean>,
  notif: { whatsapp: true, sms: false, email: true },
  customItems: [] as Item[],
  stockLeft: {} as Record<string, number>,
  priceOverride: {} as Record<string, number>,
  extraReviews: {} as Record<string, Review[]>,
  verifiedCodes: [] as string[],
};

function genCode() {
  const chars = "ABCDEFGHJKMNPQRSTVWXYZ123456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `ZD-${s}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState(DEFAULTS);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({ ...DEFAULTS, ...parsed });
      }
    } catch {
      /* ignore corrupt state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* storage full — ignore */
      }
    }, 200);
  }, [state, hydrated]);

  const patch = useCallback((p: Partial<typeof DEFAULTS>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const login = useCallback(
    (role: Exclude<Role, null>, name: string) => {
      patch({ role, userName: name });
      toast.success(`Welcome back, ${name.split(" ")[0]}!`, {
        description: role === "vendor" ? "Vendor console unlocked." : "Happy rescuing!",
      });
    },
    [patch]
  );

  const logout = useCallback(() => {
    patch({ role: null });
    toast("Signed out", { description: "See you at the next clearance drop." });
  }, [patch]);

  const placeOrder = useCallback(
    (item: Item, qty: number, method: Order["method"], pickupSlot: string) => {
      const now = Date.now();
      const order: Order = {
        id: `o-${now}`,
        code: genCode(),
        itemId: item.id,
        itemName: item.name,
        vendorId: item.vendorId,
        qty,
        pricePaid: currentPrice(item, now),
        basePrice: item.basePrice,
        status: "pending",
        placedAt: now,
        pickupBy: now + 45 * MIN,
        method,
        pickupSlot,
      };
      setState((s) => ({
        ...s,
        orders: [order, ...s.orders],
        stockLeft: {
          ...s.stockLeft,
          [item.id]: (s.stockLeft[item.id] ?? item.quantity) - qty,
        },
      }));
      return order;
    },
    []
  );

  const cancelOrder = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)),
    }));
    toast("Order cancelled", { description: "Refund initiated to your original payment method." });
  }, []);

  const rateOrder = useCallback(
    (id: string, rating: number, review: string, freshness: string[]) => {
      setState((s) => {
        const orders = s.orders.map((o) =>
          o.id === id ? { ...o, rating, review, freshness } : o
        );
        const order = s.orders.find((o) => o.id === id);
        const extraReviews = { ...s.extraReviews };
        if (order) {
          const list = extraReviews[order.itemId] ?? [];
          extraReviews[order.itemId] = [
            {
              id: `rev-${Date.now()}`,
              author: s.userName,
              rating,
              text: review,
              tags: freshness,
              date: "Just now",
            },
            ...list,
          ];
        }
        return { ...s, orders, extraReviews };
      });
      toast.success("Review submitted!", { description: "Thanks for helping the community pick better." });
    },
    []
  );

  const toggleFavorite = useCallback((itemId: string) => {
    setState((s) => {
      const on = !s.favorites.includes(itemId);
      const item = itemById(itemId, s.customItems);
      toast(on ? "Added to favorites" : "Removed from favorites", {
        description: item ? item.name : undefined,
      });
      return {
        ...s,
        favorites: on ? [...s.favorites, itemId] : s.favorites.filter((f) => f !== itemId),
      };
    });
  }, []);

  const toggleFavVendor = useCallback((vendorId: string) => {
    setState((s) => {
      const on = !s.favVendors.includes(vendorId);
      toast(on ? "Canteen followed" : "Canteen unfollowed");
      return {
        ...s,
        favVendors: on ? [...s.favVendors, vendorId] : s.favVendors.filter((v) => v !== vendorId),
      };
    });
  }, []);

  const setPriceAlert = useCallback((itemId: string, on: boolean) => {
    setState((s) => ({ ...s, priceAlerts: { ...s.priceAlerts, [itemId]: on } }));
    toast(on ? "Price-drop alerts on" : "Price-drop alerts off", {
      description: on ? "We'll ping you on WhatsApp when the price drops." : undefined,
    });
  }, []);

  const setNotif = useCallback((key: keyof NotifPrefs, value: boolean) => {
    setState((s) => ({ ...s, notif: { ...s.notif, [key]: value } }));
    toast("Preference saved");
  }, []);

  const addItem = useCallback((item: Omit<Item, "id" | "listedAt" | "sold">) => {
    const newItem: Item = { ...item, id: `c-${Date.now()}`, listedAt: Date.now(), sold: 0 };
    setState((s) => ({ ...s, customItems: [newItem, ...s.customItems] }));
    toast.success("Item listed!", { description: `${item.name} is live on the marketplace.` });
  }, []);

  const decrementStock = useCallback((itemId: string, by = 1) => {
    setState((s) => {
      const item = itemById(itemId, s.customItems);
      const current = s.stockLeft[itemId] ?? item?.quantity ?? 0;
      const next = Math.max(0, current - by);
      if (next === 0) toast("Item sold out", { description: item?.name });
      return { ...s, stockLeft: { ...s.stockLeft, [itemId]: next } };
    });
  }, []);

  const markSoldOut = useCallback((itemId: string) => {
    setState((s) => ({ ...s, stockLeft: { ...s.stockLeft, [itemId]: 0 } }));
    toast("Marked as sold out");
  }, []);

  const overridePrice = useCallback((itemId: string, price: number) => {
    setState((s) => ({ ...s, priceOverride: { ...s.priceOverride, [itemId]: price } }));
    toast.success("Price overridden", { description: "Dynamic decay paused for this item." });
  }, []);

  const verifyOrder = useCallback((code: string) => {
    let found = false;
    setState((s) => {
      const match = s.orders.find((o) => o.code.toUpperCase() === code.toUpperCase() && o.status === "pending");
      if (match) {
        found = true;
        return {
          ...s,
          orders: s.orders.map((o) => (o.id === match.id ? { ...o, status: "completed" } : o)),
          verifiedCodes: [...s.verifiedCodes, code.toUpperCase()],
        };
      }
      const inQueue = ["ZD-4F8K2M", "ZD-5M8K1L", "ZD-8T2W6N"].includes(code.toUpperCase());
      if (inQueue && !s.verifiedCodes.includes(code.toUpperCase())) {
        found = true;
        return { ...s, verifiedCodes: [...s.verifiedCodes, code.toUpperCase()] };
      }
      return s;
    });
    return found;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      hydrated,
      ...state,
      login,
      logout,
      setHostelBlock: (b) => patch({ hostelBlock: b }),
      placeOrder,
      cancelOrder,
      rateOrder,
      toggleFavorite,
      toggleFavVendor,
      setPriceAlert,
      setNotif,
      addItem,
      decrementStock,
      markSoldOut,
      overridePrice,
      verifyOrder,
    }),
    [hydrated, state, login, logout, patch, placeOrder, cancelOrder, rateOrder, toggleFavorite, toggleFavVendor, setPriceAlert, setNotif, addItem, decrementStock, markSoldOut, overridePrice, verifyOrder]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function useStock(item: Item, stockLeft: Record<string, number>) {
  return stockLeft[item.id] ?? item.quantity;
}

export { ITEMS };
