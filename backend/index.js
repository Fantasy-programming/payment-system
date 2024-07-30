import app from "./app.js";
import logger from "./lib/logger.js";
import config from "./lib/config.js";

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
