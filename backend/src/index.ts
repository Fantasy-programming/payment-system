import app from "./app";
import logger from "./logger";
import { PORT } from "./env";

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
