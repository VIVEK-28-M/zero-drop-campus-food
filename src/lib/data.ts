import { MIN } from "./pricing";
import imgDosa from "@/assets/items/dosa.jpg";
import imgBiryani from "@/assets/items/biryani.jpg";
import imgRoll from "@/assets/items/roll.jpg";
import imgThali from "@/assets/items/thali.jpg";
import imgSamosa from "@/assets/items/samosa.jpg";
import imgCoffee from "@/assets/items/coffee.jpg";
import imgNoodles from "@/assets/items/noodles.jpg";
import imgSandwich from "@/assets/items/sandwich.jpg";
import imgFruit from "@/assets/items/fruit.jpg";
import imgRice from "@/assets/items/rice.jpg";

export type DietTag = "Veg" | "Non-Veg" | "Jain" | "Bakery" | "Vegan" | "Beverage";
export type DecayPreset = "standard" | "aggressive";

export interface Vendor {
  id: string;
  name: string;
  block: string;
  zone: string;
  stall: string;
  rating: number;
  ratingCount: number;
  fssai: string;
  whatsapp: string;
}

export interface Item {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  tags: DietTag[];
  image: string;
  basePrice: number;
  floorPrice: number;
  listedAt: number;
  closesAt: number;
  stepMs: number;
  preset: DecayPreset;
  quantity: number;
  sold: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  tags: string[];
  date: string;
}

export type OrderStatus = "pending" | "completed" | "cancelled";

export interface Order {
  id: string;
  code: string;
  itemId: string;
  itemName: string;
  vendorId: string;
  qty: number;
  pricePaid: number;
  basePrice: number;
  status: OrderStatus;
  placedAt: number;
  pickupBy: number;
  method: "counter" | "upi" | "wallet" | "card";
  pickupSlot: string;
  rating?: number;
  review?: string;
  freshness?: string[];
}

const NOW = Date.now();

export const VENDORS: Vendor[] = [
  { id: "v1", name: "South Stories", block: "Block A · Main Canteen", zone: "Academic Zone", stall: "A-03", rating: 4.6, ratingCount: 312, fssai: "10423998000147", whatsapp: "919876543210" },
  { id: "v2", name: "Spice Route", block: "Block B · Food Court", zone: "Academic Zone", stall: "B-11", rating: 4.4, ratingCount: 268, fssai: "10423998000231", whatsapp: "919876543211" },
  { id: "v3", name: "Wrap Works", block: "Block C · Lounge Kiosk", zone: "Hostel Zone", stall: "C-02", rating: 4.2, ratingCount: 154, fssai: "10423998000312", whatsapp: "919876543212" },
  { id: "v4", name: "Annapurna Mess", block: "Hostel H4 · Mess Hall", zone: "Hostel Zone", stall: "H4-M1", rating: 4.7, ratingCount: 421, fssai: "10423998000456", whatsapp: "919876543213" },
  { id: "v5", name: "Bake & Bite", block: "Block A · Bakery Corner", zone: "Academic Zone", stall: "A-07", rating: 4.5, ratingCount: 236, fssai: "10423998000589", whatsapp: "919876543214" },
  { id: "v6", name: "Brew Lab", block: "Library Plaza · Kiosk", zone: "Library Plaza", stall: "L-01", rating: 4.3, ratingCount: 189, fssai: "10423998000674", whatsapp: "919876543215" },
  { id: "v7", name: "Dragon Wok", block: "Block B · Food Court", zone: "Academic Zone", stall: "B-14", rating: 4.1, ratingCount: 142, fssai: "10423998000790", whatsapp: "919876543216" },
  { id: "v8", name: "Fresh Press", block: "Sports Complex · Juice Bar", zone: "Sports Zone", stall: "S-01", rating: 4.8, ratingCount: 98, fssai: "10423998000855", whatsapp: "919876543217" },
];

export const vendorById = (id: string) => VENDORS.find((v) => v.id === id);

