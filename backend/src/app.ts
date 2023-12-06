import express from "express";
import videoRoutes from "./videoRoutes";
import cors from "cors";

const app = express();
const PORT = 8000;

app.use(cors());
app.use("/", videoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
