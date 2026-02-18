import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { checkHabitController, getHabitsStreakController, getHabitStatsController } from "./track.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/:id/check", checkHabitController);
router.get("/:id/streak", getHabitsStreakController);
router.get("/:id/stats", getHabitStatsController);

export default router;