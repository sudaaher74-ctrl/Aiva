const { z } = require('zod');

const DEFAULT_MONGODB_URI = 'mongodb+srv://milquufresh_db_user:Aiva2026@cluster0.ws9o2vv.mongodb.net/aiva_enterprises?retryWrites=true&w=majority&appName=Cluster0';
const DEFAULT_JWT_SECRET = 'aiva_enterprises_default_secure_jwt_secret_key_2026';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.union([z.string(), z.number()]).transform(Number).default(5001),
  MONGODB_URI: z.string().default(DEFAULT_MONGODB_URI),
  JWT_SECRET: z.string().default(DEFAULT_JWT_SECRET),
  JWT_EXPIRES_IN: z.string().default('1d'),
  GEMINI_API_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().default('dlnwesyzg'),
  CLOUDINARY_API_KEY: z.string().default('869319942229288'),
  CLOUDINARY_API_SECRET: z.string().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  CLIENT_URL: z.string().default('https://www.aivaenterprises.com,https://aivaenterprises.com'),
});

const validateEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.warn('⚠️ Environment validation warnings (using defaults):', parsed.error.issues);
  }

  // Populate validated environment variables onto process.env
  const data = parsed.success ? parsed.data : {
    MONGODB_URI: DEFAULT_MONGODB_URI,
    JWT_SECRET: DEFAULT_JWT_SECRET,
    PORT: 5001,
    NODE_ENV: process.env.NODE_ENV || 'production'
  };

  for (const key in data) {
    if (!process.env[key] && data[key] !== undefined) {
      process.env[key] = String(data[key]);
    }
  }
};

module.exports = validateEnv;
