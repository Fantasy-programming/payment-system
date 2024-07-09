const app = require("./app");
const logger = require("./lib/logger");
const config = require("./lib/config");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
