import mongoose from 'mongoose';

const regimenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        shiftId: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

regimenSchema.index({ userId: 1, shiftId: 1, date: 1 }, { unique: true });

export default mongoose.model('Regimen', regimenSchema);
