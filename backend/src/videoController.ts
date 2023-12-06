import { Request, Response } from "express";
import { createReadStream, exists, readFile } from "fs";
import path from "path";
import { gzip } from "zlib";

const serveVideoPlayer = (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./views/videoPlayer.html"));
};

const serveHLSContent = (req: Request, res: Response) => {
  const uri = req.url;
  const base_path = path.resolve(__dirname, "../videos");
  const filename = path.join(base_path, uri);

  exists(filename, (exists) => {
    if (!exists) {
      console.log("file not found: " + filename);
      res
        .status(404)
        .contentType("text/plain")
        .send("file not found: " + filename);
      return;
    }

    console.log("sending file: " + filename);
    switch (path.extname(uri)) {
      case ".m3u8":
        readFile(filename, (err, contents) => {
          if (err) {
            res.status(500).end();
            return;
          }

          if (contents) {
            const ae = req.headers["accept-encoding"] || "";
            if (ae.includes("gzip")) {
              gzip(contents, (err, zip) => {
                if (err) {
                  res.status(500).end();
                  return;
                }
                res.writeHead(200, {
                  "Content-Type": "application/vnd.apple.mpegurl",
                  "Content-Encoding": "gzip",
                });
                res.end(zip);
              });
            } else {
              res.writeHead(200, {
                "Content-Type": "application/vnd.apple.mpegurl",
              });
              res.end(contents, "utf-8");
            }
          } else {
            console.log("empty playlist");
            res.status(500).end();
          }
        });
        break;

      case ".ts":
        res.writeHead(200, { "Content-Type": "video/MP2T" });
        const stream = createReadStream(filename, {
          highWaterMark: 64 * 1024,
        });
        stream.pipe(res);
        break;

      default:
        console.log("unknown file type: " + path.extname(uri));
        res.status(500).end();
    }
  });
};

export { serveVideoPlayer, serveHLSContent };
