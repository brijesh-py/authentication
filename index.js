import { error } from "console";
import app from "./src/app.js";
import connectDB from "./src/db/connectDB.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
