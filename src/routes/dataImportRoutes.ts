import { Router } from "express";
import { importData } from "../controllers/dataImportController.js";

const router = Router();

router.post("/", importData);

export default router;
