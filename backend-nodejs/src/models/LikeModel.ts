import mongoose  from "mongoose";

export interface likeSchemaType {
    product: {
        $ref: string,
        $id: mongoose.Types.ObjectId
    },
    likedUsers: Array<string>,
    likeCount: number,
}

const LikeSchema = new mongoose.Schema<likeSchemaType>(
    {
        product: {
            $ref: String,
            $id: mongoose.Types.ObjectId
        },
        likedUsers: Array,
        likeCount: { type: Number, default: 0, index: true},
    },
    { timestamps: true }
);

export default mongoose.model("Likes", LikeSchema);