import type { ConfigurationItem, RequiredConfigItem, OptionalConfigItem } from './types.js';

/**
 * Helper function to create a required configuration item
 */
export function createRequiredConfigItem<T>(
    envKey: string,
    parseFn: (value: string) => T
): RequiredConfigItem<T> {
    return {
        envKey,
        required: true,
        parseFn,
    };
}

/**
 * Helper function to create an optional configuration item
 */
export function createOptionalConfigItem<T>(
    envKey: string,
    parseFn: (value: string) => T,
    defaultValue?: T
): OptionalConfigItem<T> {
    return {
        envKey,
        required: false,
        parseFn,
        defaultValue,
    };
}

/**
 * Helper function to create a configuration item (required or optional based on parameters)
 */
export function createConfigItem<T>(
    envKey: string,
    parseFn: (value: string) => T,
    options?: { required?: boolean; defaultValue?: T }
): ConfigurationItem<T> {
    if (options?.required === false || options?.defaultValue !== undefined) {
        return createOptionalConfigItem(envKey, parseFn, options.defaultValue);
    }
    return createRequiredConfigItem(envKey, parseFn);
}

