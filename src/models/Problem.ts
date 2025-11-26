import { OTopic } from "@/models/Topic";
import mongoose, { Document, Model, Schema, Types } from "mongoose";

type Testcase = {
  input: string;
  output: string;
};

export const Rank = {
  hardcore: "Cực khó",
  hard: "Khó",
  normal: "Trung bình",
  easy: "Dễ",
} as const;
export type Rank = keyof typeof Rank;

interface IProblem extends Document {
  title: string;
  description: string;
  example: Testcase;
  topic: Types.ObjectId;
  testcases: Testcase[];
  rank: Rank;
  point: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OProblem {
  _id: string;
  title: string;
  description: string;
  example: Testcase;
  topic: OTopic;
  testcases: Testcase[];
  rank: Rank;
  point: number;
  createdAt: string;
  updatedAt: string;
}

const TestcaseSchema = new Schema<Testcase>(
  {
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ProblemSchema = new Schema<IProblem>(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề là bắt buộc"],
      trim: true,
      minlength: [3, "Tiêu đề quá ngắn"],
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    example: {
      type: TestcaseSchema,
      required: false,
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: [true, "Chủ đề là bắt buộc"],
    },
    testcases: {
      type: [TestcaseSchema],
      required: [true, "Phải có ít nhật 1 testcase"],
      validate: [(v: any[]) => v.length > 0, "Phải có ít nhất 1 testcase"],
    },
    rank: {
      type: String,
      enum: Object.keys(Rank),
      required: [true, "Độ khó là bắt buộc"],
      default: "normal",
    },
    point: {
      type: Number,
      required: true,
      min: [0, "Điểm không được âm"],
      max: [100, "Điểm tối đa là 100"],
      default: 10,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Problem: Model<IProblem> =
  mongoose.models?.Problem ||
  mongoose.model<IProblem>("Problem", ProblemSchema);

export default Problem;
