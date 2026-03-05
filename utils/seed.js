require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../models/Role');
const User = require('../models/User');
const { dataRole, dataUser } = require('./data2');

async function seed() {
    try {
        console.log('Kết nối MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Đã kết nối MongoDB Atlas!');

        // Seed Roles
        console.log('\n--- Seeding Roles ---');
        for (const r of dataRole) {
            const exists = await Role.findOne({ id: r.id });
            if (!exists) {
                await Role.create({
                    id: r.id,
                    name: r.name,
                    description: r.description,
                    creationAt: r.creationAt,
                    updatedAt: r.updatedAt,
                });
                console.log(`  Đã tạo role: ${r.id} - ${r.name}`);
            } else {
                console.log(`  Role ${r.id} đã tồn tại, bỏ qua.`);
            }
        }

        // Seed Users
        console.log('\n--- Seeding Users ---');
        for (const u of dataUser) {
            const exists = await User.findOne({ username: u.username });
            if (!exists) {
                await User.create({
                    username: u.username,
                    password: u.password,
                    email: u.email,
                    fullName: u.fullName,
                    avatarUrl: u.avatarUrl,
                    status: u.status,
                    loginCount: u.loginCount,
                    role: u.role,
                    creationAt: u.creationAt,
                    updatedAt: u.updatedAt,
                });
                console.log(`  Đã tạo user: ${u.username}`);
            } else {
                console.log(`  User ${u.username} đã tồn tại, bỏ qua.`);
            }
        }

        console.log('\nSeed hoàn tất!');
    } catch (err) {
        console.error('Lỗi seed:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Đã ngắt kết nối MongoDB.');
    }
}

seed();
