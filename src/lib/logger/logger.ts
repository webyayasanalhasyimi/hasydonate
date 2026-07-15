type LogFn = (message: string, ...args: unknown[]) => void;

interface Logger {
  readonly info: LogFn;
  readonly warn: LogFn;
  readonly error: LogFn;
  readonly debug: LogFn;
}

const isProduction = process.env.NODE_ENV === "production";

export const logger: Logger = {
  info: (message: string, ...args: unknown[]): void => {
    console.info(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]): void => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]): void => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]): void => {
    if (!isProduction) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};
