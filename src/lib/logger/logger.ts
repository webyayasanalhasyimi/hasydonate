type LogContext = Record<string, unknown> | Error;
type LogFn = (message: string, context?: LogContext) => void;

interface Logger {
  readonly info: LogFn;
  readonly warn: LogFn;
  readonly error: LogFn;
  readonly debug: LogFn;
}

const isProduction = process.env.NODE_ENV === "production";

const formatLog = (level: string, message: string, context?: LogContext): string => {
  const timestamp = new Date().toISOString();
  
  const logData: Record<string, unknown> = {
    timestamp,
    level,
    message,
  };

  if (context) {
    if (context instanceof Error) {
      logData.error = {
        name: context.name,
        message: context.message,
        stack: isProduction ? undefined : context.stack,
      };
    } else {
      // Redact sensitive keys
      const sanitized = JSON.parse(
        JSON.stringify(context, (key, value) => {
          const lowerKey = key.toLowerCase();
          if (
            lowerKey.includes("key") ||
            lowerKey.includes("secret") ||
            lowerKey.includes("password") ||
            lowerKey.includes("token")
          ) {
            return "[REDACTED]";
          }
          return value;
        })
      ) as Record<string, unknown>;
      logData.context = sanitized;
    }
  }

  if (isProduction) {
    return JSON.stringify(logData);
  } else {
    const contextStr = logData.context ? ` | Context: ${JSON.stringify(logData.context)}` : "";
    const errorObj = logData.error as Record<string, string> | undefined;
    const errorStr = errorObj
      ? ` | Error: ${errorObj.message}${errorObj.stack ? `\n${errorObj.stack}` : ""}`
      : "";
    return `[${timestamp}] [${level}] ${message}${contextStr}${errorStr}`;
  }
};

export const logger: Logger = {
  info: (message, context) => {
    console.info(formatLog("INFO", message, context));
  },
  warn: (message, context) => {
    console.warn(formatLog("WARN", message, context));
  },
  error: (message, context) => {
    console.error(formatLog("ERROR", message, context));
  },
  debug: (message, context) => {
    if (!isProduction) {
      console.debug(formatLog("DEBUG", message, context));
    }
  },
};

