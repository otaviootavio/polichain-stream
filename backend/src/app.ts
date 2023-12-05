import express from "express";
import videoRoutes from "./interfaces/routes/videoRoutes";
import cors from "cors";
import { rateLimitMiddleware } from "./middleware/rateLimitMiddleware";

const app = express();
const PORT = 3000;

app.use(cors());

app.use(rateLimitMiddleware);

app.use("/api", videoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
