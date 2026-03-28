import mongoose from "mongoose";

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to mongodb");
  } catch (err) {
    console.error("Failed to connect to mongodb", err.message);
    process.exit(1);
  }
};

export default connectDB;
