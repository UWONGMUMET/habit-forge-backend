import express from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "./config/config.js"

import authRoutes from "./modules/auth/auth.route.js";
import habitRoutes from "./modules/habits/habits.route.js";
import trackRoutes from "./modules/track/track.route.js";

import { globalRateLimit } from "./middlewares/rateLimit.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { morganMiddleware } from "./middlewares/morganMiddleware.js";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(globalRateLimit);
app.use(morganMiddleware);

app.get("/health-check", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "habit-forge-backend",
        uptime: Math.floor(process.uptime()) + "s"
    });
});

app.use("/auth", authRoutes);
app.use("/habits", habitRoutes);
app.use("/track", trackRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});

export default app;