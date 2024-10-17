import configs from "@/src/config";
export const cognitoConfig = {
  region: configs.awsCognitoRegion, // e.g., 'us-east-1'
  clientId: configs.awsCognitoClientId,
  userPoolId: configs.awsCognitoUserPoolId,
  clientSecret: configs.awsCognitoClientSecret,
};