const std = 30 * MIN;
const agg = 10 * MIN;

export const ITEMS: Item[] = [
  { id: "i1", vendorId: "v1", name: "Masala Dosa", description: "Crisp golden dosa with spiced potato filling, coconut chutney & sambar. Made fresh for the dinner rush.", tags: ["Veg"], image: imgDosa, basePrice: 60, floorPrice: 24, listedAt: NOW - 42 * MIN, closesAt: NOW + 78 * MIN, stepMs: std, preset: "standard", quantity: 14, sold: 6 },
  { id: "i2", vendorId: "v2", name: "Chicken Biryani Bowl", description: "Dum-style biryani with tender chicken, mint raita and fried onions. Surplus from the lunch batch.", tags: ["Non-Veg"], image: imgBiryani, basePrice: 120, floorPrice: 45, listedAt: NOW - 55 * MIN, closesAt: NOW + 50 * MIN, stepMs: agg, preset: "aggressive", quantity: 8, sold: 11 },
  { id: "i3", vendorId: "v3", name: "Paneer Kathi Roll", description: "Flaky paratha wrap stuffed with smoky paneer tikka, onions and mint chutney.", tags: ["Veg"], image: imgRoll, basePrice: 80, floorPrice: 30, listedAt: NOW - 30 * MIN, closesAt: NOW + 120 * MIN, stepMs: std, preset: "standard", quantity: 11, sold: 4 },
  { id: "i4", vendorId: "v4", name: "Veg Thali (Jain option)", description: "Full mess thali: dal, seasonal sabzi, paneer curry, rice, 2 rotis, salad & papad. Jain prep available.", tags: ["Veg", "Jain"], image: imgThali, basePrice: 90, floorPrice: 35, listedAt: NOW - 70 * MIN, closesAt: NOW + 95 * MIN, stepMs: std, preset: "standard", quantity: 20, sold: 9 },
  { id: "i5", vendorId: "v5", name: "Samosa (4 pc)", description: "Flaky samosas with tangy tamarind & green chutneys. End-of-day bakery clearance.", tags: ["Veg", "Bakery"], image: imgSamosa, basePrice: 40, floorPrice: 12, listedAt: NOW - 48 * MIN, closesAt: NOW + 42 * MIN, stepMs: agg, preset: "aggressive", quantity: 26, sold: 14 },
  { id: "i6", vendorId: "v6", name: "Cold Coffee 300ml", description: "Slow-brewed cold coffee with cream swirl. Batch brewed at 4 PM, must go tonight.", tags: ["Beverage", "Veg"], image: imgCoffee, basePrice: 70, floorPrice: 25, listedAt: NOW - 35 * MIN, closesAt: NOW + 135 * MIN, stepMs: std, preset: "standard", quantity: 9, sold: 7 },
  { id: "i7", vendorId: "v7", name: "Veg Hakka Noodles", description: "Wok-tossed noodles with crunchy vegetables and burnt garlic. Prepared for the evening crowd.", tags: ["Veg"], image: imgNoodles, basePrice: 75, floorPrice: 28, listedAt: NOW - 52 * MIN, closesAt: NOW + 58 * MIN, stepMs: agg, preset: "aggressive", quantity: 12, sold: 5 },
  { id: "i8", vendorId: "v5", name: "Grilled Cheese Sandwich", description: "Triple-layer grilled sandwich with cheese, tomato, cucumber & mint mayo.", tags: ["Veg", "Bakery"], image: imgSandwich, basePrice: 55, floorPrice: 18, listedAt: NOW - 25 * MIN, closesAt: NOW + 100 * MIN, stepMs: std, preset: "standard", quantity: 15, sold: 3 },
  { id: "i9", vendorId: "v8", name: "Fruit Chaat Bowl", description: "Seasonal fruit bowl with chaat masala — mango, apple, pomegranate & mint.", tags: ["Vegan", "Veg"], image: imgFruit, basePrice: 50, floorPrice: 20, listedAt: NOW - 40 * MIN, closesAt: NOW + 45 * MIN, stepMs: agg, preset: "aggressive", quantity: 7, sold: 6 },
  { id: "i10", vendorId: "v7", name: "Egg Fried Rice", description: "Smoky wok fried rice with scrambled egg and spring onions.", tags: ["Non-Veg"], image: imgRice, basePrice: 85, floorPrice: 32, listedAt: NOW - 60 * MIN, closesAt: NOW + 110 * MIN, stepMs: std, preset: "standard", quantity: 10, sold: 8 },
];

