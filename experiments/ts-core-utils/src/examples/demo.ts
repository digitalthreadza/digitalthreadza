import 'dotenv/config';
import { loadConfiguration, parsers } from '../index.js';

// Example 1: Using the configuration loader with inline definitions
const configurationSchema = {
    port: {
        envKey: 'PORT',
        required: true,
        parseFn: parsers.number,
    },
    apiUrl: {
        envKey: 'API_URL',
        required: true,
        parseFn: parsers.string,
    },
    enableAI: {
        envKey: 'ENABLE_AI',
        required: false,
        parseFn: parsers.boolean,
    },
} as const;

const configuration = loadConfiguration(configurationSchema);

console.log('Configuration loaded:', configuration);
console.log('Ready for action!');

