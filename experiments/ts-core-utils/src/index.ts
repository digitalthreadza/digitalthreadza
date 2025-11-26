import 'dotenv/config';
import * as z from "zod"; 

const configurationSchema = z.object({
    port: z.number().default(3000),
    apiUrl: z.string().default('http://localhost:3000'),
    enableAI: z.boolean().default(false),
});

const configuration = configurationSchema.safeParse( {
    port: parseInt(process.env.PORT || '3000'),
    apiUrl: process.env.API_URL,
    enableAI: process.env.ENABLE_AI === 'true',
});

console.log(configuration);

