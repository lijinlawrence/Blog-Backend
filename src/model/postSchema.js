import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    about:{
        type: String,
        required: true,
    },

    body: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
    name:{
        type: String,
        required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const post = mongoose.model("post", postSchema);

export default post;
