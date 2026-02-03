import { mongoUri } from "@/secret";
import mongoose from "mongoose";

if (!mongoUri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

let cached = global as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

export async function connectMongoDB() {
  if (cached.mongoose!.conn) {
    return cached.mongoose!.conn;
  }

  if (!cached.mongoose!.promise) {
    cached.mongoose!.promise = mongoose.connect(mongoUri!).then((m) => m);
  }

  cached.mongoose!.conn = await cached.mongoose!.promise;
  return cached.mongoose!.conn;
}
