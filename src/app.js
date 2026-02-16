import express from "express";

import { config } from "./config/config.js";

const app = express();
app.use(express.json());

app.get("/health-check", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "habit-forge-backend",
        uptime: Math.floor(process.uptime()) + "s"
    });
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});

export default app;