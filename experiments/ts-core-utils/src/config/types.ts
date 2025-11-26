/**
 * Required configuration item - must have a value from environment
 */
export interface RequiredConfigItem<T> {
    envKey: string;
    required: true;
    parseFn: (value: string) => T;
}

/**
 * Optional configuration item - can have a default value or be undefined
 */
export interface OptionalConfigItem<T> {
    envKey: string;
    required: false;
    parseFn: (value: string) => T;
    defaultValue?: T;
}

/**
 * A configuration item that can be either required or optional
 */
export type ConfigurationItem<T> = RequiredConfigItem<T> | OptionalConfigItem<T>;

/**
 * Result type that maps configuration schema to typed values.
 * Required items are never undefined, optional items can be undefined.
 */
export type ConfigResult<T extends Record<string, ConfigurationItem<any>>> = {
    [K in keyof T]: 
        T[K] extends RequiredConfigItem<infer V> 
            ? V  // Required: never undefined
        : T[K] extends OptionalConfigItem<infer V>
            ? V | undefined  // Optional: can be undefined
        : never;
};

