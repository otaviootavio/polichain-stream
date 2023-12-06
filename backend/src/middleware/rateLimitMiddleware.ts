import { Request, Response, NextFunction } from "express";

const requestData: Map<string, [number, number]> = new Map();

export function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const currentTime: number = Date.now();
  const clientIp: string = req.ip || "0";

  if (!requestData.has(clientIp)) {
    requestData.set(clientIp, [currentTime, 0]);
    next();
    return;
  }

  const ipData = requestData.get(clientIp) || [0, 0];
  const lastRequestTime = ipData[0];
  const lastCount = ipData[1];
  console.log(ipData.toString());

  if (currentTime - lastRequestTime > 5000) {
    console.log("Reset counter");
    requestData.set(clientIp, [currentTime, 0]);
    next();
    return;
  }

  if (lastCount > 3) {
    console.log("Too many requests");
    res
      .status(402)
      .send("Payment Required. Please wait before making another request.");
    return;
  }

  requestData.set(clientIp, [currentTime, lastCount + 1]);
  next();
}
