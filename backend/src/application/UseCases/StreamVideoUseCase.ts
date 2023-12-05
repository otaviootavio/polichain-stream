import {
  IVideoStreamService,
  StreamResult,
} from "../../domain/interfaces/IVideoStreamService";

export class StreamVideoUseCase {
  private videoStreamService: IVideoStreamService;

  constructor(videoStreamService: IVideoStreamService) {
    this.videoStreamService = videoStreamService;
  }

  async execute(filePath: string, range: string): Promise<StreamResult> {
    return this.videoStreamService.streamVideo(filePath, range);
  }
}
