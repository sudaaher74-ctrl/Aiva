const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5001'),
  MONGODB_URI: z.string({ required_error: "MONGODB_URI is completely missing from the environment", invalid_type_error: "MONGODB_URI must be a string" }).min(1, "MongoDB URI cannot be empty"),
  JWT_SECRET: z.string({ required_error: "JWT_SECRET is completely missing from the environment", invalid_type_error: "JWT_SECRET must be a string" }).min(10, "JWT Secret must be at least 10 characters"),
  GEMINI_API_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string({ required_error: "CLOUDINARY_CLOUD_NAME is completely missing from the environment", invalid_type_error: "CLOUDINARY_CLOUD_NAME must be a string" }).min(1, "Cloudinary Cloud Name cannot be empty"),
  CLOUDINARY_API_KEY: z.string({ required_error: "CLOUDINARY_API_KEY is completely missing from the environment", invalid_type_error: "CLOUDINARY_API_KEY must be a string" }).min(1, "Cloudinary API Key cannot be empty"),
  CLOUDINARY_API_SECRET: z.string({ required_error: "CLOUDINARY_API_SECRET is completely missing from the environment", invalid_type_error: "CLOUDINARY_API_SECRET must be a string" }).min(1, "Cloudinary API Secret cannot be empty"),
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
      let message = issue.message;
      if (message.includes("expected string, received undefined") || message.includes("Required")) {
        message = "Variable is missing from the environment. Please add it to your Render settings.";
      }
      console.error(`  - ${issue.path.join('.')}: ${message}`);
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
