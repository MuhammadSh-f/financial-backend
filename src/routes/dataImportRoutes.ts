import { Router } from "express";
import { importData } from "../controllers/dataImportController";

const router = Router();

router.post("/", importData);

export default router;
