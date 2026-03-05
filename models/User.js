const mongoose = require('mongoose');

const RoleEmbedSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
}, { _id: false });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    fullName: { type: String, default: '' },
    avatarUrl: { type: String, default: 'https://i.sstatic.net/l60Hf.png' },
    status: { type: Boolean, default: true },
    loginCount: { type: Number, default: 0 },
    role: { type: RoleEmbedSchema, default: null },
    creationAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
