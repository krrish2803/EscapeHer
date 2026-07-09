const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

const currentLevel = LOG_LEVELS.indexOf(process.env.LOG_LEVEL || 'info');

function shouldLog(level) {
  return LOG_LEVELS.indexOf(level) >= currentLevel;
}

const logger = {
  debug: (...args) => {
    if (shouldLog('debug')) console.log('[DEBUG]', new Date().toISOString(), ...args);
  },
  info: (...args) => {
    if (shouldLog('info')) console.log('[INFO]', new Date().toISOString(), ...args);
  },
  warn: (...args) => {
    if (shouldLog('warn')) console.warn('[WARN]', new Date().toISOString(), ...args);
  },
  error: (...args) => {
    if (shouldLog('error')) console.error('[ERROR]', new Date().toISOString(), ...args);
  },
};

module.exports = logger;
