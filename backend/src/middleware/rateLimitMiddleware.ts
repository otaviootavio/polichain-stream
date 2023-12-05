import { Request, Response, NextFunction } from "express";

const requestTimestamps: Map<string, number> = new Map();

export function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const currentTime: number = Date.now();
  const clientIp: string = req.ip || "0";

  if (requestTimestamps.has(clientIp)) {
    const lastRequestTime = requestTimestamps.get(clientIp) || 0;
    if (currentTime - lastRequestTime < 100) {
      console.log(
        "Payment Required. Please wait before making another request."
      );
      res
        .status(402)
        .send("Payment Required. Please wait before making another request.");
      return;
    }
  }

  requestTimestamps.set(clientIp, currentTime);
  next();
}
