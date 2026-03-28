import express from "express";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";
import userRouter from "./src/routes/user.routes.js";
import globalErrorHandler from "./src/middlewares/globalErrorHandler.js";

dotenv.config();
connectDB(process.env.MONGO_URI);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
