import {
  IVideoStreamService,
  StreamResult,
} from "../../domain/interfaces/IVideoStreamService";
import * as fs from "fs";
import * as path from "path";
import rangeParser from "range-parser";

export class VideoStreamService implements IVideoStreamService {
  async streamVideo(
    filePath: string,
    rangeHeader: string
  ): Promise<StreamResult> {
    const videoPath = path.resolve(filePath);
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 9;

    const range = rangeParser(videoSize, rangeHeader);

    console.log(range);
    if (
      range === -1 ||
      range === -2 ||
      range.type !== "bytes" ||
      range.length === 0
    ) {
      throw new Error("Invalid range");
    }

    const { start, end } = range[0];
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    const videoStream = fs.createReadStream(videoPath, { start, end });

    return {
      start,
      end,
      contentLength: headers["Content-Length"].toString(),
      contentType: headers["Content-Type"],
      stream: videoStream,
    };
  }
}
