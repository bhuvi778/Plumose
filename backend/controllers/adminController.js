import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';

const pic = (seed, w = 800, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const HERBAL_CATEGORIES = [
  { name: 'Immunity Boosters', slug: 'immunity-boosters', icon: '💪', description: 'Chyawanprash, Giloy, Tulsi and more for daily immunity.', image: pic('chyawanprash-ayurveda', 800, 500) },
  { name: 'Herbal Teas', slug: 'herbal-teas', icon: '🍵', description: 'Tulsi, chamomile, green, lemongrass — pure herbal infusions.', image: pic('herbal-tea-leaves', 800, 500) },
  { name: 'Essential Oils', slug: 'essential-oils', icon: '🌿', description: 'Cold-pressed neem, coconut, eucalyptus and aromatherapy oils.', image: pic('essential-oils-bottles', 800, 500) },
  { name: 'Ayurvedic Medicines', slug: 'ayurvedic-medicines', icon: '🧪', description: 'Classical Ayush-certified churnas, tablets and asavas.', image: pic('ayurvedic-medicine', 800, 500) },
  { name: 'Natural Skincare', slug: 'natural-skincare', icon: '🧴', description: 'Neem face wash, aloe vera gel, herbal face packs.', image: pic('natural-skincare-green', 800, 500) },
  { name: 'Hair Care', slug: 'hair-care', icon: '💇', description: 'Amla, bhringraj, onion oil — natural hair solutions.', image: pic('herbal-hair-oil', 800, 500) },
  { name: 'Superfoods', slug: 'superfoods', icon: '🥗', description: 'Moringa, wheatgrass, flax seeds and protein powders.', image: pic('moringa-superfood', 800, 500) },
  { name: 'Digestive Wellness', slug: 'digestive-wellness', icon: '🌱', description: 'Triphala, ajwain, hing, isabgol — gut-friendly herbs.', image: pic('digestive-herbs', 800, 500) },
];

const HERBAL_PRODUCTS = {
  'immunity-boosters': [
    { name: 'Dabur Chyawanprash - 1kg Awaleha', price: 349, mrp: 495, stock: 100, bestseller: true, featured: true, shortDescription: 'Classical amla-based immunity tonic.', description: 'Authentic Chyawanprash made with 40+ Ayurvedic herbs including Amla, Ashwagandha, Pippali and Guduchi.' },
    { name: 'Giloy Tulsi Immunity Drops - 30ml', price: 199, mrp: 299, stock: 150, trending: true, shortDescription: 'Concentrated giloy-tulsi drops.', description: 'Potent herbal drops with Giloy and Tulsi extracts — daily immunity shield.' },
    { name: 'Ashwagandha Tablets - 60 Caps', price: 399, mrp: 599, stock: 90, bestseller: true, shortDescription: 'Pure KSM-66 ashwagandha caps.', description: 'High-potency Ashwagandha KSM-66 capsules for stress relief, stamina and immunity.' },
    { name: 'Amla Juice - Cold Pressed - 500ml', price: 249, mrp: 349, stock: 110, shortDescription: '100% pure amla juice.', description: 'Sugar-free cold-pressed Amla juice. Vitamin C powerhouse for skin, hair and immunity.' },
    { name: 'Tulsi Drops - Panch Tulsi - 30ml', price: 149, mrp: 229, stock: 180, shortDescription: '5 types of tulsi in one bottle.', description: 'Concentrated Panch Tulsi drops — daily respiratory and immunity support.' },
  ],
  'herbal-teas': [
    { name: 'Organic Tulsi Green Tea - 100 Bags', price: 299, mrp: 449, stock: 120, bestseller: true, shortDescription: 'Antioxidant tulsi-green tea blend.', description: 'Organic tulsi green tea — daily cup of immunity and calm.' },
    { name: 'Chamomile Relaxation Tea - 50 Bags', price: 249, mrp: 349, stock: 80, trending: true, shortDescription: 'Pure chamomile for deep sleep.', description: 'Handpicked chamomile flower tea — soothing evening ritual for better sleep.' },
    { name: 'Ashwagandha Moon Milk Mix - 100g', price: 349, mrp: 499, stock: 60, shortDescription: 'Ayurvedic bedtime latte mix.', description: 'Warming Ashwagandha + cardamom + nutmeg + cinnamon mix for bedtime moon milk.' },
    { name: 'Lemongrass & Ginger Tea - 100g', price: 179, mrp: 249, stock: 100, shortDescription: 'Refreshing lemongrass-ginger loose tea.', description: 'Zesty loose-leaf lemongrass and ginger tea — energising morning brew.' },
    { name: 'Masala Chai - Artisan Blend - 200g', price: 229, mrp: 329, stock: 140, shortDescription: 'Real Indian masala chai.', description: 'Hand-crushed cardamom, clove, cinnamon, pepper and ginger Assam tea blend.' },
  ],
  'essential-oils': [
    { name: 'Pure Coconut Oil - Cold Pressed - 500ml', price: 399, mrp: 599, stock: 100, bestseller: true, shortDescription: 'Virgin coconut oil for skin & hair.', description: '100% virgin, cold-pressed coconut oil — multi-use for hair, skin, cooking and oil-pulling.' },
    { name: 'Neem Oil - Pure Cold-Pressed - 100ml', price: 249, mrp: 399, stock: 120, shortDescription: 'Antibacterial neem oil.', description: 'Pure neem oil — natural antibacterial for skin, hair and garden.' },
    { name: 'Eucalyptus Essential Oil - 15ml', price: 299, mrp: 449, stock: 80, trending: true, shortDescription: 'Therapeutic grade eucalyptus.', description: 'Steam-distilled eucalyptus essential oil — for diffusers, steam inhalation and pain relief.' },
    { name: 'Lavender Essential Oil - 15ml', price: 399, mrp: 599, stock: 70, shortDescription: 'Pure lavender for calm & sleep.', description: 'Therapeutic grade lavender essential oil — aromatherapy and relaxation.' },
    { name: 'Tea Tree Oil - 15ml', price: 349, mrp: 499, stock: 90, shortDescription: 'Anti-acne tea tree oil.', description: 'Pure tea tree essential oil — anti-acne, scalp cleanser, natural disinfectant.' },
  ],
  'ayurvedic-medicines': [
    { name: 'Triphala Churna - 500g', price: 199, mrp: 299, stock: 150, bestseller: true, shortDescription: 'Classical 3-fruit digestive.', description: 'Pure Triphala churna — Amla, Bibhitaki, Haritaki blend for digestion and detox.' },
    { name: 'Ashwagandha Churna - 250g', price: 299, mrp: 449, stock: 110, shortDescription: 'Pure ashwagandha root powder.', description: 'Wildcrafted Ashwagandha root powder — adaptogen for stress, sleep and stamina.' },
    { name: 'Brahmi Churna - 100g', price: 249, mrp: 349, stock: 80, featured: true, shortDescription: 'Memory & clarity herb.', description: 'Classical Brahmi churna — daily brain tonic for focus and memory.' },
    { name: 'Shilajit Resin - Pure - 20g', price: 899, mrp: 1399, stock: 50, trending: true, shortDescription: 'Pure Himalayan shilajit resin.', description: 'Genuine Himalayan shilajit resin — energy, stamina, mineral-rich.' },
  ],
  'natural-skincare': [
    { name: 'Aloe Vera Gel - 200g', price: 249, mrp: 399, stock: 150, bestseller: true, shortDescription: 'Pure aloe vera for skin & hair.', description: '99% pure aloe vera gel — soothing, hydrating, multi-purpose.' },
    { name: 'Neem Face Wash - 100ml', price: 179, mrp: 249, stock: 130, shortDescription: 'Acne-fighting neem face wash.', description: 'Gentle daily face wash with neem and tea tree — clears acne without drying.' },
    { name: 'Ubtan Face Pack - 100g', price: 299, mrp: 449, stock: 90, trending: true, shortDescription: 'Classical ubtan for glowing skin.', description: 'Traditional ubtan with besan, haldi, chandan and rose — bridal-grade glow pack.' },
    { name: 'Kumkumadi Tailam - 15ml', price: 599, mrp: 899, stock: 60, shortDescription: 'Saffron-infused face oil.', description: 'Classical Kumkumadi Tailam with saffron and 16 herbs — night-time skin elixir.' },
  ],
  'hair-care': [
    { name: 'Bhringraj Hair Oil - 200ml', price: 349, mrp: 499, stock: 100, bestseller: true, shortDescription: 'Classical hair growth oil.', description: 'Bhringraj-infused oil with amla, brahmi and hibiscus — classical hair-fall remedy.' },
    { name: 'Onion Hair Oil - 200ml', price: 299, mrp: 449, stock: 120, trending: true, shortDescription: 'Red onion hair growth oil.', description: 'Sulphur-rich red onion oil with curry leaves and hibiscus for thicker hair.' },
    { name: 'Amla Hair Shampoo - 300ml', price: 249, mrp: 349, stock: 80, shortDescription: 'Sulphate-free amla shampoo.', description: 'Gentle sulphate-free shampoo with amla, reetha and shikakai.' },
    { name: 'Henna & Indigo Powder - 200g', price: 199, mrp: 299, stock: 150, shortDescription: 'Natural hair colour.', description: 'Pure, chemical-free henna and indigo powder for natural black-brown hair colour.' },
  ],
  'superfoods': [
    { name: 'Moringa Powder - 250g', price: 349, mrp: 499, stock: 100, bestseller: true, shortDescription: 'Nutrient-dense moringa leaves.', description: 'Raw, sun-dried moringa leaf powder — 90+ nutrients. A green superfood for daily use.' },
    { name: 'Wheatgrass Powder - 100g', price: 299, mrp: 449, stock: 80, shortDescription: 'Alkalising wheatgrass.', description: 'Pure wheatgrass powder — chlorophyll-rich detox superfood.' },
    { name: 'Flax Seeds - Raw - 500g', price: 179, mrp: 249, stock: 140, shortDescription: 'Omega-3 rich flax seeds.', description: 'Raw, unroasted flax seeds — plant omega-3 and fiber powerhouse.' },
    { name: 'Plant Protein Powder - 500g', price: 1499, mrp: 1999, stock: 70, trending: true, shortDescription: 'Pea + rice protein isolate.', description: 'Clean plant protein — 24g per scoop. No added sugar, vegan.' },
  ],
  'digestive-wellness': [
    { name: 'Isabgol Husk - 200g', price: 149, mrp: 219, stock: 200, bestseller: true, shortDescription: 'Pure psyllium husk fiber.', description: 'Fine Isabgol (psyllium) husk — gentle daily fiber for healthy digestion.' },
    { name: 'Ajwain Herbal Drops - 30ml', price: 99, mrp: 149, stock: 180, shortDescription: 'Digestive ajwain drops.', description: 'Concentrated ajwain drops for bloating, gas and indigestion.' },
    { name: 'Pure Hing - Heeng Powder - 50g', price: 249, mrp: 349, stock: 90, shortDescription: 'Pure asafoetida powder.', description: 'Compounded pure hing — digestive herb used in tadka.' },
    { name: 'Jeevan Ras - Amla Tonic - 500ml', price: 199, mrp: 299, stock: 120, shortDescription: 'Daily amla digestive tonic.', description: 'Traditional amla-based tonic with 11 herbs for digestion and vitality.' },
  ],
};

export const getStats = asyncHandler(async (_req, res) => {
  const [users, products, orders, categories, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Category.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
  ]);
  const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(8);
  res.json({
    users,
    products,
    orders,
    categories,
    revenue: revenueAgg[0]?.total || 0,
    recentOrders,
  });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

export const seedHerbal = asyncHandler(async (_req, res) => {
  // Remove any existing herbal categories and products
  const existingHerbalCats = await Category.find({ vertical: 'herbal' });
  const existingCatIds = existingHerbalCats.map((c) => c._id);
  await Product.deleteMany({ category: { $in: existingCatIds } });
  await Category.deleteMany({ vertical: 'herbal' });

  let catCount = 0;
  let prodCount = 0;

  for (let i = 0; i < HERBAL_CATEGORIES.length; i++) {
    const c = HERBAL_CATEGORIES[i];
    const cat = await Category.create({ ...c, vertical: 'herbal', order: i });
    catCount++;

    const products = HERBAL_PRODUCTS[c.slug] || [];
    for (const p of products) {
      const slug = slugify(p.name);
      await Product.create({
        ...p,
        slug,
        images: [pic(slug, 800, 800), pic(slug + '-2', 800, 800)],
        category: cat._id,
        sku: `HB-${slug.slice(0, 18).toUpperCase()}`,
        rating: 4 + Math.random(),
        numReviews: Math.floor(Math.random() * 120) + 10,
        tags: [cat.name.toLowerCase(), 'herbal'],
        brand: 'Plumose Herbal',
      });
      prodCount++;
    }
  }

  res.json({ message: `Herbal seed complete: ${catCount} categories, ${prodCount} products added.` });
});