export const itemById = (id: string, custom: Item[] = []) =>
  [...ITEMS, ...custom].find((i) => i.id === id);

export const REVIEWS: Record<string, Review[]> = {
  i1: [
    { id: "r1", author: "Ananya S.", rating: 5, text: "Still crispy when I picked it up! Unreal value at ₹29.", tags: ["Fresh", "Hot"], date: "2 days ago" },
    { id: "r2", author: "Rahul M.", rating: 4, text: "Chutney portion was small but dosa was great.", tags: ["Good value"], date: "4 days ago" },
  ],
  i2: [
    { id: "r3", author: "Ishaan K.", rating: 5, text: "Biryani was steaming hot. Grabbed it at 60% off.", tags: ["Fresh", "Generous portion"], date: "1 day ago" },
    { id: "r4", author: "Priya D.", rating: 4, text: "Slightly spicy for me but quality was top notch.", tags: ["Spicy"], date: "3 days ago" },
  ],
  i4: [
    { id: "r5", author: "Meera J.", rating: 5, text: "Jain thali was properly separated. Very hygienic packing.", tags: ["Hygienic", "Jain-friendly"], date: "1 day ago" },
  ],
  i5: [
    { id: "r6", author: "Dev P.", rating: 4, text: "Samosas at ₹12 is basically free. Crisp even at 8 PM.", tags: ["Good value", "Crisp"], date: "5 days ago" },
  ],
  i9: [
    { id: "r7", author: "Sara A.", rating: 5, text: "Fruit was fresh and cold. Love the chaat masala kick.", tags: ["Fresh", "Healthy"], date: "2 days ago" },
  ],
};

export const SEED_ORDERS: Order[] = [
  { id: "o1", code: "ZD-4F8K2M", itemId: "i5", itemName: "Samosa (4 pc)", vendorId: "v5", qty: 2, pricePaid: 15, basePrice: 40, status: "pending", placedAt: NOW - 18 * MIN, pickupBy: NOW + 40 * MIN, method: "upi", pickupSlot: "Today · 7:30–8:00 PM" },
  { id: "o2", code: "ZD-9H3T7Q", itemId: "i2", itemName: "Chicken Biryani Bowl", vendorId: "v2", qty: 1, pricePaid: 54, basePrice: 120, status: "completed", placedAt: NOW - 26 * 60 * MIN, pickupBy: NOW - 25 * 60 * MIN, method: "counter", pickupSlot: "Yesterday · 1:00–1:30 PM" },
  { id: "o3", code: "ZD-2B6N4X", itemId: "i4", itemName: "Veg Thali (Jain option)", vendorId: "v4", qty: 1, pricePaid: 42, basePrice: 90, status: "completed", placedAt: NOW - 50 * 60 * MIN, pickupBy: NOW - 49 * 60 * MIN, method: "wallet", pickupSlot: "2 days ago · 8:00–8:30 PM", rating: 5, review: "Hot, fresh and half price. ZeroDrop is a cheat code.", freshness: ["Fresh", "Hot"] },
  { id: "o4", code: "ZD-7C1P9R", itemId: "i6", itemName: "Cold Coffee 300ml", vendorId: "v6", qty: 1, pricePaid: 35, basePrice: 70, status: "cancelled", placedAt: NOW - 74 * 60 * MIN, pickupBy: NOW - 73 * 60 * MIN, method: "upi", pickupSlot: "3 days ago · 5:00–5:30 PM" },
];

