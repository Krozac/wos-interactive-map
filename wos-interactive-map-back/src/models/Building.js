import mongoose from 'mongoose';

const BuildingSchema = new mongoose.Schema({
    location: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    size: {
        w: { type: Number, required: true },
        h: { type: Number, required: true },
    },
    type: { type: String, required: true },
    addedBy: { type: String }, // Optional: ID of the user who added it
    createdAt: { type: Date, default: Date.now }, // Optional: Track when it was added
    alliance: { type: mongoose.Schema.Types.ObjectId, ref: 'Guild' }, // <-- extracted
    extraData: { type: mongoose.Schema.Types.Mixed, default: {} }, // Flexible field for additional data
});


const Building = mongoose.model('Building', BuildingSchema);
export default Building;
