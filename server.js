import express from "express";
import morgan from "morgan";
import cors from "cors";
import csvRoutes from "./routes/csvRoutes.js";
const app = express();
const PORT = 3000;

app.use(morgan("dev"));
app.use(cors());

app.use("/api/csv", csvRoutes);

app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
