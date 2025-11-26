import mongoose, { Document, Model, Schema } from "mongoose";

interface ITopic extends Document {
  name: string;
}

export interface OTopic {
  _id: string;
  name: string;
}

const TopicSchema = new Schema<ITopic>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: false,
    toJSON: {
      transform: (_doc, ret) => ({
        _id: ret._id?.toString(),
        name: ret.name,
      }),
    },
  }
);

TopicSchema.set("toObject", {
  transform: (_doc, ret) => ({
    _id: ret._id?.toString(),
    name: ret.name,
  }),
});

const Topic: Model<ITopic> =
  mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);

export default Topic;
