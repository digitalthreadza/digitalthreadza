/**
 * Public API exports for ts-core-utils
 */

// Main configuration loader
export { loadConfiguration } from './config/loadConfiguration.js';

// Types
export type {
    ConfigurationItem,
    RequiredConfigItem,
    OptionalConfigItem,
    ConfigResult,
} from './config/types.js';

// Common parsers
export { parsers } from './config/parsers.js';

// Helper functions
export {
    createConfigItem,
    createRequiredConfigItem,
    createOptionalConfigItem,
} from './config/helpers.js';

// Errors
export { ConfigurationError } from './config/errors.js';
