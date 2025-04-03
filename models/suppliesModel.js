import mongoose from "mongoose";

const suppliesSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    category: {
        required: true,
        type: String,
    },
    quantity: {
        required: true,
        type: Number,
    },
    unit: {
        required: true,
        type: String,
    },
    location: {
        required: true,
        type: String,
    },
    expirationDate: {
        type: Date,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,

    }
})

const Supplies = mongoose.models.Supplies || mongoose.model("Supplies", suppliesSchema);

export default Supplies;

