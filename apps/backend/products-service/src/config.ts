import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

type Config = {
  env: string;
  port: number;
  mongodbUrl: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_BUCKET_NAME: string;
  AWS_REGION: string;
  COGNITO_CLIENT_ID: string;
  COGNITO_USER_POOL_ID: string;
  COGNITO_CLIENT_SECRET: string;
  COGNITO_REDIRECT_URL: string;
  COGNITO_DOMAIN: string;
  GOOGLE_CLIENT_ID: string;
};

// Function to load and validate environment variables
function loadConfig(): Config {
  // Determine the environment and set the appropriate .env file
  const env = process.env.NODE_ENV || "development";
  const envPath = path.resolve(__dirname, `./configs/.env.${env}`);
  dotenv.config({ path: envPath });

  // Define a schema for the environment variables
  const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_BUCKET_NAME: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    COGNITO_CLIENT_ID: Joi.string().required(),
    COGNITO_USER_POOL_ID: Joi.string().required(),
    COGNITO_CLIENT_SECRET: Joi.string().required(),
    COGNITO_REDIRECT_URL: Joi.string(),
    COGNITO_DOMAIN: Joi.string(),
    GOOGLE_CLIENT_ID: Joi.string(),
  })
    .unknown()
    .required();

  // Validate the environment variables
  const { value: envVars, error } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongodbUrl: envVars.MONGODB_URL,
    AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: envVars.AWS_BUCKET_NAME,
    AWS_REGION: envVars.AWS_REGION,
    COGNITO_CLIENT_ID: envVars.COGNITO_CLIENT_ID,
    COGNITO_USER_POOL_ID: envVars.COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_SECRET: envVars.COGNITO_CLIENT_SECRET,
    COGNITO_REDIRECT_URL: envVars.COGNITO_REDIRECT_URL,
    COGNITO_DOMAIN: envVars.COGNITO_DOMAIN,
    GOOGLE_CLIENT_ID: envVars.GOOGLE_CLIENT_ID,
  };
}

// Export the loaded configuration
const configs = loadConfig();
export default configs;
