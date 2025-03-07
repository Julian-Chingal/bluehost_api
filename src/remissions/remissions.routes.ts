import { Router } from "express";
import { RemissionController } from "./remissions.controller";
import { validateResource } from "../middlewares/validateRequest";
import { updateRemissionSchema } from "./remissions.schema";
import { authMiddleware } from "../middlewares";

const router = Router();

router.get("/", authMiddleware, RemissionController.get);
router.get("/:remissionNumber", authMiddleware, RemissionController.getByNumber)
router.get("/fechaentrada/:remissionNumber")
router.get("/fechasalida/:remissionNumber")
router.put("/", authMiddleware, validateResource(updateRemissionSchema), RemissionController.put);

export default router;