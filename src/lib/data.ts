
export type Cuisine = {
  id: string;
  name: string;
  icon: string;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  image: string;
  description: string;
  address: string;
  deliveryFee: string;
  isOpenNow: boolean;
  distanceKm: number;
  tags: string[];
  healthScore?: number; // 0-100 indicating overall nutritional value
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
  healthTags?: string[];
};

export const CUISINES: Cuisine[] = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'italian', name: 'Italian', icon: '🍝' },
  { id: 'american', name: 'American', icon: '🍔' },
  { id: 'japanese', name: 'Japanese', icon: '🍣' },
  { id: 'indian', name: 'Indian', icon: '🍛' },
  { id: 'chinese', name: 'Chinese', icon: '🍜' },
  { id: 'healthy', name: 'Healthy', icon: '🥗' },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'La Trattoria',
    cuisine: 'Italian',
    rating: 4.8,
    deliveryTime: '25-35 min',
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&h=400&auto=format&fit=crop',
    description: 'Authentic Italian experience with handmade pasta.',
    address: '123 Pizza Way, Naples District',
    deliveryFee: 'Free',
    isOpenNow: true,
    distanceKm: 1.3,
    tags: ['Top Rated', 'Pasta', 'Family Favorite'],
    healthScore: 65,
  },
  {
    id: '2',
    name: 'Burger Craft',
    cuisine: 'American',
    rating: 4.5,
    deliveryTime: '20-30 min',
    priceRange: '$',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=600&h=400&auto=format&fit=crop',
    description: 'Gourmet burgers made with 100% grass-fed beef.',
    address: '456 Patty Lane, Downtown',
    deliveryFee: '$1.99',
    isOpenNow: true,
    distanceKm: 0.9,
    tags: ['Best Seller', 'Fast Delivery', 'Late Night'],
    healthScore: 40,
  },
  {
    id: '3',
    name: 'Sakura Sushi',
    cuisine: 'Japanese',
    rating: 4.9,
    deliveryTime: '30-45 min',
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&h=400&auto=format&fit=crop',
    description: 'Freshly prepared sushi and traditional Japanese fare.',
    address: '789 Zen Garden, Midtown',
    deliveryFee: 'Free',
    isOpenNow: true,
    distanceKm: 2.4,
    tags: ['Chef Choice', 'Premium', 'Fresh'],
  },
  {
    id: '4',
    name: 'Spice Route Kitchen',
    cuisine: 'Indian',
    rating: 4.7,
    deliveryTime: '28-38 min',
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600&h=400&auto=format&fit=crop',
    description: 'Modern Indian plates with rich spices and smoky tandoor flavors.',
    address: '88 Curry Avenue, East Village',
    deliveryFee: '$0.99',
    isOpenNow: true,
    distanceKm: 1.8,
    tags: ['Spicy', 'Vegetarian Friendly', 'Popular'],
  },
  {
    id: '5',
    name: 'Green Bowl Studio',
    cuisine: 'Healthy',
    rating: 4.6,
    deliveryTime: '18-28 min',
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&h=400&auto=format&fit=crop',
    description: 'Macro-balanced bowls, salads, and fresh-pressed juices.',
    address: '27 Wellness Street, Uptown',
    deliveryFee: 'Free',
    isOpenNow: true,
    distanceKm: 1.1,
    tags: ['Healthy', 'Low Carb', 'High Protein'],
    healthScore: 98,
  },
  {
    id: '6',
    name: 'Wok & Flame',
    cuisine: 'Chinese',
    rating: 4.4,
    deliveryTime: '22-34 min',
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&h=400&auto=format&fit=crop',
    description: 'Classic wok-fired dishes and signature chili garlic specials.',
    address: '301 Dragon Road, City Center',
    deliveryFee: '$1.49',
    isOpenNow: false,
    distanceKm: 2.1,
    tags: ['Comfort Food', 'Noodles', 'Group Meals'],
    healthScore: 55,
  },
];

