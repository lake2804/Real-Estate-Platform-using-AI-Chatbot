import express from 'express'
import mongoose from "mongoose";
import routes from "./router/index.js";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://hom02042005:0NCozkL3Aq4gHyEb@realestatedb.uokc8vu.mongodb.net/RealEstateDB?retryWrites=true&w=majority&appName=RealEstateDB" // Replace with your MongoDB connection string
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

await connectDB();
const app = express();
app.use(express.json());
app.listen({ port: 4000 }, () =>
  console.log("Server started at http://localhost:4000")
);

routes(app);

app.get("/api", (req, res) => {
  res.send("Welcome to Real Estate API");
});