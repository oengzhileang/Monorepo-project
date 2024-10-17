import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoConfig } from "../utils/cognito.config";
import { generateSecretHash } from "../utils/cognito.util";
import configs from "../config";
import crypto from "crypto";
import axios from "axios";
// Initialize Cognito Client
const cognitoClient = new CognitoIdentityProviderClient({
  region: cognitoConfig.region,
});

class AuthService {
  //sign up
  public async signUp(email: string, password: string) {
    const params = {
      ClientId: cognitoConfig.clientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
      SecretHash: generateSecretHash(
        email,
        cognitoConfig.clientId,
        cognitoConfig.clientSecret
      ), // Include the secret hash
    };
    try {
      const command = new SignUpCommand(params);
      const result = await cognitoClient.send(command);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //verify email with confirmcode
  public async verify(email: string, confirmationCode: string) {
    const params = {
      ClientId: cognitoConfig.clientId,
      Username: email, // Use the email as the username for confirmation
      ConfirmationCode: confirmationCode,
      SecretHash: generateSecretHash(
        email,
        cognitoConfig.clientId,
        cognitoConfig.clientSecret
      ), // Include the secret hash
    };
    try {
      const command = new ConfirmSignUpCommand(params);
      const result = await cognitoClient.send(command);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //sign in
  public async signIn(email: string, password: string) {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH" as const, // Use the `USER_PASSWORD_AUTH` flow for direct sign-in
      ClientId: cognitoConfig.clientId,
      AuthParameters: {
        USERNAME: email, // Use email as the username
        PASSWORD: password,
        SECRET_HASH: generateSecretHash(
          email,
          cognitoConfig.clientId,
          cognitoConfig.clientSecret
        ), // Include the secret hash if client secret is configured
      },
    };
    try {
      const command = new InitiateAuthCommand(params);
      const result = await cognitoClient.send(command);
      return result;
    } catch (error) {
      throw error;
    }
  }
  // public loginWithGoogle(state: string): string {
  //   // const state = crypto.randomBytes(16).toString('hex')
  //   const params = new URLSearchParams({
  //     response_type: "code",
  //     client_id: configs.COGNITO_CLIENT_ID,
  //     redirect_uri: configs.REDIRECT_URL,
  //     identity_provider: "google",
  //     scope: "openid profile email",
  //     state: state,
  //     prompt: "select_account",
  //   });
  //   const cognitoOAuthURL = `${
  //     configs.COGNITO_DOMAIN
  //   }/oauth/authorize?${params.toString()}`;
  //   console.log(cognitoOAuthURL);

  //   return cognitoOAuthURL;
  // }
  public loginWithGoogle(): string {
    const stateValue = crypto.randomBytes(16).toString("hex");

    const params = new URLSearchParams({
      response_type: "code",
      client_id: configs.awsCognitoClientId,
      redirect_uri: configs.awsRedirectUri,
      identity_provider: "Google",
      scope: "openid profile email",
      state: stateValue,
      prompt: "select_account",
    });
    const cognitoOAuthURL = `${
      configs.awsCognitoDomain
    }/oauth2/authorize?${params.toString()}`;

    return cognitoOAuthURL;
  }

  // Callback to get access token
  public async getToken(code: string, _state: string): Promise<any> {
    const tokenUrl = `${configs.awsCognitoDomain}/oauth2/token`;

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: configs.awsCognitoClientId,
      redirect_uri: configs.awsRedirectUri,
      code: code,
    });

    // Base64 encode client_id and client_secret (if required)
    const clientCredentials = `${configs.awsCognitoClientId}:${
      configs.awsCognitoClientSecret || ""
    }`;
    const encodedCredentials =
      Buffer.from(clientCredentials).toString("base64");

    try {
      const response = await axios.post(tokenUrl, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${encodedCredentials}`,
        },
      });

      return response.data; // Return the access token data
    } catch (error) {
      console.error("Failed to get tokens from Cognito:", error);
      throw new Error("Failed to get tokens from Cognito");
    }
  }
}
//add more method as need
export default new AuthService();
