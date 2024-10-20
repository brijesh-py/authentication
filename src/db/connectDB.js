import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo db connected =>", response.connection.host);
  } catch (error) {
    console.log("Error connection to mongodb =>", error?.message);
    process.exit(1);
  }
};

export default connectDB