export const MENU_ITEMS: Record<string, MenuItem[]> = {
  '1': [
    {
      id: 'm1',
      name: 'Margherita Pizza',
      price: 14.99,
      description: 'Fresh mozzarella, basil, tomato sauce',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 25, carbs: 110, fats: 32, calories: 850 },
      healthTags: ['Vegetarian', 'High Carb'],
    },
    {
      id: 'm2',
      name: 'Pesto Pasta',
      price: 16.5,
      description: 'Handmade fettuccine with fresh basil pesto',
      image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 18, carbs: 85, fats: 45, calories: 810 },
      healthTags: ['Vegetarian', 'High Fat'],
    },
  ],
  '2': [
    {
      id: 'm3',
      name: 'Classic Cheeseburger',
      price: 12.99,
      description: 'Beef patty, cheddar, lettuce, tomato',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 45, carbs: 38, fats: 55, calories: 950 },
      healthTags: ['High Protein', 'High Fat'],
    },
    {
      id: 'm4',
      name: 'Truffle Fries',
      price: 6.5,
      description: 'Hand-cut fries with truffle oil and parmesan',
      image: 'https://images.unsplash.com/photo-1573016608964-b49e87dc742a?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 5, carbs: 45, fats: 25, calories: 420 },
      healthTags: ['Vegetarian'],
    },
  ],
  '3': [
    {
      id: 'm5',
      name: 'Dragon Roll',
      price: 18,
      description: 'Eel, cucumber, topped with avocado',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 22, carbs: 65, fats: 14, calories: 480 },
      healthTags: ['High Protein', 'Pescatarian'],
    },
    {
      id: 'm6',
      name: 'Miso Soup',
      price: 4.5,
      description: 'Traditional Japanese soybean broth',
      image: 'https://images.unsplash.com/photo-1603515456073-7e3f2832811a?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 4, carbs: 3, fats: 1, calories: 35 },
      healthTags: ['Low Calorie', 'Vegan'],
    },
  ],
  '4': [
    {
      id: 'm7',
      name: 'Butter Chicken Bowl',
      price: 15.25,
      description: 'Creamy tomato curry with saffron basmati rice',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 35, carbs: 55, fats: 28, calories: 650 },
      healthTags: ['High Protein'],
    },
    {
      id: 'm8',
      name: 'Garlic Naan Trio',
      price: 5.95,
      description: 'Freshly baked naan with roasted garlic butter',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 8, carbs: 65, fats: 12, calories: 400 },
      healthTags: ['Vegetarian', 'High Carb'],
    },
  ],
  '5': [
    {
      id: 'm9',
      name: 'Salmon Power Bowl',
      price: 17.5,
      description: 'Roasted salmon, quinoa, avocado, greens, tahini drizzle',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 42, carbs: 35, fats: 22, calories: 510 },
      healthTags: ['Keto-Friendly', 'High Protein', 'Omega-3'],
    },
    {
      id: 'm10',
      name: 'Green Detox Juice',
      price: 7.25,
      description: 'Kale, cucumber, apple, ginger, lemon',
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 2, carbs: 28, fats: 0, calories: 120 },
      healthTags: ['Vegan', 'Detox', 'Low Calorie'],
    },
  ],
  '6': [
    {
      id: 'm11',
      name: 'Chili Garlic Noodles',
      price: 13.75,
      description: 'Hand-pulled noodles tossed with chili oil and scallions',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 12, carbs: 85, fats: 22, calories: 580 },
      healthTags: ['Vegan', 'High Carb'],
    },
    {
      id: 'm12',
      name: 'Kung Pao Tofu',
      price: 12.9,
      description: 'Crispy tofu, bell peppers, roasted peanuts, spicy sauce',
      image: 'https://images.unsplash.com/photo-1512003867696-6d5ce6835040?q=80&w=400&h=400&auto=format&fit=crop',
      macros: { protein: 28, carbs: 32, fats: 24, calories: 460 },
      healthTags: ['Vegan', 'High Protein'],
    },
  ],
};
