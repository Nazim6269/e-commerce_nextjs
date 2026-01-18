import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        productId: { type: String, required: true, index: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        userName: { type: String, required: true },
        userImage: { type: String },
        rating: { type: Number, required: true, min: 1, max: 5 },
        text: { type: String, required: true },
        images: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const ReviewModel = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
