import mongoose from "mongoose"

export interface newsLetterSchemaType {
    emailAddresses: Array<{
        email: string, unsubCode: string
    }>
}

const newsLetterSchema = new mongoose.Schema<newsLetterSchemaType>(
    {
        emailAddresses: Array,
    }
);

export default mongoose.model("NewsLetters", newsLetterSchema);