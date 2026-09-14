// src/utils/logger.ts
type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'message';

const COLORS: Record<LogLevel, string> = {
  info: '\x1b[36m',    // cyan
  success: '\x1b[32m', // green
  warn: '\x1b[33m',    // yellow
  error: '\x1b[31m',   // red
  message: '\x1b[35m', // magenta
};
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function format(level: LogLevel, msg: string): string {
  const time = new Date().toISOString().replace('T', ' ').slice(0, 19);
  return `${COLORS[level]}${BOLD}[${level.toUpperCase()}]${RESET} ${COLORS[level]}${time}${RESET} │ ${msg}`;
}

export const logger = {
  info: (msg: string) => console.log(format('info', msg)),
  success: (msg: string) => console.log(format('success', msg)),
  warn: (msg: string) => console.warn(format('warn', msg)),
  error: (msg: string) => console.error(format('error', msg)),

  message: (data: {
    from: string;
    group: string;
    type: string;
    timestamp: Date;
  }) => {
    const hora = data.timestamp.toLocaleTimeString('es-CO');
    console.log(
      `${COLORS.message}${BOLD}[MSG]${RESET} ${COLORS.message}${hora}${RESET} │ ` +
      `Grupo: ${data.group.split('@')[0]} │ De: ${data.from.split('@')[0]} │ Tipo: ${data.type}`
    );
  },
};