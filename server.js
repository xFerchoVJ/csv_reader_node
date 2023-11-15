import express from "express";
import morgan from "morgan";
import csvRoutes from "./routes/csvRoutes.js";
const app = express();
const PORT = 3000;

app.use(morgan("dev"));

app.use("/api/csv", csvRoutes);
app.listen(PORT, () => {
  console.log(`Server en puerto ${PORT}`);
});
