import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const pic = (seed, w = 800, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ═══════════════════════════════════════════════
   DEVAPI (puja) categories + products
   ═══════════════════════════════════════════════ */
const devapiCategories = [
  { name: 'Idols & Murtis', slug: 'idols-murtis', icon: '🕉️', description: 'Handcrafted deity idols of Ganesha, Lakshmi, Krishna, Shiva and more.', image: pic('ganesha-idol', 800, 500) },
  { name: 'Diyas & Lamps', slug: 'diyas-lamps', icon: '🪔', description: 'Brass, clay & akhand jyoti diyas to light up your mandir.', image: pic('diya-lamp', 800, 500) },
  { name: 'Incense & Dhoop', slug: 'incense-dhoop', icon: '🌿', description: 'Pure agarbatti, dhoop sticks, loban and camphor.', image: pic('incense-sticks', 800, 500) },
  { name: 'Puja Thali Sets', slug: 'puja-thali', icon: '🍽️', description: 'Complete thali sets in brass, copper & silver plating.', image: pic('puja-thali-set', 800, 500) },
  { name: 'Bells & Ghanti', slug: 'bells-ghanti', icon: '🔔', description: 'Temple bells and handheld ghanti in pure brass.', image: pic('brass-bell-temple', 800, 500) },
  { name: 'Kalash & Lota', slug: 'kalash-lota', icon: '🏺', description: 'Copper and brass kalash, lota & panchpatra.', image: pic('copper-kalash', 800, 500) },
  { name: 'Chunri & Vastra', slug: 'chunri-vastra', icon: '🧣', description: 'Devi chunri, shringar sets and deity vastra.', image: pic('red-chunri-fabric', 800, 500) },
  { name: 'Rudraksha & Malas', slug: 'rudraksha-malas', icon: '📿', description: '108-bead rudraksha, tulsi and sphatik malas.', image: pic('rudraksha-mala-beads', 800, 500) },
  { name: 'Yantras', slug: 'yantras', icon: '🔯', description: 'Shree yantra, Ganesh yantra and more energized yantras.', image: pic('shree-yantra-copper', 800, 500) },
  { name: 'Havan Samagri', slug: 'havan-samagri', icon: '🔥', description: 'Complete havan samagri, kund and pure wood sticks.', image: pic('havan-fire-ritual', 800, 500) },
  { name: 'Puja Oils & Ghee', slug: 'oils-ghee', icon: '🫙', description: 'Til oil, mustard oil, desi cow ghee for your aarti.', image: pic('ghee-oil-golden', 800, 500) },
  { name: 'Kumkum & Chandan', slug: 'kumkum-chandan', icon: '🔴', description: 'Roli, sindoor, chandan and tilak essentials.', image: pic('kumkum-red-powder', 800, 500) },
  { name: 'Flowers & Garlands', slug: 'flowers-garlands', icon: '🌸', description: 'Artificial marigold, rose and jasmine garlands.', image: pic('marigold-flower-garland', 800, 500) },
  { name: 'Chowki & Asan', slug: 'chowki-asan', icon: '🪑', description: 'Wooden chowki and kusha asan for puja.', image: pic('wooden-chowki-puja', 800, 500) },
  { name: 'Puja Books & Aartis', slug: 'books-aartis', icon: '📖', description: 'Hanuman Chalisa, Sundarkand, Bhagavad Gita and more.', image: pic('spiritual-books-prayer', 800, 500) },
  { name: 'Shankh & Conch', slug: 'shankh', icon: '🐚', description: 'Natural Dakshinavarti and Lakshmi shankh.', image: pic('conch-shell-shankh', 800, 500) },
];

const devapiProducts = {
  'idols-murtis': [
    { name: 'Brass Ganesha Idol - Blessed Vighnaharta', price: 899, mrp: 1499, stock: 40, featured: true, bestseller: true, material: 'Pure Brass', weight: '750g', dimensions: '6x4x3 inch', shortDescription: 'Hand-polished brass Ganesha for home mandir.', description: 'A serene, hand-crafted brass Ganesha idol, finished to a warm antique glow. Perfect for daily worship, gruha pravesh and gifting.' },
    { name: 'Marble Lakshmi Mata Murti', price: 1299, mrp: 1999, stock: 25, trending: true, material: 'White Marble', weight: '1.2kg', dimensions: '7x5x3 inch', shortDescription: 'Abhaya-mudra Lakshmi in pure white marble.', description: 'Hand-carved white marble Maa Lakshmi idol adorned with golden finish on jewellery.' },
    { name: 'Bal Gopal Krishna Idol', price: 649, mrp: 999, stock: 60, bestseller: true, material: 'Resin with Gold finish', weight: '400g', shortDescription: 'Adorable makhan-chor Bal Gopal.', description: 'Sweetly sculpted Bal Gopal Krishna with butter pot, finished in rich gold hues.' },
    { name: 'Shivling with Nandi - Brass', price: 1099, mrp: 1799, stock: 30, featured: true, material: 'Brass', weight: '900g', shortDescription: 'Sacred Shivling with Nandi in brass.', description: 'A finely finished brass Shivling on a yoni-pitha with guardian Nandi.' },
    { name: 'Hanuman Ji Gada Dhari Idol', price: 799, mrp: 1299, stock: 45, trending: true, material: 'Metal alloy', weight: '650g', shortDescription: 'Veer Hanuman with gada — courage & protection.', description: 'Majestic Hanuman ji standing tall with gada, in a rich antique finish.' },
    { name: 'Maa Durga Sherawali Idol', price: 1499, mrp: 2399, stock: 18, material: 'Polyresin', weight: '1.1kg', shortDescription: 'Sherawali Maa astride her lion.', description: 'Vibrant, hand-painted Maa Durga sherawali idol. Perfect for Navratri.' },
    { name: 'Saraswati Mata Veena Idol', price: 999, mrp: 1499, stock: 22, material: 'Marble dust', weight: '800g', shortDescription: 'Goddess of wisdom with her veena.', description: 'Elegant Saraswati Mata idol playing the veena, finished in ivory and gold.' },
    { name: 'Ram Darbar Family Idol Set', price: 1899, mrp: 2999, stock: 15, featured: true, material: 'Brass', weight: '1.8kg', shortDescription: 'Ram, Sita, Lakshman & Hanuman together.', description: 'Complete Ram Darbar set in pure brass — a timeless centrepiece for your mandir.' },
  ],
  'diyas-lamps': [
    { name: 'Brass Akhand Jyoti Diya', price: 449, mrp: 799, stock: 80, bestseller: true, material: 'Brass', shortDescription: 'Long-lasting akhand jyoti with glass cover.', description: 'Classic brass akhand jyoti with a protective glass chimney — keeps the flame steady all night.' },
    { name: 'Panch Aarti Diya - 5 Wicks', price: 399, mrp: 699, stock: 70, material: 'Brass', shortDescription: 'Traditional 5-wick aarti diya.', description: 'Beautifully crafted panch-mukhi aarti diya with a comfortable handle.' },
    { name: 'Clay Diya Pack of 24 - Hand Painted', price: 249, mrp: 399, stock: 150, trending: true, material: 'Terracotta', shortDescription: 'Hand-painted Diwali diyas — pack of 24.', description: 'Artisan-made, hand-painted terracotta diyas in vibrant festive colours.' },
    { name: 'Brass Samai Deepak - Tall Standing Lamp', price: 1299, mrp: 1999, stock: 20, featured: true, material: 'Brass', shortDescription: 'Traditional Maharashtrian samai deepak.', description: 'Tall, elegant brass samai with multiple wick cups.' },
    { name: 'Cotton Wicks (Batti) - 500 Pieces', price: 99, mrp: 149, stock: 300, bestseller: true, shortDescription: 'Pure cotton long batti for diyas.', description: 'Hand-rolled, 100% pure cotton batti for diyas and aarti — 500 pieces pack.' },
  ],
  'incense-dhoop': [
    { name: 'Pure Sandalwood Agarbatti - 200g', price: 199, mrp: 299, stock: 200, bestseller: true, shortDescription: 'Mysore sandalwood incense sticks.', description: 'Authentic Mysore sandalwood (chandan) agarbatti with a calming, long-lasting fragrance.' },
    { name: 'Loban Dhoop Cones - 50 Pieces', price: 149, mrp: 249, stock: 120, trending: true, shortDescription: 'Natural loban dhoop cones.', description: 'Pure loban dhoop cones made from natural resins.' },
    { name: 'Kapoor (Camphor) Tablets - 100g', price: 179, mrp: 259, stock: 150, shortDescription: 'Pure bhimseni camphor for aarti.', description: 'Pure bhimseni kapoor tablets — burns cleanly, releases a sacred aroma.' },
    { name: 'Nag Champa Incense Sticks - 100g', price: 129, mrp: 199, stock: 180, shortDescription: 'Classic nag champa for meditation.', description: 'Iconic nag champa agarbatti with a deep floral-resin aroma.' },
    { name: 'Guggul Dhoop Sticks', price: 159, mrp: 229, stock: 100, shortDescription: 'Ayurvedic guggul dhoop.', description: 'Herbal guggul dhoop sticks — an ancient fragrance used for purification.' },
  ],
  'puja-thali': [
    { name: 'Complete Brass Puja Thali Set - 11 Items', price: 1799, mrp: 2999, stock: 35, featured: true, bestseller: true, material: 'Pure Brass', shortDescription: 'Full 11-piece puja thali set.', description: 'A complete brass puja thali set with thali, diya, bell, kalash and more.' },
    { name: 'Silver-Plated Designer Thali', price: 2499, mrp: 3999, stock: 18, trending: true, material: 'Silver-plated brass', shortDescription: 'Premium silver-plated thali set.', description: 'A stunning silver-plated puja thali with intricate engraving.' },
    { name: 'Copper Puja Thali - 7 Piece', price: 1299, mrp: 1999, stock: 40, material: 'Pure Copper', shortDescription: 'Ayurvedic copper thali set.', description: 'Health-benefiting pure copper puja thali with 7 essential items.' },
  ],
  'bells-ghanti': [
    { name: 'Brass Temple Bell - Hanging', price: 599, mrp: 899, stock: 50, material: 'Brass', shortDescription: 'Classic hanging temple ghanti.', description: 'Traditional hanging brass temple bell with deep, resonating sound.' },
    { name: 'Handheld Puja Ghanti', price: 249, mrp: 399, stock: 120, bestseller: true, material: 'Brass', shortDescription: 'Handheld brass bell for aarti.', description: 'Perfectly weighted brass puja ghanti with crisp, clear ring.' },
    { name: 'Nandi Ghanti - Shiv Pooja', price: 399, mrp: 649, stock: 60, material: 'Brass', shortDescription: 'Nandi-topped bell for Shiv aaradhana.', description: 'Sacred brass ghanti topped with Nandi.' },
  ],
  'kalash-lota': [
    { name: 'Copper Kalash with Coconut Holder', price: 549, mrp: 899, stock: 60, trending: true, material: 'Pure Copper', shortDescription: 'Auspicious tamba kalash.', description: 'Pure copper kalash perfect for griha pravesh and Navratri sthapana.' },
    { name: 'Brass Panchpatra with Achmani', price: 349, mrp: 549, stock: 80, material: 'Brass', shortDescription: 'Classic panchpatra-achmani combo.', description: 'Essential puja accessory for sankalpa and jal-offerings.' },
    { name: 'Copper Lota - 500ml', price: 299, mrp: 499, stock: 100, bestseller: true, material: 'Pure Copper', shortDescription: 'Ayurvedic copper water lota.', description: 'Store water overnight in this pure copper lota.' },
  ],
  'rudraksha-malas': [
    { name: '5 Mukhi Rudraksha Mala - 108 Beads', price: 699, mrp: 1299, stock: 50, featured: true, bestseller: true, material: 'Nepal Rudraksha', shortDescription: 'Original 5-mukhi rudraksha japa mala.', description: 'Certified 5-mukhi rudraksha mala with 108+1 beads.' },
    { name: 'Tulsi Mala - Vrindavan', price: 299, mrp: 499, stock: 120, material: 'Tulsi wood', shortDescription: 'Pure Vrindavan tulsi japa mala.', description: 'Sacred tulsi mala from Vrindavan.' },
    { name: 'Sphatik (Crystal) Mala - 108 Beads', price: 599, mrp: 999, stock: 60, trending: true, material: 'Sphatik crystal', shortDescription: 'Clear sphatik mala for peace.', description: 'Transparent sphatik mala believed to bring mental clarity.' },
  ],
  'yantras': [
    { name: 'Shree Yantra - Copper Energised', price: 899, mrp: 1499, stock: 40, featured: true, material: 'Pure Copper', shortDescription: 'Pran-pratishtha Shree Yantra.', description: 'Energised copper Shree Yantra — most powerful yantra for wealth.' },
    { name: 'Ganesh Yantra - Brass Plate', price: 499, mrp: 799, stock: 60, material: 'Brass', shortDescription: 'Siddhi-Vinayak yantra.', description: 'Brass Ganesh yantra to remove obstacles.' },
    { name: 'Kuber Yantra - Wealth', price: 549, mrp: 899, stock: 50, shortDescription: 'Attract wealth with Kuber yantra.', description: 'Kuber yantra in gold-plated brass.' },
  ],
  'havan-samagri': [
    { name: 'Premium Havan Samagri - 500g', price: 249, mrp: 399, stock: 120, bestseller: true, shortDescription: 'Classical havan samagri mix.', description: 'A pure blend of 20+ herbs for havan and yagna.' },
    { name: 'Copper Havan Kund - Square', price: 1299, mrp: 1999, stock: 25, trending: true, material: 'Pure Copper', shortDescription: 'Traditional 4-step havan kund.', description: 'Pure copper square havan kund with 4-level step design.' },
    { name: 'Mango Wood Havan Sticks - 1kg', price: 199, mrp: 299, stock: 150, shortDescription: 'Pure aam ki lakdi for havan.', description: 'Sun-dried mango wood sticks — shastra-prescribed.' },
  ],
  'oils-ghee': [
    { name: 'Desi Cow Ghee - A2 Gir - 500ml', price: 799, mrp: 1199, stock: 60, bestseller: true, shortDescription: 'Pure A2 Gir cow ghee.', description: 'Hand-churned A2 Gir cow ghee made by bilona method.' },
    { name: 'Pure Til (Sesame) Oil - 500ml', price: 299, mrp: 449, stock: 100, shortDescription: 'Cold-pressed til oil for diya.', description: 'Traditional cold-pressed til oil.' },
    { name: 'Mustard Oil for Puja - 500ml', price: 179, mrp: 249, stock: 120, shortDescription: 'Pure kachi ghani sarson oil.', description: 'Kachi ghani mustard oil.' },
  ],
  'kumkum-chandan': [
    { name: 'Pure Roli Kumkum - 100g', price: 99, mrp: 149, stock: 200, bestseller: true, shortDescription: 'Bright auspicious red roli.', description: 'Vibrant, chemical-free roli kumkum.' },
    { name: 'Chandan Powder - Mysore - 50g', price: 249, mrp: 399, stock: 100, trending: true, shortDescription: 'Authentic Mysore chandan.', description: 'Pure Mysore chandan powder.' },
    { name: 'Sindoor - Devi Special - 50g', price: 79, mrp: 129, stock: 250, shortDescription: 'Bright red devi sindoor.', description: 'Pure sindoor offered to Devi and Hanuman ji.' },
    { name: 'Ashtagandha Tilak Paste', price: 149, mrp: 249, stock: 80, shortDescription: 'Classical 8-herb tilak paste.', description: 'Traditional ashtagandha paste.' },
  ],
  'flowers-garlands': [
    { name: 'Artificial Marigold Garland - 5ft', price: 199, mrp: 349, stock: 150, bestseller: true, shortDescription: 'Vibrant marigold toran/garland.', description: 'Beautiful, reusable artificial marigold garland.' },
    { name: 'Rose Petals (Dried) - 100g', price: 149, mrp: 249, stock: 100, shortDescription: 'Dried rose petals for puja.', description: 'Naturally sun-dried red rose petals.' },
    { name: 'Deity Garland - White Jasmine', price: 249, mrp: 399, stock: 80, shortDescription: 'Fragrant jasmine-style garland.', description: 'Elegant white artificial jasmine garland.' },
  ],
  'chowki-asan': [
    { name: 'Wooden Puja Chowki - Carved', price: 899, mrp: 1499, stock: 40, featured: true, material: 'Sheesham Wood', shortDescription: 'Hand-carved sheesham chowki.', description: 'Hand-carved sheesham wood chowki with detailed motifs.' },
    { name: 'Kusha Grass Asan', price: 249, mrp: 399, stock: 100, shortDescription: 'Sacred kusha asan for sadhana.', description: 'Traditional kusha grass asan.' },
    { name: 'Red Velvet Puja Asan', price: 349, mrp: 599, stock: 120, bestseller: true, shortDescription: 'Comfortable red velvet asan.', description: 'Soft, padded red velvet asan with golden border.' },
  ],
  'chunri-vastra': [
    { name: 'Red Devi Chunri with Gota Work', price: 199, mrp: 349, stock: 150, bestseller: true, material: 'Silk blend', shortDescription: 'Auspicious red chunri for Mata Rani.', description: 'Bright red chunri with golden gota-patti border.' },
    { name: 'Devi Shringar Set - 16 Pieces', price: 499, mrp: 899, stock: 70, trending: true, shortDescription: 'Complete solah-shringar for Mata.', description: 'Traditional 16-piece shringar set for Devi.' },
    { name: 'Deity Vastra Set - Krishna', price: 299, mrp: 499, stock: 90, material: 'Silk', shortDescription: 'Ready-to-wear Krishna poshak.', description: 'Beautifully stitched Krishna poshak with matching pagdi and mukut.' },
  ],
  'books-aartis': [
    { name: 'Hanuman Chalisa - Pocket Edition', price: 49, mrp: 99, stock: 300, bestseller: true, shortDescription: 'Illustrated Hanuman Chalisa.', description: 'Clear Hindi-English pocket edition of Hanuman Chalisa.' },
    { name: 'Sundarkand - Large Print', price: 149, mrp: 249, stock: 120, shortDescription: 'Sundarkand with easy Hindi meaning.', description: 'Large print Sundarkand paath book.' },
    { name: 'Bhagavad Gita - Gita Press', price: 199, mrp: 299, stock: 100, trending: true, shortDescription: 'Authentic Gita Press edition.', description: 'The timeless Bhagavad Gita in authentic Gita Press edition.' },
    { name: 'Aarti Sangrah - All Deities', price: 99, mrp: 149, stock: 200, shortDescription: 'All popular aartis in one book.', description: 'Complete aarti sangrah with 51 aartis.' },
  ],
  'shankh': [
    { name: 'Dakshinavarti Shankh - Natural', price: 1499, mrp: 2499, stock: 20, featured: true, material: 'Natural Conch', shortDescription: 'Rare right-handed Lakshmi shankh.', description: 'Authentic natural dakshinavarti shankh.' },
    { name: 'Blowing Shankh - Medium', price: 699, mrp: 1099, stock: 50, bestseller: true, shortDescription: 'Clear-sounding blowing conch.', description: 'Natural blowing shankh with a deep, resonant sound.' },
    { name: 'Brass Shankh Stand', price: 299, mrp: 499, stock: 80, material: 'Brass', shortDescription: 'Elegant shankh stand.', description: 'Hand-finished brass stand for your shankh.' },
  ],
};

/* ═══════════════════════════════════════════════
   HERBAL categories + products
   ═══════════════════════════════════════════════ */
const herbalCategories = [
  { name: 'Immunity Boosters', slug: 'immunity-boosters', icon: '💪', description: 'Chyawanprash, Giloy, Tulsi and more for daily immunity.', image: pic('chyawanprash-ayurveda', 800, 500) },
  { name: 'Herbal Teas', slug: 'herbal-teas', icon: '🍵', description: 'Tulsi, chamomile, green, lemongrass — pure herbal infusions.', image: pic('herbal-tea-leaves', 800, 500) },
  { name: 'Essential Oils', slug: 'essential-oils', icon: '🌿', description: 'Cold-pressed neem, coconut, eucalyptus and aromatherapy oils.', image: pic('essential-oils-bottles', 800, 500) },
  { name: 'Ayurvedic Medicines', slug: 'ayurvedic-medicines', icon: '🧪', description: 'Classical Ayush-certified churnas, tablets and asavas.', image: pic('ayurvedic-medicine', 800, 500) },
  { name: 'Natural Skincare', slug: 'natural-skincare', icon: '🧴', description: 'Neem face wash, aloe vera gel, herbal face packs.', image: pic('natural-skincare-green', 800, 500) },
  { name: 'Hair Care', slug: 'hair-care', icon: '💇', description: 'Amla, bhringraj, onion oil — natural hair solutions.', image: pic('herbal-hair-oil', 800, 500) },
  { name: 'Superfoods', slug: 'superfoods', icon: '🥗', description: 'Moringa, wheatgrass, flax seeds and protein powders.', image: pic('moringa-superfood', 800, 500) },
  { name: 'Digestive Wellness', slug: 'digestive-wellness', icon: '🌱', description: 'Triphala, ajwain, hing, isabgol — gut-friendly herbs.', image: pic('digestive-herbs', 800, 500) },
];

const herbalProducts = {
  'immunity-boosters': [
    { name: 'Dabur Chyawanprash - 1kg Awaleha', price: 349, mrp: 495, stock: 100, bestseller: true, featured: true, shortDescription: 'Classical amla-based immunity tonic.', description: 'Authentic Chyawanprash made with 40+ Ayurvedic herbs including Amla, Ashwagandha, Pippali and Guduchi. Daily immunity for the whole family.' },
    { name: 'Giloy Tulsi Immunity Drops - 30ml', price: 199, mrp: 299, stock: 150, trending: true, shortDescription: 'Concentrated giloy-tulsi drops.', description: 'Potent herbal drops with Giloy and Tulsi extracts — few drops in water, daily immunity shield.' },
    { name: 'Ashwagandha Tablets - 60 Caps', price: 399, mrp: 599, stock: 90, bestseller: true, shortDescription: 'Pure KSM-66 ashwagandha caps.', description: 'High-potency Ashwagandha KSM-66 capsules for stress relief, stamina and immunity.' },
    { name: 'Amla Juice - Cold Pressed - 500ml', price: 249, mrp: 349, stock: 110, shortDescription: '100% pure amla juice.', description: 'Sugar-free cold-pressed Amla juice. Vitamin C powerhouse for skin, hair and immunity.' },
    { name: 'Tulsi Drops - Panch Tulsi - 30ml', price: 149, mrp: 229, stock: 180, shortDescription: '5 types of tulsi in one bottle.', description: 'Concentrated Panch Tulsi drops — daily respiratory and immunity support.' },
  ],
  'herbal-teas': [
    { name: 'Organic Tulsi Green Tea - 100 Bags', price: 299, mrp: 449, stock: 120, bestseller: true, shortDescription: 'Antioxidant tulsi-green tea blend.', description: 'Organic tulsi green tea — daily cup of immunity and calm. Caffeine-light.' },
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

/* ═══════════════════════════════════════════════
   SEED RUNNER
   ═══════════════════════════════════════════════ */
async function seedCategories(list, vertical) {
  const result = {};
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    const cat = await Category.create({ ...c, vertical, order: i });
    result[c.slug] = cat;
  }
  return result;
}

async function seedProducts(byCatSlug, catMap, verticalTag) {
  let count = 0;
  for (const [slug, list] of Object.entries(byCatSlug)) {
    const cat = catMap[slug];
    if (!cat) continue;
    for (const p of list) {
      const productSlug = slugify(p.name);
      const images = [pic(productSlug, 800, 800), pic(productSlug + '-2', 800, 800)];
      await Product.create({
        ...p,
        images,
        slug: productSlug,
        category: cat._id,
        sku: `${verticalTag}-${productSlug.slice(0, 18).toUpperCase()}`,
        rating: 4 + Math.random(),
        numReviews: Math.floor(Math.random() * 120) + 10,
        tags: [cat.name.toLowerCase(), verticalTag.toLowerCase()],
        brand: verticalTag === 'DV' ? 'Devapi' : 'Plumose Herbal',
      });
      count++;
    }
  }
  return count;
}

async function run() {
  await connectDB();
  console.log('🧹 Clearing existing data...');
  await Promise.all([
    User.deleteMany({ role: 'admin' }),
    Category.deleteMany(),
    Product.deleteMany(),
  ]);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@plumose.in';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';
  const admin = await User.create({
    name: 'Plumose Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });
  console.log(`👑 Admin: ${admin.email} / ${adminPassword}`);

  console.log('📂 Seeding Devapi categories & products...');
  const devapiCats = await seedCategories(devapiCategories, 'devapi');
  const devapiCount = await seedProducts(devapiProducts, devapiCats, 'DV');
  console.log(`  → ${devapiCategories.length} categories, ${devapiCount} products`);

  console.log('🌿 Seeding Herbal categories & products...');
  const herbalCats = await seedCategories(herbalCategories, 'herbal');
  const herbalCount = await seedProducts(herbalProducts, herbalCats, 'HB');
  console.log(`  → ${herbalCategories.length} categories, ${herbalCount} products`);

  console.log('✅ Seed complete!');
  console.log(`Total: ${devapiCategories.length + herbalCategories.length} categories, ${devapiCount + herbalCount} products.`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
