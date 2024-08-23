import winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const successLogger = createLogger({
  level: 'info',
  format: combine(timestamp(), customFormat),
  transports: [
    new transports.File({ filename: 'logs/success.log' })
  ]
});

const errorLogger = createLogger({
  level: 'error',
  format: combine(timestamp(), customFormat),
  transports: [
    new transports.File({ filename: 'logs/errors.log' })
  ]
});

export { successLogger, errorLogger };
