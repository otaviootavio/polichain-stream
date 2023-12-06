import express from "express";
import {
  serveM3U8Content,
  serveTSContent,
  serveVideoPlayer,
} from "./videoController";
import { rateLimitMiddleware } from "./middleware/rateLimitMiddleware";

const videoRoutes = express.Router();

videoRoutes.get("/player.html", serveVideoPlayer);
videoRoutes.get("/*.m3u8", serveM3U8Content);
videoRoutes.get("/*.ts", rateLimitMiddleware, serveTSContent);

export default videoRoutes;
