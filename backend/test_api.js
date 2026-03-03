import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import ActivityLog from './models/ActivityLog.js';

dotenv.config();

const testUnsplash = async () => {
    const keys = [
        'eio_bUpoL-2TdecbdKlBU5tU0r0MtDjncvGRopRIoAw', // 0 0
        'eio_bUpoL-2TdecbdKlBU5tU0rOMtDjncvGRopRIoAw', // 0 O
        'eio_bUpoL-2TdecbdKlBU5tUOr0MtDjncvGRopRIoAw', // O 0
        'eio_bUpoL-2TdecbdKlBU5tUOrOMtDjncvGRopRIoAw'  // O O
    ];

    for (const key of keys) {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=dumbbells&client_id=${key}&per_page=1`);
        console.log(`Unsplash Status for ${key}:`, res.status);
        const text = await res.text();
        console.log(`Unsplash Body for ${key}:`, text);
        if (res.status === 200) break;
    }
};

const testLocal = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({});
        if (!user) {
            console.log('No user found');
            return;
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        console.log(`Testing with user: ${user.email}, id: ${user._id}`);
        const res = await fetch('http://localhost:5000/api/products?limit=50', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Local status:', res.status);
        const text = await res.text();
        console.log('Local body:', text);
    } catch (e) {
        console.log('Local error:', e);
    } finally {
        mongoose.disconnect();
    }
};

(async () => {
    await testUnsplash();
    await testLocal();
})();
