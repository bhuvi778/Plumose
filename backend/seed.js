import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

/* picsum.photos gives consistent images by seed - always loads reliably */
const pic = (seed, w = 800, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const categories = [
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

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const productsBySlug = {
  'idols-murtis': [
    { name: 'Brass Ganesha Idol - Blessed Vighnaharta', price: 899, mrp: 1499, stock: 40, featured: true, bestseller: true, material: 'Pure Brass', weight: '750g', dimensions: '6x4x3 inch', shortDescription: 'Hand-polished brass Ganesha for home mandir.', description: 'A serene, hand-crafted brass Ganesha idol, finished to a warm antique glow. Perfect for daily worship, gruha pravesh and gifting. Brings prosperity, removes obstacles and invites Riddhi-Siddhi into your home.', images: ['https://images.unsplash.com/photo-1604423043492-41303c1dddbe?w=900', 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=900'] },
    { name: 'Marble Lakshmi Mata Murti', price: 1299, mrp: 1999, stock: 25, trending: true, material: 'White Marble', weight: '1.2kg', dimensions: '7x5x3 inch', shortDescription: 'Abhaya-mudra Lakshmi in pure white marble.', description: 'Hand-carved white marble Maa Lakshmi idol adorned with golden finish on jewellery. An auspicious addition to your puja ghar that radiates grace and abundance.', images: ['https://images.unsplash.com/photo-1625317086750-1a72c88e0748?w=900'] },
    { name: 'Bal Gopal Krishna Idol', price: 649, mrp: 999, stock: 60, bestseller: true, material: 'Resin with Gold finish', weight: '400g', dimensions: '5x4x2 inch', shortDescription: 'Adorable makhan-chor Bal Gopal.', description: 'Sweetly sculpted Bal Gopal Krishna with butter pot, finished in rich gold hues. Fills your home with Vrindavan vibrations and childlike joy.', images: ['https://images.unsplash.com/photo-1609919002895-aecdd6c79f9f?w=900'] },
    { name: 'Shivling with Nandi - Brass', price: 1099, mrp: 1799, stock: 30, featured: true, material: 'Brass', weight: '900g', dimensions: '6x5x4 inch', shortDescription: 'Sacred Shivling with Nandi in brass.', description: 'A finely finished brass Shivling on a yoni-pitha with guardian Nandi. Ideal for daily abhishekam — brings peace, patience and Mahadev’s blessings.', images: ['https://images.unsplash.com/photo-1590080876351-52f9d7e8e6c1?w=900'] },
    { name: 'Hanuman Ji Gada Dhari Idol', price: 799, mrp: 1299, stock: 45, trending: true, material: 'Metal alloy', weight: '650g', dimensions: '7x3x3 inch', shortDescription: 'Veer Hanuman with gada — courage & protection.', description: 'Majestic Hanuman ji standing tall with gada, in a rich antique finish. Symbol of devotion, strength and fearless protection.', images: ['https://images.unsplash.com/photo-1605379399642-870262d3d051?w=900'] },
    { name: 'Maa Durga Sherawali Idol', price: 1499, mrp: 2399, stock: 18, material: 'Polyresin', weight: '1.1kg', dimensions: '9x6x4 inch', shortDescription: 'Sherawali Maa astride her lion.', description: 'Vibrant, hand-painted Maa Durga sherawali idol with intricate detailing. Perfect for Navratri sthapana and year-round worship.', images: ['https://images.unsplash.com/photo-1633957883403-3a5b3e44a7a6?w=900'] },
    { name: 'Saraswati Mata Veena Idol', price: 999, mrp: 1499, stock: 22, material: 'Marble dust', weight: '800g', dimensions: '8x4x3 inch', shortDescription: 'Goddess of wisdom with her veena.', description: 'Elegant Saraswati Mata idol playing the veena, finished in ivory and gold. An inspiring presence for students and creators.', images: ['https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=900'] },
    { name: 'Ram Darbar Family Idol Set', price: 1899, mrp: 2999, stock: 15, featured: true, material: 'Brass', weight: '1.8kg', dimensions: '10x7x4 inch', shortDescription: 'Ram, Sita, Lakshman & Hanuman together.', description: 'Complete Ram Darbar set in pure brass — Shri Ram, Mata Sita, Lakshman and devoted Hanuman ji. A timeless centrepiece for your mandir.', images: ['https://images.unsplash.com/photo-1606293926249-8fffef36f3fe?w=900'] },
  ],
  'diyas-lamps': [
    { name: 'Brass Akhand Jyoti Diya', price: 449, mrp: 799, stock: 80, bestseller: true, material: 'Brass', weight: '350g', dimensions: '5x4 inch', shortDescription: 'Long-lasting akhand jyoti with glass cover.', description: 'Classic brass akhand jyoti with a protective glass chimney — keeps the flame steady all night. An auspicious must-have for festivals and daily aarti.', images: ['https://images.unsplash.com/photo-1605302820535-b09b7d1e3b5c?w=900'] },
    { name: 'Panch Aarti Diya - 5 Wicks', price: 399, mrp: 699, stock: 70, material: 'Brass', weight: '280g', shortDescription: 'Traditional 5-wick aarti diya.', description: 'Beautifully crafted panch-mukhi aarti diya in pure brass with a comfortable handle. The heart of every Hindu aarti ritual.', images: ['https://images.unsplash.com/photo-1605649487212-47bdab9d9cee?w=900'] },
    { name: 'Clay Diya Pack of 24 - Hand Painted', price: 249, mrp: 399, stock: 150, trending: true, material: 'Terracotta', shortDescription: 'Hand-painted Diwali diyas — pack of 24.', description: 'Artisan-made, hand-painted terracotta diyas in vibrant festive colours. Perfect for Diwali, Karwa Chauth and daily puja.', images: ['https://images.unsplash.com/photo-1604423043492-41303c1dddbe?w=900'] },
    { name: 'Brass Samai Deepak - Tall Standing Lamp', price: 1299, mrp: 1999, stock: 20, featured: true, material: 'Brass', weight: '1.4kg', dimensions: '12 inch', shortDescription: 'Traditional Maharashtrian samai deepak.', description: 'Tall, elegant brass samai with multiple wick cups. Lights up your mandir with a divine, temple-like ambience.', images: ['https://images.unsplash.com/photo-1605649487212-47bdab9d9cee?w=900'] },
    { name: 'Cotton Wicks (Batti) - 500 Pieces', price: 99, mrp: 149, stock: 300, bestseller: true, shortDescription: 'Pure cotton long batti for diyas.', description: 'Hand-rolled, 100% pure cotton batti for diyas and aarti — 500 pieces pack. Clean, long-lasting flame with minimal smoke.', images: ['https://images.unsplash.com/photo-1605649487200-76077c0a79b3?w=900'] },
  ],
  'incense-dhoop': [
    { name: 'Pure Sandalwood Agarbatti - 200g', price: 199, mrp: 299, stock: 200, bestseller: true, shortDescription: 'Mysore sandalwood incense sticks.', description: 'Authentic Mysore sandalwood (chandan) agarbatti with a calming, long-lasting fragrance. Enhances meditation and puja.', images: ['https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=900'] },
    { name: 'Loban Dhoop Cones - 50 Pieces', price: 149, mrp: 249, stock: 120, trending: true, shortDescription: 'Natural loban dhoop cones.', description: 'Pure loban dhoop cones made from natural resins. Purifies the air, wards off negativity, perfect after aarti.', images: ['https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=900'] },
    { name: 'Kapoor (Camphor) Tablets - 100g', price: 179, mrp: 259, stock: 150, shortDescription: 'Pure bhimseni camphor for aarti.', description: 'Pure bhimseni kapoor tablets — burns cleanly, releases a sacred aroma and is ideal for aarti and havan.', images: ['https://images.unsplash.com/photo-1609921205586-7e8a57516512?w=900'] },
    { name: 'Nag Champa Incense Sticks - 100g', price: 129, mrp: 199, stock: 180, shortDescription: 'Classic nag champa for meditation.', description: 'Iconic nag champa agarbatti with a deep floral-resin aroma. Ideal for meditation, yoga and puja.', images: ['https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=900'] },
    { name: 'Guggul Dhoop Sticks', price: 159, mrp: 229, stock: 100, shortDescription: 'Ayurvedic guggul dhoop.', description: 'Herbal guggul dhoop sticks — an ancient fragrance used for purification and wealth.', images: ['https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=900'] },
  ],
  'puja-thali': [
    { name: 'Complete Brass Puja Thali Set - 11 Items', price: 1799, mrp: 2999, stock: 35, featured: true, bestseller: true, material: 'Pure Brass', weight: '1.2kg', shortDescription: 'Full 11-piece puja thali set.', description: 'A complete brass puja thali set with thali, diya, bell, kalash, agarbatti stand, chandan katori, flower katori, achmani, panchpatra, spoon and incense holder. Everything you need for a perfect puja.', images: ['https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=900'] },
    { name: 'Silver-Plated Designer Thali', price: 2499, mrp: 3999, stock: 18, trending: true, material: 'Silver-plated brass', shortDescription: 'Premium silver-plated thali set.', description: 'A stunning silver-plated puja thali with intricate engraving — perfect for gifting on weddings, griha pravesh and festivals.', images: ['https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=900'] },
    { name: 'Copper Puja Thali - 7 Piece', price: 1299, mrp: 1999, stock: 40, material: 'Pure Copper', shortDescription: 'Ayurvedic copper thali set.', description: 'Health-benefiting pure copper puja thali with 7 essential items. Copper is believed to balance the body & spiritually purify offerings.', images: ['https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=900'] },
  ],
  'bells-ghanti': [
    { name: 'Brass Temple Bell - Hanging', price: 599, mrp: 899, stock: 50, material: 'Brass', weight: '600g', shortDescription: 'Classic hanging temple ghanti.', description: 'Traditional hanging brass temple bell with deep, resonating sound. Blesses your home with temple-like divinity every morning.', images: ['https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=900'] },
    { name: 'Handheld Puja Ghanti', price: 249, mrp: 399, stock: 120, bestseller: true, material: 'Brass', weight: '200g', shortDescription: 'Handheld brass bell for aarti.', description: 'Perfectly weighted brass puja ghanti with crisp, clear ring. A must-have for daily aarti.', images: ['https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=900'] },
    { name: 'Nandi Ghanti - Shiv Pooja', price: 399, mrp: 649, stock: 60, material: 'Brass', shortDescription: 'Nandi-topped bell for Shiv aaradhana.', description: 'Sacred brass ghanti topped with Nandi — specifically for Shiv puja and rudra abhishek.', images: ['https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=900'] },
  ],
  'kalash-lota': [
    { name: 'Copper Kalash with Coconut Holder', price: 549, mrp: 899, stock: 60, trending: true, material: 'Pure Copper', weight: '500g', shortDescription: 'Auspicious tamba kalash.', description: 'Pure copper kalash perfect for griha pravesh, Navratri sthapana and Ganpati visarjan rituals.', images: ['https://images.unsplash.com/photo-1625035624027-a0a6f6dd2fc4?w=900'] },
    { name: 'Brass Panchpatra with Achmani', price: 349, mrp: 549, stock: 80, material: 'Brass', shortDescription: 'Classic panchpatra-achmani combo.', description: 'Essential puja accessory for sankalpa and jal-offerings. Hand-finished in pure brass.', images: ['https://images.unsplash.com/photo-1625035624027-a0a6f6dd2fc4?w=900'] },
    { name: 'Copper Lota - 500ml', price: 299, mrp: 499, stock: 100, bestseller: true, material: 'Pure Copper', shortDescription: 'Ayurvedic copper water lota.', description: 'Store water overnight in this pure copper lota — ayurvedic benefits and ideal for ritual offerings.', images: ['https://images.unsplash.com/photo-1625035624027-a0a6f6dd2fc4?w=900'] },
  ],
  'chunri-vastra': [
    { name: 'Red Devi Chunri with Gota Work', price: 199, mrp: 349, stock: 150, bestseller: true, material: 'Silk blend', shortDescription: 'Auspicious red chunri for Mata Rani.', description: 'Bright red chunri with golden gota-patti border — ideal offering for Durga, Lakshmi and Vaishno Devi.', images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900'] },
    { name: 'Devi Shringar Set - 16 Pieces', price: 499, mrp: 899, stock: 70, trending: true, shortDescription: 'Complete solah-shringar for Mata.', description: 'Traditional 16-piece shringar set for Devi — bindi, bangles, necklace, chunri and more.', images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900'] },
    { name: 'Deity Vastra Set - Krishna', price: 299, mrp: 499, stock: 90, material: 'Silk', shortDescription: 'Ready-to-wear Krishna poshak.', description: 'Beautifully stitched Krishna poshak with matching pagdi and mukut. Sized for 6-8 inch idols.', images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900'] },
  ],
  'rudraksha-malas': [
    { name: '5 Mukhi Rudraksha Mala - 108 Beads', price: 699, mrp: 1299, stock: 50, featured: true, bestseller: true, material: 'Nepal Rudraksha', shortDescription: 'Original 5-mukhi rudraksha japa mala.', description: 'Certified 5-mukhi rudraksha mala with 108+1 beads — ideal for japa, meditation and mahamrityunjaya chanting.', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=900'] },
    { name: 'Tulsi Mala - Vrindavan', price: 299, mrp: 499, stock: 120, material: 'Tulsi wood', shortDescription: 'Pure Vrindavan tulsi japa mala.', description: 'Sacred tulsi mala from Vrindavan — favoured by Krishna devotees for japa and nama-kirtan.', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=900'] },
    { name: 'Sphatik (Crystal) Mala - 108 Beads', price: 599, mrp: 999, stock: 60, trending: true, material: 'Sphatik crystal', shortDescription: 'Clear sphatik mala for peace.', description: 'Transparent sphatik mala believed to bring mental clarity and peace — ideal for Lakshmi and Saraswati sadhana.', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=900'] },
  ],
  'yantras': [
    { name: 'Shree Yantra - Copper Energised', price: 899, mrp: 1499, stock: 40, featured: true, material: 'Pure Copper', weight: '250g', dimensions: '3x3 inch', shortDescription: 'Pran-pratishtha Shree Yantra.', description: 'Energised copper Shree Yantra — most powerful yantra for wealth, prosperity and harmony. Pran-pratishtha done by vedic pandits.', images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900'] },
    { name: 'Ganesh Yantra - Brass Plate', price: 499, mrp: 799, stock: 60, material: 'Brass', shortDescription: 'Siddhi-Vinayak yantra.', description: 'Brass Ganesh yantra to remove obstacles from your business and home. Keep on your puja altar or office.', images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900'] },
    { name: 'Kuber Yantra - Wealth', price: 549, mrp: 899, stock: 50, shortDescription: 'Attract wealth with Kuber yantra.', description: 'Kuber yantra in gold-plated brass — invites the lord of wealth into your home and business.', images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900'] },
  ],
  'havan-samagri': [
    { name: 'Premium Havan Samagri - 500g', price: 249, mrp: 399, stock: 120, bestseller: true, shortDescription: 'Classical havan samagri mix.', description: 'A pure blend of 20+ herbs including chandan, guggul, jatamansi, kesar and more — perfect for any havan or yagna.', images: ['https://images.unsplash.com/photo-1609921205586-7e8a57516512?w=900'] },
    { name: 'Copper Havan Kund - Square', price: 1299, mrp: 1999, stock: 25, trending: true, material: 'Pure Copper', dimensions: '8x8x4 inch', shortDescription: 'Traditional 4-step havan kund.', description: 'Pure copper square havan kund with 4-level step design as per shastra. Ideal for home yagnas.', images: ['https://images.unsplash.com/photo-1609921205586-7e8a57516512?w=900'] },
    { name: 'Mango Wood Havan Sticks - 1kg', price: 199, mrp: 299, stock: 150, shortDescription: 'Pure aam ki lakdi for havan.', description: 'Sun-dried mango wood sticks — shastra-prescribed wood for havan. Clean burn, sacred smoke.', images: ['https://images.unsplash.com/photo-1609921205586-7e8a57516512?w=900'] },
  ],
  'oils-ghee': [
    { name: 'Desi Cow Ghee - A2 Gir - 500ml', price: 799, mrp: 1199, stock: 60, bestseller: true, shortDescription: 'Pure A2 Gir cow ghee.', description: 'Hand-churned A2 Gir cow ghee made by bilona method — most sacred ghee for aarti, prasad and havan.', images: ['https://images.unsplash.com/photo-1628432136280-8b3ea0f99baa?w=900'] },
    { name: 'Pure Til (Sesame) Oil - 500ml', price: 299, mrp: 449, stock: 100, shortDescription: 'Cold-pressed til oil for diya.', description: 'Traditional cold-pressed til oil — specifically used for Shani puja and daily diya lighting.', images: ['https://images.unsplash.com/photo-1628432136280-8b3ea0f99baa?w=900'] },
    { name: 'Mustard Oil for Puja - 500ml', price: 179, mrp: 249, stock: 120, shortDescription: 'Pure kachi ghani sarson oil.', description: 'Kachi ghani mustard oil — widely used for Hanuman ji and lamps in Bihar & UP traditions.', images: ['https://images.unsplash.com/photo-1628432136280-8b3ea0f99baa?w=900'] },
  ],
  'kumkum-chandan': [
    { name: 'Pure Roli Kumkum - 100g', price: 99, mrp: 149, stock: 200, bestseller: true, shortDescription: 'Bright auspicious red roli.', description: 'Vibrant, chemical-free roli kumkum for tilak, puja and festivals.', images: ['https://images.unsplash.com/photo-1604608672516-f1b9b1d1f5d4?w=900'] },
    { name: 'Chandan Powder - Mysore - 50g', price: 249, mrp: 399, stock: 100, trending: true, shortDescription: 'Authentic Mysore chandan.', description: 'Pure Mysore chandan powder — use as tilak, in puja paste or havan.', images: ['https://images.unsplash.com/photo-1604608672516-f1b9b1d1f5d4?w=900'] },
    { name: 'Sindoor - Devi Special - 50g', price: 79, mrp: 129, stock: 250, shortDescription: 'Bright red devi sindoor.', description: 'Pure sindoor offered to Devi and Hanuman ji — deep red, chemical-free.', images: ['https://images.unsplash.com/photo-1604608672516-f1b9b1d1f5d4?w=900'] },
    { name: 'Ashtagandha Tilak Paste', price: 149, mrp: 249, stock: 80, shortDescription: 'Classical 8-herb tilak paste.', description: 'Traditional ashtagandha — a fragrant blend of 8 sacred substances used by pandits.', images: ['https://images.unsplash.com/photo-1604608672516-f1b9b1d1f5d4?w=900'] },
  ],
  'flowers-garlands': [
    { name: 'Artificial Marigold Garland - 5ft', price: 199, mrp: 349, stock: 150, bestseller: true, shortDescription: 'Vibrant marigold toran/garland.', description: 'Beautiful, reusable artificial marigold garland — perfect for mandir, doors and festivals.', images: ['https://images.unsplash.com/photo-1601928705068-23b1e0df1c5e?w=900'] },
    { name: 'Rose Petals (Dried) - 100g', price: 149, mrp: 249, stock: 100, shortDescription: 'Dried rose petals for puja.', description: 'Naturally sun-dried red rose petals for puja, pushpanjali and havan offerings.', images: ['https://images.unsplash.com/photo-1601928705068-23b1e0df1c5e?w=900'] },
    { name: 'Deity Garland - White Jasmine', price: 249, mrp: 399, stock: 80, shortDescription: 'Fragrant jasmine-style garland.', description: 'Elegant white artificial jasmine garland for deity shringar.', images: ['https://images.unsplash.com/photo-1601928705068-23b1e0df1c5e?w=900'] },
  ],
  'chowki-asan': [
    { name: 'Wooden Puja Chowki - Carved', price: 899, mrp: 1499, stock: 40, featured: true, material: 'Sheesham Wood', dimensions: '12x12x4 inch', shortDescription: 'Hand-carved sheesham chowki.', description: 'Hand-carved sheesham wood chowki with detailed motifs — a regal seat for your deity.', images: ['https://images.unsplash.com/photo-1604423042935-ed1c1febaee0?w=900'] },
    { name: 'Kusha Grass Asan', price: 249, mrp: 399, stock: 100, shortDescription: 'Sacred kusha asan for sadhana.', description: 'Traditional kusha grass asan — shastra-prescribed seat for meditation, japa and rituals.', images: ['https://images.unsplash.com/photo-1604423042935-ed1c1febaee0?w=900'] },
    { name: 'Red Velvet Puja Asan', price: 349, mrp: 599, stock: 120, bestseller: true, shortDescription: 'Comfortable red velvet asan.', description: 'Soft, padded red velvet asan with golden border — ideal for long puja sessions.', images: ['https://images.unsplash.com/photo-1604423042935-ed1c1febaee0?w=900'] },
  ],
  'books-aartis': [
    { name: 'Hanuman Chalisa - Pocket Edition', price: 49, mrp: 99, stock: 300, bestseller: true, shortDescription: 'Illustrated Hanuman Chalisa.', description: 'Clear Hindi-English pocket edition of Hanuman Chalisa with beautiful illustrations and meaning.', images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=900'] },
    { name: 'Sundarkand - Large Print', price: 149, mrp: 249, stock: 120, shortDescription: 'Sundarkand with easy Hindi meaning.', description: 'Large print Sundarkand paath book in Hindi with word-by-word meaning and full arti sangrah.', images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=900'] },
    { name: 'Bhagavad Gita - Gita Press', price: 199, mrp: 299, stock: 100, trending: true, shortDescription: 'Authentic Gita Press edition.', description: 'The timeless Bhagavad Gita in authentic Gita Press Gorakhpur edition with shlokas and Hindi bhavarth.', images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=900'] },
    { name: 'Aarti Sangrah - All Deities', price: 99, mrp: 149, stock: 200, shortDescription: 'All popular aartis in one book.', description: 'Complete aarti sangrah with 51 aartis of all major deities in clear Hindi.', images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=900'] },
  ],
  'shankh': [
    { name: 'Dakshinavarti Shankh - Natural', price: 1499, mrp: 2499, stock: 20, featured: true, material: 'Natural Conch', shortDescription: 'Rare right-handed Lakshmi shankh.', description: 'Authentic natural dakshinavarti shankh — the most auspicious conch associated with Maa Lakshmi. Comes with a red velvet box.', images: ['https://images.unsplash.com/photo-1605460375648-278bcbd579a6?w=900'] },
    { name: 'Blowing Shankh - Medium', price: 699, mrp: 1099, stock: 50, bestseller: true, shortDescription: 'Clear-sounding blowing conch.', description: 'Natural blowing shankh with a deep, resonant sound. Purifies the atmosphere during aarti.', images: ['https://images.unsplash.com/photo-1605460375648-278bcbd579a6?w=900'] },
    { name: 'Brass Shankh Stand', price: 299, mrp: 499, stock: 80, material: 'Brass', shortDescription: 'Elegant shankh stand.', description: 'Hand-finished brass stand to beautifully display your shankh on the puja altar.', images: ['https://images.unsplash.com/photo-1605460375648-278bcbd579a6?w=900'] },
  ],
};

async function run() {
  await connectDB();
  console.log('🧹 Clearing existing data...');
  await Promise.all([User.deleteMany({ role: 'admin' }), Category.deleteMany(), Product.deleteMany()]);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@divyam.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';
  const admin = await User.create({
    name: 'Devapi Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });
  console.log(`👑 Admin created: ${admin.email} / ${adminPassword}`);

  const createdCats = {};
  for (const c of categories) {
    const cat = await Category.create({ ...c, order: categories.indexOf(c) });
    createdCats[c.slug] = cat;
  }
  console.log(`📂 ${categories.length} categories created`);

  let productCount = 0;
  for (const [slug, list] of Object.entries(productsBySlug)) {
    const cat = createdCats[slug];
    if (!cat) continue;
    for (const p of list) {
      /* Replace Unsplash URLs (which may fail) with reliable picsum images */
      const cleanImages = (p.images || []).filter(img => !img.includes('unsplash.com'));
      const productSlug = slugify(p.name);
      if (cleanImages.length === 0) cleanImages.push(pic(productSlug));
      await Product.create({
        ...p,
        images: cleanImages,
        slug: productSlug,
        category: cat._id,
        sku: 'DV-' + productSlug.slice(0, 20).toUpperCase(),
        rating: 4 + Math.random(),
        numReviews: Math.floor(Math.random() * 120) + 10,
        tags: [cat.name.toLowerCase(), 'puja', 'hindu', 'religious'],
      });
      productCount++;
    }
  }
  console.log(`🛍️  ${productCount} products created`);
  console.log('✅ Seed complete!');
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