export const ZONES = ["All Zones", "Academic Zone", "Hostel Zone", "Library Plaza", "Sports Zone"];
export const DIET_FILTERS: DietTag[] = ["Veg", "Non-Veg", "Jain", "Bakery", "Vegan", "Beverage"];

export const CAMPUS_STATS = {
  mealsRescued: 12847,
  kgSaved: 4624,
  co2Offset: 11.6,
  moneySaved: 486230,
  canteens: 14,
};

export const LEADERBOARD = [
  { name: "Annapurna Mess", kg: 812, meals: 2320, recovered: 68400 },
  { name: "South Stories", kg: 654, meals: 1870, recovered: 51200 },
  { name: "Bake & Bite", kg: 521, meals: 1735, recovered: 44800 },
  { name: "Spice Route", kg: 498, meals: 1420, recovered: 52100 },
  { name: "Dragon Wok", kg: 402, meals: 1150, recovered: 38600 },
  { name: "Brew Lab", kg: 344, meals: 1310, recovered: 29700 },
  { name: "Wrap Works", kg: 289, meals: 826, recovered: 24500 },
  { name: "Fresh Press", kg: 210, meals: 700, recovered: 18200 },
];

export const PEAK_HOURS = [
  { hour: "8 AM", cleared: 22 }, { hour: "10 AM", cleared: 41 }, { hour: "12 PM", cleared: 68 },
  { hour: "2 PM", cleared: 96 }, { hour: "4 PM", cleared: 74 }, { hour: "6 PM", cleared: 118 },
  { hour: "8 PM", cleared: 143 }, { hour: "10 PM", cleared: 87 },
];

export const WEEKLY_SALES = [
  { day: "Mon", recovered: 4200, orders: 61 }, { day: "Tue", recovered: 5100, orders: 74 },
  { day: "Wed", recovered: 4700, orders: 68 }, { day: "Thu", recovered: 6300, orders: 89 },
  { day: "Fri", recovered: 7800, orders: 104 }, { day: "Sat", recovered: 5600, orders: 77 },
  { day: "Sun", recovered: 3900, orders: 52 },
];

export const PAYOUTS = [
  { id: "TXN-88213", date: "Today · 1:12 PM", method: "UPI", amount: 342, orders: 9, status: "Settled" },
  { id: "TXN-88192", date: "Yesterday", method: "UPI + Wallet", amount: 1218, orders: 31, status: "Settled" },
  { id: "TXN-88156", date: "2 days ago", method: "UPI", amount: 964, orders: 24, status: "Settled" },
  { id: "TXN-88120", date: "3 days ago", method: "Card + UPI", amount: 1455, orders: 38, status: "Settled" },
  { id: "TXN-88077", date: "4 days ago", method: "UPI", amount: 782, orders: 19, status: "Processing" },
  { id: "TXN-88031", date: "5 days ago", method: "Wallet", amount: 1104, orders: 27, status: "Settled" },
];

export const VENDOR_VERIFY_QUEUE = [
  { code: "ZD-4F8K2M", student: "Aarav V. · 22BCS1041", item: "Samosa (4 pc) × 2", slot: "7:30–8:00 PM", method: "UPI · Paid" },
  { code: "ZD-5M8K1L", student: "Diya R. · 23BEC087", item: "Grilled Cheese Sandwich × 1", slot: "8:00–8:30 PM", method: "Pay at Counter" },
  { code: "ZD-8T2W6N", student: "Kabir S. · 21BME233", item: "Cold Coffee 300ml × 2", slot: "8:15–8:45 PM", method: "Campus Wallet" },
];

export const HOSTEL_BLOCKS = ["H1 · Aravali", "H2 · Nilgiri", "H3 · Vindhya", "H4 · Satpura", "H5 · Shivalik", "Day Scholar"];
