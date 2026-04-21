export const statsData = {
  revenue: { value: 284920, change: 12.5, label: 'Total Revenue' },
  orders: { value: 3842, change: 8.2, label: 'Total Orders' },
  users: { value: 12483, change: 5.7, label: 'Active Users' },
  products: { value: 647, change: -2.1, label: 'Total Products' },
};

export const revenueData = [
  { month: 'Jan', revenue: 42000, orders: 380 },
  { month: 'Feb', revenue: 38500, orders: 320 },
  { month: 'Mar', revenue: 51200, orders: 460 },
  { month: 'Apr', revenue: 47800, orders: 420 },
  { month: 'May', revenue: 63400, orders: 540 },
  { month: 'Jun', revenue: 58900, orders: 510 },
  { month: 'Jul', revenue: 71200, orders: 620 },
  { month: 'Aug', revenue: 66800, orders: 580 },
  { month: 'Sep', revenue: 78400, orders: 690 },
  { month: 'Oct', revenue: 82100, orders: 720 },
  { month: 'Nov', revenue: 91500, orders: 810 },
  { month: 'Dec', revenue: 102400, orders: 920 },
];

export const categoryData = [
  { name: 'Electronics', value: 35, color: '#0ea5e9' },
  { name: 'Fashion', value: 28, color: '#f97316' },
  { name: 'Home & Garden', value: 18, color: '#8b5cf6' },
  { name: 'Sports', value: 12, color: '#22c55e' },
  { name: 'Books', value: 7, color: '#f59e0b' },
];

export const weeklyData = [
  { day: 'Mon', visitors: 2400, sales: 180 },
  { day: 'Tue', visitors: 1398, sales: 120 },
  { day: 'Wed', visitors: 9800, sales: 390 },
  { day: 'Thu', visitors: 3908, sales: 280 },
  { day: 'Fri', visitors: 4800, sales: 340 },
  { day: 'Sat', visitors: 6800, sales: 520 },
  { day: 'Sun', visitors: 4300, sales: 310 },
];

const firstNames = ['Alice','Bob','Carol','David','Emma','Frank','Grace','Henry','Iris','Jack','Kate','Liam','Mia','Noah','Olivia','Paul','Quinn','Rachel','Sam','Tara'];
const lastNames = ['Smith','Johnson','Brown','Davis','Wilson','Moore','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin','Garcia','Thompson'];
const domains = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com'];
const avatarColors = ['bg-blue-500','bg-green-500','bg-purple-500','bg-red-500','bg-amber-500','bg-teal-500','bg-pink-500','bg-indigo-500'];

export const users = Array.from({ length: 50 }, (_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[i % lastNames.length];
  return {
    id: i + 1,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domains[i % domains.length]}`,
    role: i < 3 ? 'admin' : i < 10 ? 'moderator' : 'customer',
    status: i % 7 === 0 ? 'blocked' : 'active',
    orders: Math.floor(Math.random() * 50),
    spent: parseFloat((Math.random() * 5000).toFixed(2)),
    joined: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0],
    avatar: avatarColors[i % avatarColors.length],
    initials: `${fn[0]}${ln[0]}`,
  };
});

const productNames = ['Wireless Headphones','Smart Watch','Running Shoes','Coffee Maker','Yoga Mat','Laptop Stand','LED Desk Lamp','Protein Powder','Canvas Backpack','Mechanical Keyboard','Wireless Mouse','USB-C Hub','Phone Case','Sunglasses','Water Bottle','Resistance Bands','Air Purifier','Bluetooth Speaker','Standing Desk','Monitor','Webcam','Ring Light','Desk Organizer','Notebook Set','Travel Pillow'];
const categories = ['Electronics','Fashion','Sports','Home & Garden','Books','Health & Beauty'];
const imgColors = ['3B82F6','8B5CF6','EC4899','F97316','22C55E','EF4444','0EA5E9','F59E0B'];

export const products = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  name: productNames[i % productNames.length] + (i >= productNames.length ? ` Pro ${Math.floor(i/productNames.length)+1}` : ''),
  category: categories[i % categories.length],
  price: parseFloat((9.99 + i * 7.5 + Math.random() * 50).toFixed(2)),
  stock: Math.floor(Math.random() * 200),
  sold: Math.floor(Math.random() * 500),
  rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
  status: i % 9 === 0 ? 'out_of_stock' : i % 15 === 0 ? 'draft' : 'active',
  image: `https://placehold.co/200x200/${imgColors[i % imgColors.length]}/ffffff?text=${encodeURIComponent(productNames[i % productNames.length].split(' ')[0])}`,
  description: `High-quality ${productNames[i % productNames.length]} with premium features and excellent durability.`,
  sku: `SKU-${String(1000 + i).padStart(5, '0')}`,
}));

const orderStatuses = ['pending','processing','shipped','delivered','cancelled','refunded'];
const payMethods = ['Credit Card','PayPal','UPI','Bank Transfer','Crypto'];

export const orders = Array.from({ length: 80 }, (_, i) => {
  const user = users[i % users.length];
  const product = products[i % products.length];
  const qty = Math.floor(Math.random() * 4) + 1;
  return {
    id: `ORD-${String(10000 + i).padStart(6, '0')}`,
    user: user.name,
    userEmail: user.email,
    product: product.name,
    category: product.category,
    amount: parseFloat((product.price * qty).toFixed(2)),
    qty,
    status: orderStatuses[i % orderStatuses.length],
    paymentMethod: payMethods[i % payMethods.length],
    date: new Date(2024, Math.floor(i / 7), (i % 28) + 1).toISOString().split('T')[0],
    address: `${100 + i} Main St, City ${i % 20 + 1}, State`,
  };
});

export const transactions = Array.from({ length: 60 }, (_, i) => {
  const order = orders[i % orders.length];
  const types = ['payment','refund','payout','chargeback'];
  return {
    id: `TXN-${String(20000 + i).padStart(7, '0')}`,
    orderId: order.id,
    user: order.user,
    amount: order.amount,
    type: types[i % types.length],
    method: order.paymentMethod,
    status: i % 8 === 0 ? 'failed' : i % 12 === 0 ? 'pending' : 'success',
    date: order.date,
    fee: parseFloat((order.amount * 0.02).toFixed(2)),
  };
});

export const recentOrders = orders.slice(0, 8);
export const topProducts = products.sort((a,b) => b.sold - a.sold).slice(0, 5);
