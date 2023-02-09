import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

declare module 'jsonwebtoken' {
    export interface TokenPayload extends JwtPayload {
        id: mongoose.Types.ObjectId,
    }
}