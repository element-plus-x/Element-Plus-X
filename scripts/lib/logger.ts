const colors = {
  reset: '\x1B[0m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  cyan: '\x1B[36m',
  red: '\x1B[31m',
  dim: '\x1B[2m',
  bold: '\x1B[1m'
};

export type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

export interface LoggerOptions {
  prefix?: string;
  color?: boolean;
}

export class Logger {
  private prefix: string;
  private color: boolean;

  constructor(options?: LoggerOptions) {
    this.prefix = options?.prefix || '';
    this.color = options?.color !== false;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString().slice(11, 19);
    const prefix = this.prefix ? `[${this.prefix}] ` : '';
    const coloredTimestamp = this.color
      ? `${colors.dim}${timestamp}${colors.reset}`
      : timestamp;

    let levelStr = level.toUpperCase().padEnd(7);
    if (this.color) {
      switch (level) {
        case 'success':
          levelStr = `${colors.green}${levelStr}${colors.reset}`;
          break;
        case 'warn':
          levelStr = `${colors.yellow}${levelStr}${colors.reset}`;
          break;
        case 'error':
          levelStr = `${colors.red}${levelStr}${colors.reset}`;
          break;
        case 'info':
          levelStr = `${colors.cyan}${levelStr}${colors.reset}`;
          break;
        default:
          break;
      }
    }

    return `${coloredTimestamp} ${levelStr} ${prefix}${message}`;
  }

  info(message: string): void {
    console.log(this.formatMessage('info', message));
  }

  success(message: string): void {
    console.log(this.formatMessage('success', message));
  }

  warn(message: string): void {
    console.warn(this.formatMessage('warn', message));
  }

  error(message: string): void {
    console.error(this.formatMessage('error', message));
  }

  debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(this.formatMessage('debug', message));
    }
  }

  step(step: number, total: number, message: string): void {
    const stepStr = `[${step}/${total}]`;
    const formatted = this.color
      ? `${colors.bold}${stepStr}${colors.reset} ${message}`
      : `${stepStr} ${message}`;
    console.log(formatted);
  }

  group(title: string): void {
    console.log(
      this.color
        ? `\n${colors.cyan}▶ ${title}${colors.reset}`
        : `\n▶ ${title}`
    );
  }

  divider(char = '─', length = 50): void {
    console.log(char.repeat(length));
  }
}

export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}

export const logger = new Logger();
