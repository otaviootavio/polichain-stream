import { Request, Response } from "express";
import { createReadStream, exists, promises, readFile } from "fs";
import path from "path";
import { gzip } from "zlib";

const serveM3U8Content = async (req: Request, res: Response) => {
  const uri = req.url;
  const base_path = path.resolve(__dirname, "../videos");
  const filename = path.join(base_path, uri);

  try {
    await promises.access(filename);

    console.log("sending file: " + filename);
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
  } catch (error) {
    console.log("file not found: " + filename);
    res
      .status(404)
      .contentType("text/plain")
      .send("file not found: " + filename);
  }
};

const serveTSContent = async (req: Request, res: Response) => {
  const uri = req.url;
  const base_path = path.resolve(__dirname, "../videos");
  const filename = path.join(base_path, uri);

  try {
    await promises.access(filename);

    console.log("sending file: " + filename);
    res.writeHead(200, { "Content-Type": "video/MP2T" });
    const stream = createReadStream(filename, { highWaterMark: 64 * 1024 });
    stream.pipe(res);
  } catch (error) {
    console.log("file not found: " + filename);
    res
      .status(404)
      .contentType("text/plain")
      .send("file not found: " + filename);
  }
};

export { serveM3U8Content, serveTSContent };
