export interface IVideoStreamService {
  streamVideo(filePath: string, range: string): Promise<StreamResult>;
}

export type StreamResult = {
  start: number;
  end: number;
  contentLength: string;
  contentType: string;
  stream: NodeJS.ReadableStream;
};
