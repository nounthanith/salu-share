import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment {
  content: string;
  author: string;
  createdAt: Date;
}

export interface IPost extends Document {
  content: string;
  author?: string;
  likes: string[]; // Array of user IDs or identifiers
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const PostSchema = new Schema<IPost>(
  {
    content: { type: String, required: true, trim: true },
    author: { type: String, default: "Anonymous" },
    likes: { type: [String], default: [] },
    comments: { type: [CommentSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent re-compiling the model in development (Next.js HMR)
const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
