import express from "express";
import { serveHLSContent, serveVideoPlayer } from "./videoController";
import { rateLimitMiddleware } from "./middleware/rateLimitMiddleware";

const videoRoutes = express.Router();

videoRoutes.get("/player.html", serveVideoPlayer);
videoRoutes.get("/*.m3u8", serveHLSContent);
videoRoutes.get("/*.ts", serveHLSContent);

export default videoRoutes;
