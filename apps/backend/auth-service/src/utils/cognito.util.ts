import crypto from 'crypto';

/**
 * Generate a secret hash for AWS Cognito.
 * @param {string} username - The username of the user.
 * @param {string} clientId - The Cognito client ID.
 * @param {string} clientSecret - The Cognito client secret.
 * @returns {string} - The generated secret hash.
 */
export const generateSecretHash = (username: string, clientId: string, clientSecret: string): string => {
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64');
};
