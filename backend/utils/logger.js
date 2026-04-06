const logger = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },
  error: (label, error) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${label}`, error);
  },
  warn: (message) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  },
  debug: (message) => {
    if (process.env.LOG_LEVEL === "debug") {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    }
  },
};

module.exports = logger;