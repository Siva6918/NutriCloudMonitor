import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import ActivityLog from './models/ActivityLog.js';
import { calculateRiskScoreAndStatus } from './utils/calculateRiskScore.js';

dotenv.config();

const testUsers = [
    {
        name: 'Rahul Sharma',
        email: 'rahul.safe@nutri.co',
        password: 'password123',
        height: 170,
        weight: 70,
        bmi: 24.2,
        bmiCategory: 'Normal',
        loginCount: 12,
        failedLoginAttempts: 0,
        totalFailedAttempts: 1,
        systemStatus: 'Safe',
        adminStatus: 'Active',
        lockUntil: null,
    },
    {
        name: 'Priya Verma',
        email: 'priya.suspicious@nutri.co',
        password: 'password123',
        height: 170,
        weight: 70,
        bmi: 24.2,
        bmiCategory: 'Normal',
        loginCount: 8,
        failedLoginAttempts: 2,
        totalFailedAttempts: 5,
        systemStatus: 'Suspicious',
        adminStatus: 'Active',
        lockUntil: null,
    },
    {
        name: 'Arjun Malhotra',
        email: 'arjun.highrisk@nutri.co',
        password: 'password123',
        height: 170,
        weight: 70,
        bmi: 24.2,
        bmiCategory: 'Normal',
        loginCount: 4,
        failedLoginAttempts: 4,
        totalFailedAttempts: 15,
        systemStatus: 'HighRisk',
        adminStatus: 'Active',
        lockUntil: null,
    },
    {
        name: 'Sneha Reddy',
        email: 'sneha.cooldown@nutri.co',
        password: 'password123',
        height: 170,
        weight: 70,
        bmi: 24.2,
        bmiCategory: 'Normal',
        loginCount: 3,
        failedLoginAttempts: 5,
        totalFailedAttempts: 9,
        lockUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        systemStatus: 'HighRisk',
        adminStatus: 'Active',
    },
    {
        name: 'Vikram Patel',
        email: 'vikram.blocked@nutri.co',
        password: 'password123',
        height: 170,
        weight: 70,
        bmi: 24.2,
        bmiCategory: 'Normal',
        loginCount: 20,
        failedLoginAttempts: 1,
        totalFailedAttempts: 12,
        systemStatus: 'Suspicious',
        adminStatus: 'Blocked',
        lockUntil: null,
    }
];

const seedTestUsers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const emails = testUsers.map(u => u.email);

        console.log('Cleaning up existing test users...');
        await User.deleteMany({ email: { $in: emails } });

        // Also delete any existing activity logs for these users
        // (This is tricky if we don't have their IDs, so we'll just insert new logs)

        console.log('Seeding simulated test users...');

        for (const userData of testUsers) {
            // Calculate real risk score based on formula
            const { riskScore } = calculateRiskScoreAndStatus(
                userData.failedLoginAttempts,
                userData.totalFailedAttempts
            );

            const user = new User({
                ...userData,
                riskScore,
                lastLogin: new Date(Date.now() - Math.random() * 1000000000) // Random recent date
            });

            // Saving will automatically trigger the bcrypt pre-save hook
            const savedUser = await user.save();
            console.log(`✅ Inserted User: ${savedUser.name} | Status: ${savedUser.systemStatus} | Score: ${riskScore}`);

            // Seed an activity log for forensic dashboard testing
            await ActivityLog.create({
                userId: savedUser._id,
                action: 'login',
                ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TestBrowser/1.0',
                createdAt: savedUser.lastLogin, // Fake the timestamp to match lastLogin
            });
            console.log(`  -> Forensic Log Created for ${savedUser.name}`);
        }

        console.log('✅ Testing Simulation Data Seeded Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Failed to seed testing data:', error);
        process.exit(1);
    }
};

seedTestUsers();
