import type { ConfigurationItem, ConfigResult } from './types.js';
import { ConfigurationError } from './errors.js';

/**
 * Loads and validates configuration from environment variables based on a schema.
 * 
 * @param schema - An object where keys are config property names and values are ConfigurationItems
 * @returns A typed configuration object matching the schema
 * @throws {ConfigurationError} If required variables are missing or parsing fails
 * 
 * @example
 * ```typescript
 * const config = loadConfiguration({
 *   port: { envKey: 'PORT', required: true, parseFn: (v) => Number(v) },
 *   apiUrl: { envKey: 'API_URL', required: false, parseFn: (v) => v, defaultValue: 'http://localhost' }
 * });
 * // Type: { port: number; apiUrl: string | undefined }
 * ```
 */
export function loadConfiguration<T extends Record<string, ConfigurationItem<any>>>(
    schema: T
): ConfigResult<T> {
    const result = {} as ConfigResult<T>;
    const missing: string[] = [];
    const parseErrors: Array<{ key: string; error: string }> = [];
    
    for (const [key, item] of Object.entries(schema)) {
        const envValue = process.env[item.envKey];
        
        // Handle required fields
        if (item.required) {
            if (!envValue || envValue === '') {
                missing.push(`"${item.envKey}" (used by "${key}")`);
                continue;
            }
            
            try {
                result[key as keyof T] = item.parseFn(envValue) as any;
            } catch (error) {
                parseErrors.push({ 
                    key: item.envKey, 
                    error: error instanceof Error ? error.message : String(error) 
                });
            }
        } else {
            // Handle optional fields
            if (envValue && envValue !== '') {
                try {
                    result[key as keyof T] = item.parseFn(envValue) as any;
                } catch (error) {
                    parseErrors.push({ 
                        key: item.envKey, 
                        error: error instanceof Error ? error.message : String(error) 
                    });
                }
            } else if ('defaultValue' in item && item.defaultValue !== undefined) {
                result[key as keyof T] = item.defaultValue as any;
            } else {
                result[key as keyof T] = undefined as any;
            }
        }
    }
    
    // Throw comprehensive error if any issues
    if (missing.length > 0 || parseErrors.length > 0) {
        const messages: string[] = [];
        
        if (missing.length > 0) {
            messages.push(
                `Missing required environment variables:\n${missing.map(m => `  - ${m}`).join('\n')}`
            );
        }
        
        if (parseErrors.length > 0) {
            messages.push(
                `Parse errors:\n${parseErrors.map(e => `  - ${e.key}: ${e.error}`).join('\n')}`
            );
        }
        
        throw new ConfigurationError(
            messages.join('\n\n'),
            missing,
            parseErrors
        );
    }
    
    return result;
}

