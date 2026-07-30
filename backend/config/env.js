const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5001'),
  MONGODB_URI: z.string({ required_error: "MONGODB_URI is completely missing from the environment", invalid_type_error: "MONGODB_URI must be a string" }).min(1, "MongoDB URI cannot be empty"),
  JWT_SECRET: z.string({ required_error: "JWT_SECRET is completely missing from the environment", invalid_type_error: "JWT_SECRET must be a string" }).min(10, "JWT Secret must be at least 10 characters"),
  JWT_EXPIRES_IN: z.string().default('1d'),
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
    console.error('\n');
    
    const varDescriptions = {
      MONGODB_URI: {
        desc: "Used for connecting to the MongoDB database.",
        example: "MONGODB_URI=mongodb+srv://<user>:<password>@cluster..."
      },
      JWT_SECRET: {
        desc: "Used for signing JWT authentication tokens.",
        example: "JWT_SECRET=your-secret-key"
      },
      JWT_EXPIRES_IN: {
        desc: "Expiration time for JWT authentication tokens.",
        example: "JWT_EXPIRES_IN=1d"
      },
      CLOUDINARY_CLOUD_NAME: {
        desc: "Used to connect to Cloudinary for image storage.",
        example: "CLOUDINARY_CLOUD_NAME=your_cloud_name"
      },
      CLOUDINARY_API_KEY: {
        desc: "API Key for Cloudinary image uploads.",
        example: "CLOUDINARY_API_KEY=your_api_key"
      },
      CLOUDINARY_API_SECRET: {
        desc: "API Secret for Cloudinary image uploads.",
        example: "CLOUDINARY_API_SECRET=your_api_secret"
      }
    };
    
    parsed.error.issues.forEach(issue => {
      const varName = issue.path[0];
      const details = varDescriptions[varName] || {
        desc: "Required environment variable.",
        example: `${varName}=your_value`
      };
      
      console.error(`❌ Missing Environment Variable\n`);
      console.error(`Variable:\n${varName}\n`);
      console.error(`Purpose:\n${details.desc}\n`);
      console.error(`Current Value:\nUndefined\n`);
      console.error(`How to Fix:\nRender Dashboard\n→ Environment\n→ Add ${varName}\n`);
      console.error(`Example:\n${details.example}\n`);
      console.error(`-------------------------------------------------\n`);
    });
    
    process.exit(1);
  }
  
  // Expose validated environment variables
  for (const key in parsed.data) {
    process.env[key] = parsed.data[key];
  }
};

module.exports = validateEnv;
