import { Router } from "express";
import { RemissionController } from "./remissions.controller";
import { validateResource } from "../middlewares/validateRequest";
import { updateRemissionSchema } from "./remissions.schema";

const router = Router();

router.get("/", RemissionController.get);
router.get("/:remissionNumber", RemissionController.getByNumber)
router.get("/fechaentrada/:remissionNumber")
router.get("/fechasalida/:remissionNumber")
router.put("/", validateResource(updateRemissionSchema), RemissionController.put);

export default router;