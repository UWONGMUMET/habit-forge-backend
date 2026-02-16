import morgan from "morgan";
import logger from "../config/logger.js";

export const morganMiddleware = morgan("combined", {
    stream: {
        write: (message) => logger.http(message.trim())
    }
});