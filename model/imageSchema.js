import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
},
    { timestamps: true, }
);

export const Image = mongoose.model('galleries', imageSchema);