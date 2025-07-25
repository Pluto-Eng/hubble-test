import { env, enable } from '@/lib/config';

export type shouldLog = (level: string) => boolean;
export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'log' | 'dir' | 'trace' | 'table';
export type LoggerFn = (scope: string, ...messages: any[]) => void;

export type LogFn = (level: LogLevel, emoji: string, color?: string, style1?: string, style2?: string) => LoggerFn;

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

// ANSI colors for server/terminal
const red = '\x1b[38;2;240;100;100m';
const pink = '\x1b[38;2;255;105;180m';
const blushPink = '\x1b[38;2;255;182;193m';
const lavenderMist = '\x1b[38;2;230;230;250m';
const lavender = '\x1b[38;2;216;191;216m';
const purple = '\x1b[38;2;180;140;255m';
const blue = '\x1b[34m';
const powderBlue = '\x1b[38;2;176;224;230m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const lightGray = '\x1b[38;2;180;180;180m';
const whiteSmoke = '\x1b[38;2;245;245;245m';

const bold = '\x1b[1m';
const italic = '\x1b[3m';
const underline = '\x1b[4m';
const reset = '\x1b[0m';

// CSS colors for browser
const browserColorMap = {
  [pink]: 'color: #ff69b4; font-weight: bold; text-decoration: underline;',
  [green]: 'color: #50c878; font-weight: bold;',
  [red]: 'color: #f06464; font-weight: bold;',
  [yellow]: 'color: #ffd700; font-style: italic;',
  [blushPink]: 'color: #ffb6c1;',
  [powderBlue]: 'color: #b0e0e6;',
  [blue]: 'color: #4a90e2;',
  [lavenderMist]: 'color: #e6e6fa;',
  [lavender]: 'color: #d8bfd8; font-style: italic;',
  [purple]: 'color: #b48cff;',
  [lightGray]: 'color: #b4b4b4;',
  [whiteSmoke]: 'color: #f5f5f5;',
};

const isBrowser = typeof window !== 'undefined';

const shouldLog: shouldLog = (level) => {
  // if (!enable.logging) return false;
  if (!enable.logging) return ['error', 'warn'].includes(level);
  else {
    // Setup global logs for all environments immediately
    (() => {
      if (typeof globalThis !== 'undefined') globalThis.log = log;
      if (typeof window !== 'undefined') (window as any).log = log;
      if (typeof global !== 'undefined') (global as any).log = log;
    })();

    return true;
  }
};

const inspectObject = async (obj: unknown): Promise<any> => {
  if (isBrowser) {
    // ALWAYS return raw object for browser display
    // Even if running on server, the logs might be forwarded to browser
    return obj; // browser devtools handle expansion natively
  } else {
    // Dynamically require util only on server to avoid bundling in client
    //     // Using require here because top-level import breaks client bundle
    //     // You can also do dynamic import but require is simpler in Node context
    const util = await import('util');
    return util.inspect(obj, { depth: null, colors: true, compact: false });
  }
};

const logFn: LogFn = (level, emoji, color = '', style1 = '', style2 = '') => {
  return async (...messages) => {
    if (!shouldLog(level)) return;

    const [scope, msg, ...args] = messages;
    if (!scope || typeof scope !== 'string') {
      throw new Error(`Logger: Missing scope in ${level} log`);
    }

    const prefix = isBrowser ? `[${scope}]` : `${style1}${style2}${color}[${scope}]${reset}`;

    const content = !msg ? `${prefix}` : isBrowser ? `${prefix} ${msg}` : `${prefix} ${msg}${reset}:`;

    const expandedArgs = await Promise.all(
      args.map((arg) => (typeof arg === 'object' && arg !== null ? inspectObject(arg) : arg))
    );

    (console as any)[level](`${emoji}`, `${content}`, ...expandedArgs);

    // (console as any)[level](`${emoji}`, `${content}`, ...args);
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
  middleware: logFn('info', '📣', lightGray),
};

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
