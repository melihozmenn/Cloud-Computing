import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
    description: string;
    status: boolean;
}


const TodoSchema: Schema = new Schema({
    description: { type: String, required: true },
    status: { type: Boolean, required: true }
});

export default mongoose.model<ITodo>("Todo", TodoSchema);