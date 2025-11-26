/**
 * Common parser functions for environment variables
 */
export const parsers = {
    /**
     * Parse as string (no transformation)
     */
    string: (value: string): string => value,

    /**
     * Parse as number, throws if invalid
     */
    number: (value: string): number => {
        const num = Number(value);
        if (isNaN(num)) {
            throw new Error(`Invalid number: "${value}"`);
        }
        return num;
    },

    /**
     * Parse as integer, throws if invalid
     */
    integer: (value: string): number => {
        const num = parseInt(value, 10);
        if (isNaN(num)) {
            throw new Error(`Invalid integer: "${value}"`);
        }
        return num;
    },

    /**
     * Parse as boolean (true if value is exactly "true", case-sensitive)
     */
    boolean: (value: string): boolean => value === 'true',

    /**
     * Parse as boolean (case-insensitive)
     */
    booleanCaseInsensitive: (value: string): boolean => 
        value.toLowerCase() === 'true',

    /**
     * Parse as array of strings (comma-separated)
     */
    stringArray: (value: string): string[] => 
        value.split(',').map(s => s.trim()).filter(s => s.length > 0),

    /**
     * Parse as array of numbers (comma-separated)
     */
    numberArray: (value: string): number[] => {
        const parts = value.split(',').map(s => s.trim());
        return parts.map(part => {
            const num = Number(part);
            if (isNaN(num)) {
                throw new Error(`Invalid number in array: "${part}"`);
            }
            return num;
        });
    },
} as const;

