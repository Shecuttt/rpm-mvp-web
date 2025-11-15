// Payment methods - Dummy data, gampang diganti ke real API
export const PAYMENT_METHODS = [
  {
    id: "cod",
    name: "Cash on Delivery (COD)",
    description: "Bayar saat barang sampai",
    icon: "💵",
    enabled: true,
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    description: "Transfer ke rekening BCA, Mandiri, BNI",
    icon: "🏦",
    enabled: true,
  },
  {
    id: "ewallet_gopay",
    name: "GoPay",
    description: "Bayar pakai GoPay",
    icon: "📱",
    enabled: true,
  },
  {
    id: "ewallet_ovo",
    name: "OVO",
    description: "Bayar pakai OVO",
    icon: "💳",
    enabled: true,
  },
  {
    id: "ewallet_dana",
    name: "DANA",
    description: "Bayar pakai DANA",
    icon: "💰",
    enabled: true,
  },
  {
    id: "credit_card",
    name: "Credit/Debit Card",
    description: "Visa, Mastercard, JCB",
    icon: "💳",
    enabled: false, // Disabled dulu
  },
];

// Shipping methods - Dummy data
export const SHIPPING_METHODS = [
  {
    id: "regular",
    name: "Regular Shipping",
    description: "3-5 hari kerja",
    estimatedDays: "3-5",
    baseCost: 0, // Free for orders >= 500k
    minOrder: 500000,
    icon: "📦",
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "1-2 hari kerja",
    estimatedDays: "1-2",
    baseCost: 50000,
    minOrder: 0,
    icon: "🚀",
  },
  {
    id: "same_day",
    name: "Same Day Delivery",
    description: "Sampai hari ini (order sebelum jam 12 siang)",
    estimatedDays: "Hari ini",
    baseCost: 100000,
    minOrder: 0,
    icon: "⚡",
  },
  {
    id: "cargo",
    name: "Cargo Shipping",
    description: "5-7 hari kerja (untuk barang besar)",
    estimatedDays: "5-7",
    baseCost: 75000,
    minOrder: 0,
    icon: "🚚",
  },
];

// Helper function untuk calculate shipping cost
export function calculateShippingCost(
  subtotal: number,
  shippingMethodId: string
): number {
  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethodId);
  if (!method) return 0;

  // Free shipping jika subtotal >= minOrder
  if (subtotal >= method.minOrder && method.minOrder > 0) {
    return 0;
  }

  return method.baseCost;
}

// Helper untuk get method by ID
export function getPaymentMethod(id: string) {
  return PAYMENT_METHODS.find((m) => m.id === id);
}

export function getShippingMethod(id: string) {
  return SHIPPING_METHODS.find((m) => m.id === id);
}
