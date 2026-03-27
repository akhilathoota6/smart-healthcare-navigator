import express from "express";
import { getHospitalRecommendations } from "../controllers/hospitalController.js";

const router = express.Router();

/*
Final route:
POST /api/hospitals
*/

router.post("/", getHospitalRecommendations);

export default router;