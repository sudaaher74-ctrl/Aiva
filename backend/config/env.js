const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5001'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters long'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
});

const validateEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    process.exit(1);
  }
  
  // Expose validated environment variables
  for (const key in parsed.data) {
    process.env[key] = parsed.data[key];
  }
};

module.exports = validateEnv;
