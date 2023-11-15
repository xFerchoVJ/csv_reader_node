import express from "express";
import upload from "../config/upload.js";
import { importCsv } from "../controllers/csvController.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Hola mundo" });
});

router.post("/upload", upload.single("csv"), importCsv);

export default router;
