//@ts-nocheck
"use server"
import mongoose, { Schema } from "mongoose";

let cached:any = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = await mongoose.connect(`${process.env.MONGODB_STRING}`,{
        dbName: '9cloud',
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;