import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const productSchema = new mongoose.Schema({
    name: String,
    image: String
}, { strict: false });

const Product = mongoose.model('Product', productSchema, 'products');

async function updateImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nutricloud');
        console.log('Connected to MongoDB.');
        const products = await Product.find({});

        for (const p of products) {
            const name = (p.name || '').toLowerCase();
            let newImage = 'https://images.unsplash.com/photo-1490645935967-10de6ba82116?auto=format&fit=crop&q=80&w=800'; // vibrant food default

            if (name.includes('protein') || name.includes('whey')) {
                newImage = 'https://images.unsplash.com/photo-1593095948071-474c5cc29f0d?auto=format&fit=crop&q=80&w=800';
            } else if (name.includes('vitamin') || name.includes('multi')) {
                newImage = 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800';
            } else if (name.includes('pre-workout') || name.includes('energy') || name.includes('bcaa') || name.includes('fuel')) {
                newImage = 'https://images.unsplash.com/photo-1622595522218-f318265a40f4?auto=format&fit=crop&q=80&w=800';
            } else if (name.includes('green') || name.includes('matcha') || name.includes('superfood')) {
                newImage = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800';
            } else if (name.includes('fish') || name.includes('omega') || name.includes('oil')) {
                newImage = 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=800';
            } else if (name.includes('creatine') || name.includes('powder')) {
                newImage = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800';
            } else if (name.includes('roller') || name.includes('mat') || name.includes('band') || name.includes('gear')) {
                newImage = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800';
            } else if (name.includes('meal') || name.includes('bar') || name.includes('snack')) {
                newImage = 'https://images.unsplash.com/photo-1622485540304-4c600115bc55?auto=format&fit=crop&q=80&w=800';
            }

            await Product.updateOne({ _id: p._id }, { $set: { image: newImage } });
            console.log('Updated: ' + p.name);
        }
        console.log('Success! Fully Migrated Imagery.');
        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        mongoose.disconnect();
    }
}

updateImages();
