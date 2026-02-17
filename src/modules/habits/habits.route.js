import express from "express";
import { createHabitController, getHabitsController, getHabitByIdController, updateHabitController, deleteHabitController } from "./habits.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createHabitController);
router.get("/", getHabitsController);
router.get("/:id", getHabitByIdController);
router.put("/:id", updateHabitController);
router.delete("/:id", deleteHabitController);

export default router;