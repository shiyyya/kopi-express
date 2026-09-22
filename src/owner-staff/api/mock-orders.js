const MOCK_DELAY_MS = 400;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

const MOCK_ONLINE_REQUESTS = [
  {
    id: "online-1",
    customer: "Primo Morandarte",
    type: "pickup",
    status: "pending",
    items: [
      { id: "i1", name: "Chocolate Cake", price: 100, quantity: 1 },
      { id: "i2", name: "Nutella Tiramisu", price: 300, quantity: 1 },
    ],
    total: 400,
    storeBranch: "Kopi Express – Pandi Main",
    storeAddress: "Siling Bata, Pandi, Bulacan",
    pickupTime: "3:30 PM",
    paymentMethod: "Cash",
    paymentSub: "Pay upon pickup",
  },
  {
    id: "online-2",
    customer: "Primo Morandarte",
    type: "delivery",
    status: "pending",
    items: [
      { id: "i1", name: "Beef Lasagna", price: 100, quantity: 1 },
      { id: "i2", name: "Vanilla Latte", price: 300, quantity: 1 },
    ],
    total: 400,
    address: "Siling Bata, Pandi, Bulacan",
    eta: "20-35 minutes",
    paymentMethod: "GCash QR",
    referenceNumber: "1234567890123",
    paymentSub: "Scan and pay via GCash",
    subtotal: 400,
    deliveryFee: 50,
  },
  {
    id: "online-3",
    customer: "Ana Reyes",
    type: "delivery",
    status: "pending",
    items: [{ id: "i3", name: "Vanilla Latte", price: 120, quantity: 1 }],
    total: 170,
    address: "Poblacion, Pandi, Bulacan",
    eta: "15-25 minutes",
    paymentMethod: "GCash QR",
    referenceNumber: "9876543210987",
    paymentSub: "Scan and pay via GCash",
    subtotal: 120,
    deliveryFee: 50,
  },
  {
    id: "online-4",
    customer: "Mark Villanueva",
    type: "pickup",
    status: "pending",
    items: [
      { id: "i1", name: "Vanilla Latte", price: 100, quantity: 1 },
      { id: "i2", name: "Nutella Tiramisu", price: 300, quantity: 1 },
      { id: "i3", name: "Beef Lasagna", price: 120, quantity: 2 },
      { id: "i4", name: "Americano", price: 90, quantity: 1 },
    ],
    total: 1520,
    storeBranch: "Kopi Express – Pandi Main",
    storeAddress: "Siling Bata, Pandi, Bulacan",
    pickupTime: "4:00 PM",
    paymentMethod: "Cash",
    paymentSub: "Pay upon pickup",
  },
];

const MOCK_WALKIN_REQUESTS = [
  {
    id: "walkin-1",
    customer: "Juan Dela Cruz",
    type: "pickup",
    status: "pending",
    items: [{ id: "i1", name: "Cappuccino", price: 100, quantity: 2 }],
    total: 200,
  },
];

export function fetchOnlineOrderRequests() {
  return delay(MOCK_ONLINE_REQUESTS);
}

export function fetchWalkInOrderRequests() {
  return delay(MOCK_WALKIN_REQUESTS);
}

export function acceptOrderRequest(id) {
  return delay({ id, status: "accepted" });
}

export function declineOrderRequest(id) {
  return delay({ id, status: "declined" });
}
