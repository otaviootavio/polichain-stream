import { Request, Response } from "express";
import { StreamVideoUseCase } from "../../application/UseCases/StreamVideoUseCase";
import path from "path";

export class VideoStreamController {
  private streamVideoUseCase: StreamVideoUseCase;

  constructor(streamVideoUseCase: StreamVideoUseCase) {
    this.streamVideoUseCase = streamVideoUseCase;
  }

  async handle(req: Request, res: Response): Promise<void> {
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
      return;
    }

    try {
      const videoPath = path.resolve(__dirname, "../../../videos/output.mp4");
      const streamResult = await this.streamVideoUseCase.execute(
        videoPath,
        range
      );

      res.writeHead(206, {
        "Content-Range": `bytes ${streamResult.start}-${streamResult.end}/${streamResult.contentLength}`,
        "Accept-Ranges": "bytes",
        "Content-Length": streamResult.contentLength,
        "Content-Type": streamResult.contentType,
      });

      streamResult.stream.pipe(res);
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  }
}
