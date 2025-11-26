/**
 * Custom error class for configuration loading errors
 */
export class ConfigurationError extends Error {
    constructor(
        message: string,
        public readonly missingVars?: string[],
        public readonly parseErrors?: Array<{ key: string; error: string }>
    ) {
        super(message);
        this.name = 'ConfigurationError';
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ConfigurationError);
        }
    }
}

