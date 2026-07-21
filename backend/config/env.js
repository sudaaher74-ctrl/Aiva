const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5001'),
  MONGODB_URI: z.string().min(1, "MongoDB URI is required"),
  JWT_SECRET: z.string().min(10, "JWT Secret must be at least 10 characters"),
  GEMINI_API_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "Cloudinary Cloud Name is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "Cloudinary API Key is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "Cloudinary API Secret is required"),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  CLIENT_URL: z.string().url().default('https://www.aivaenterprises.com'),
});

const validateEnv = () => {
  // Use safeParse to prevent immediate unhandled throws
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error('\n❌ STARTUP FAILED: Invalid or Missing Environment Variables:\n');
    
    // Developer friendly formatting
    parsed.error.issues.forEach(issue => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    
    console.error('\nPlease add these variables to your Render Environment settings.\n');
    process.exit(1);
  }
  
  // Expose validated environment variables
  for (const key in parsed.data) {
    process.env[key] = parsed.data[key];
  }
};

module.exports = validateEnv;
