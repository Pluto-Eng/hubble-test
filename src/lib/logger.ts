import { enable } from '@/lib/config';

export type shouldLog = (level: string) => boolean;
export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'log' | 'dir' | 'trace' | 'table';
export type LoggerFn = (scope: string, ...messages: any[]) => void;

export type LogFn = (
  level: LogLevel,
  emoji: string,
  color?: string,
  style1?: string,
  style2?: string
) => LoggerFn;

export interface Logger {
  start: LoggerFn;
  success: LoggerFn;
  error: LoggerFn;
  warn: LoggerFn;

  requestBody: LoggerFn;
  responsePayload: LoggerFn;
  fetched: LoggerFn;

  info: LoggerFn;
  debug: LoggerFn;
  trace: LoggerFn;
  table: LoggerFn;
  check: LoggerFn;
  middleware: LoggerFn;
}

const red = "\x1b[38;2;240;100;100m";
const pink = "\x1b[38;2;255;105;180m";
const blushPink = "\x1b[38;2;255;182;193m";
const lavenderMist = "\x1b[38;2;230;230;250m";
const lavender = "\x1b[38;2;216;191;216m";
const purple = "\x1b[38;2;180;140;255m";
const blue = "\x1b[34m";
const powderBlue = "\x1b[38;2;176;224;230m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const lightGray = "\x1b[38;2;180;180;180m";
const whiteSmoke = "\x1b[38;2;245;245;245m";

const bold = "\x1b[1m";
const italic = "\x1b[3m";
const underline = "\x1b[4m";
const reset = "\x1b[0m";

const isBrowser = typeof window !== 'undefined';

const shouldLog: shouldLog = (level) => {
  if (!enable.logging) return ['error', 'warn'].includes(level);
  return true;
};

const logFn: LogFn = (level, emoji, color = '', style1 = '', style2 = '') => {
  return (...messages) => {
    if (!shouldLog(level)) return;

    const [scope, msg, ...args] = messages;
    if (!scope || typeof scope !== 'string') {
      throw new Error(`Logger: Missing scope in ${level} log`);
    }

    const prefix = isBrowser
      ? `[${scope}]`
      : `${style1}${style2}${color}[${scope}]${reset}`;

    const content = !msg ? `${prefix}` : isBrowser
      ? `${prefix} ${msg}`
      : `${prefix} ${msg}${reset}:`;

    (console as any)[level](`${emoji}`, `${content}`, ...args);
  };
};

export const log: Logger = {
  start: logFn('info', '🚀', pink, underline, bold),
  success: logFn('log', '✅', green, bold),
  error: logFn('error', '❌', red, bold),
  warn: logFn('warn', '⚠️ ', yellow, italic),

  requestBody: logFn('log', '📦', powderBlue),
  responsePayload: logFn('log', '📤', blue),
  fetched: logFn('log', '🧾', lavenderMist),

  info: logFn('info', '👀', blushPink),
  debug: logFn('debug', '🐛', lavender, italic),
  trace: logFn('trace', '🔍', whiteSmoke, italic),
  table: logFn('table', '📊', whiteSmoke),
  check: logFn('log', '❓', purple),
  middleware: logFn('info', '📣', lightGray)
};

// Immediate global setup for all environments
(() => {
  if (typeof globalThis !== 'undefined') globalThis.log = log;
  if (typeof window !== 'undefined') (window as any).log = log;
  if (typeof global !== 'undefined') (global as any).log = log;
})();

// //other console methods
// console.group("First group"); //first group
// console.groupCollapsed("Collapsed group"); //second group but expanded by default
// console.groupEnd(); //ends the first group

// console.table();
// console.timeEnd("MyTimer")
// console.trace() //to see how the code got to this point
// console.count("MyTimer") //counts the number of times this is called
// console.countReset("MyTimer") //resets the count
// // console.clear() //clears the console
