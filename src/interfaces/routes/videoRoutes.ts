import { Router } from "express";
import { VideoStreamService } from "../../infrastructure/services/VideoStreamService";
import { StreamVideoUseCase } from "../../application/UseCases/StreamVideoUseCase";
import { VideoStreamController } from "../controllers/VideoStreamController";
const router = Router();

const videoStreamService = new VideoStreamService();
const streamVideoUseCase = new StreamVideoUseCase(videoStreamService);
const videoStreamController = new VideoStreamController(streamVideoUseCase);

router.get("/video", (req, res) => videoStreamController.handle(req, res));

export default router;
