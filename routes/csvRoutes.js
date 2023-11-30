import express from "express";
import upload from "../config/upload.js";
import {
  clusterAnalysis,
  getAssociationAnalysis,
  getRatingsDistribution,
  getReviewStats,
  importCsv,
} from "../controllers/csvController.js";
const router = express.Router();

router.post("/upload", upload.single("csv"), importCsv);
router.post("/distribution-ratings", getRatingsDistribution);
router.post("/reviews-count", getReviewStats);
router.post("/cluster-analysis", clusterAnalysis);
router.post('/association-analysis', getAssociationAnalysis);
export default router;
