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
      {
        id: "i1",
        name: "Cappuccino",
        price: 100,
        quantity: 1,
        category: "drink",
        temperature: "hot",
        addOns: [{ name: "Extra Shot" }, { name: "Oat Milk" }],
      },
      {
        id: "i2",
        name: "Butter Croissant",
        price: 300,
        quantity: 1,
        category: "food",
        notes: "Warmed, no butter on the side",
      },
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
      {
        id: "i1",
        name: "Cappuccino",
        price: 100,
        quantity: 1,
        category: "drink",
        temperature: "iced",
        addOns: [{ name: "Vanilla Syrup" }],
      },
      {
        id: "i2",
        name: "Butter Croissant",
        price: 300,
        quantity: 1,
        category: "food",
      },
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
    items: [
      {
        id: "i3",
        name: "Kopi Susu Gula Aren",
        price: 120,
        quantity: 1,
        category: "drink",
        temperature: "hot",
        addOns: [],
      },
    ],
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
      {
        id: "i1",
        name: "Cappuccino",
        price: 100,
        quantity: 1,
        category: "drink",
        temperature: "hot",
        addOns: [{ name: "Extra Shot" }],
      },
      {
        id: "i2",
        name: "Butter Croissant",
        price: 300,
        quantity: 1,
        category: "food",
        notes: "Cut in half",
      },
      {
        id: "i3",
        name: "Kopi Susu Gula Aren",
        price: 120,
        quantity: 2,
        category: "drink",
        temperature: "iced",
        addOns: [{ name: "Less Sugar" }, { name: "Extra Ice" }],
      },
      {
        id: "i4",
        name: "Iced Americano",
        price: 90,
        quantity: 1,
        category: "drink",
        temperature: "iced",
        addOns: [],
      },
      {
        id: "i5",
        name: "Ham & Cheese Croissant",
        price: 250,
        quantity: 1,
        category: "food",
      },
      {
        id: "i6",
        name: "Matcha Latte",
        price: 150,
        quantity: 1,
        category: "drink",
        temperature: "hot",
        addOns: [{ name: "Oat Milk" }],
      },
      {
        id: "i7",
        name: "Blueberry Muffin",
        price: 130,
        quantity: 3,
        category: "food",
        notes: "One without nuts allergy note",
      },
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
    items: [
      {
        id: "i1",
        name: "Cappuccino",
        price: 100,
        quantity: 2,
        category: "drink",
        temperature: "hot",
        addOns: [{ name: "Extra Shot" }],
      },
    ],
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
