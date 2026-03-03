import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const officialProducts = [
  // EQUIPMENT (1-10)
  { name: "Max Foam Roller Matrix", category: "Equipment", type: "foam roller" },
  { name: "Optimum Yoga Mat Matrix", category: "Equipment", type: "yoga mat" },
  { name: "Advanced Dumbbells Matrix", category: "Equipment", type: "pair of dumbbells" },
  { name: "Core Resistance Bands Matrix", category: "Equipment", type: "resistance bands set" },
  { name: "Raw Kettlebell Matrix", category: "Equipment", type: "kettlebell" },
  { name: "Elite Foam Roller Matrix", category: "Equipment", type: "foam roller" },
  { name: "Pro Dumbbells Matrix", category: "Equipment", type: "dumbbells" },
  { name: "Ultra Yoga Mat Matrix", category: "Equipment", type: "yoga mat" },
  { name: "Max Resistance Bands Matrix", category: "Equipment", type: "resistance bands" },
  { name: "Advanced Kettlebell Matrix", category: "Equipment", type: "kettlebell" },

  // PROTEIN (11-20)
  { name: "Elite Casein Matrix", category: "Protein", type: "casein protein powder tub" },
  { name: "Raw Hydrolized Whey Matrix", category: "Protein", type: "whey protein powder bag" },
  { name: "Pro Vegan Protein Matrix", category: "Protein", type: "vegan protein powder tub" },
  { name: "Max Whey Isolate Matrix", category: "Protein", type: "whey isolate protein tub" },
  { name: "Ultra Mass Gainer Matrix", category: "Protein", type: "mass gainer protein bag" },
  { name: "Advanced Hydrolized Whey Matrix", category: "Protein", type: "hydrolyzed whey protein tub" },
  { name: "Core Vegan Protein Matrix", category: "Protein", type: "vegan protein powder" },
  { name: "Optimum Casein Matrix", category: "Protein", type: "casein protein jar" },
  { name: "Raw Mass Gainer Matrix", category: "Protein", type: "mass gainer protein tub" },
  { name: "Elite Whey Isolate Matrix", category: "Protein", type: "whey isolate protein" },

  // SNACKS (21-30)
  { name: "Elite Protein Cookie Matrix", category: "Snacks", type: "protein cookie packaging" },
  { name: "Ultra Oat Flapjack Matrix", category: "Snacks", type: "oat flapjack bar" },
  { name: "Pro Trail Mix Matrix", category: "Snacks", type: "trail mix snack bag" },
  { name: "Max Energy Bites Matrix", category: "Snacks", type: "energy bites pack" },
  { name: "Advanced Protein Bar Matrix", category: "Snacks", type: "protein bar wrapper" },
  { name: "Optimum Protein Cookie Matrix", category: "Snacks", type: "protein cookie box" },
  { name: "Core Trail Mix Matrix", category: "Snacks", type: "trail mix pouch" },
  { name: "Raw Oat Flapjack Matrix", category: "Snacks", type: "oat flapjack bar" },
  { name: "Elite Energy Bites Matrix", category: "Snacks", type: "energy bites jar" },
  { name: "Pro Protein Bar Matrix", category: "Snacks", type: "protein bar" },

  // SUPPLEMENTS (31-40)
  { name: "Optimum Pre-Workout Matrix", category: "Supplements", type: "pre-workout supplement tub" },
  { name: "Raw Electrolytes Matrix", category: "Supplements", type: "electrolyte powder tub" },
  { name: "Core Sleep Aid Matrix", category: "Supplements", type: "sleep supplement capsules bottle" },
  { name: "Elite Glutamine Matrix", category: "Supplements", type: "glutamine powder tub" },
  { name: "Pro BCAA Matrix", category: "Supplements", type: "BCAA supplement powder" },
  { name: "Ultra Pre-Workout Matrix", category: "Supplements", type: "pre-workout energy powder" },
  { name: "Max Sleep Aid Matrix", category: "Supplements", type: "melatonin sleep supplement" },
  { name: "Advanced Electrolytes Matrix", category: "Supplements", type: "electrolyte drink mix" },
  { name: "Optimum Glutamine Matrix", category: "Supplements", type: "glutamine supplement" },
  { name: "Core BCAA Matrix", category: "Supplements", type: "BCAA capsules bottle" },

  // VITAMINS (41-50)
  { name: "Advanced Vitamin D3 Matrix", category: "Vitamins", type: "vitamin D3 supplement bottle" },
  { name: "Max Zinc & Magnesium Matrix", category: "Vitamins", type: "zinc magnesium supplement" },
  { name: "Ultra B-Complex Matrix", category: "Vitamins", type: "B-complex vitamin bottle" },
  { name: "Optimum Omega-3 Matrix", category: "Vitamins", type: "omega-3 fish oil capsules" },
  { name: "Core Daily Multi Matrix", category: "Vitamins", type: "daily multivitamin bottle" },
  { name: "Raw B-Complex Matrix", category: "Vitamins", type: "B-complex vitamin pills" },
  { name: "Pro Vitamin D3 Matrix", category: "Vitamins", type: "vitamin D3 drops bottle" },
  { name: "Elite Zinc & Magnesium Matrix", category: "Vitamins", type: "ZMA supplement capsules" },
  { name: "Ultra Omega-3 Matrix", category: "Vitamins", type: "omega-3 softgels bottle" },
  { name: "Max Daily Multi Matrix", category: "Vitamins", type: "multivitamin gummies jar" }
];

const generateProducts = async () => {
  const categoryCount = {};

  return officialProducts.map((p, i) => {
    const category = p.category;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
    const paddedIndex = categoryCount[category].toString().padStart(2, '0');

    const price = parseFloat(((Math.random() * 60) + 19.99).toFixed(2));
    let targetBMI = "Normal";
    if (i % 3 === 0) targetBMI = "Underweight";
    if (i % 3 === 1) targetBMI = "Overweight";
    if (i % 3 === 2) targetBMI = "Obese";

    const image = `/images/products/${category.toLowerCase()}/${category.toLowerCase()}_${paddedIndex}.png`;

    return {
      name: p.name,
      description: `[Metadata: type=${p.type}] A part of the premium "MATRIX SERIES". Engineered for elite performance and maximum results.`,
      category: category,
      price: price,
      image: image,
      stock: Math.floor(Math.random() * 100) + 10,
      recommendedFor: [targetBMI],
      rating: Math.floor(Math.random() * 2) + 4
    };
  });
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    console.log('Clearing existing products...');
    await Product.deleteMany({});

    console.log('Generating official MATRIX SERIES product catalog...');
    const newProducts = await generateProducts();

    await Product.insertMany(newProducts);

    console.log('✅ Successfully seeded official 50-product MATRIX catalog!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedDB();
