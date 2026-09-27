const products = [
    {
        id: "product-001",
        name: "Americano",
        category: "Coffee",
        price: 90,
        description: "A rich espresso coffee with hot water.",
        image: "/src/assets/images/menu/americano.png",
        badge: "popular",
        temperature: ["hot", "iced"],
        available: true,
    },

    {
        id: "product-002",
        name: "Vanilla Latte",
        category: "Non-Coffee",
        price: 120,
        description: "Smooth espresso with steamed milk and vanilla.",
        image: "/src/assets/images/menu/vanilla-latte.png",
        badge: "new",
        temperature: ["hot", "iced"],
        available: true,
    },

    {
        id: "product-003",
        name: "Matcha Latte",
        category: "Non-Coffee",
        price: 130,
        description: "Creamy matcha with your choice of milk.",
        image: "/src/assets/images/menu/matcha-latte.png",
        badge: "soldOut",
        temperature: ["iced"],
        available: false,
    },

    {
        id: "product-004",
        name: "Chocolate Cake",
        category: "Pastries",
        price: 110,
        description: "A soft and rich chocolate cake.",
        image: "/src/assets/images/menu/chocolate-cake.png",
        badge: null,
        temperature: [],
        available: true,
    },

    {
        id: "product-005",
        name: "Nutella Tiramisu",
        category: "Pastries",
        price: 180,
        description: "Classic Italian tiramisu meets the rich, hazelnut goodness of Nutella.",
        image: "/src/assets/images/menu/nutella-tiramisu.png",
        badge: "popular",
        temperature: [],
        available: true,
    },

    {
        id: "product-00",
        name: "Beef Lasagna",
        category: "Pasta",
        price: 200,
        description: "A velvety, melt-in-your-mouth Italian classic crafted with rich, decadent layers of comfort.",
        image: "/src/assets/images/menu/beef-lasagna.png",
        badge: "popular",
        temperature: [],
        available: true,
    },
];

export default products;