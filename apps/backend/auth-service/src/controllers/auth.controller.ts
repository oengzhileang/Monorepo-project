import {
  Controller,
  Post,
  Route,
  Tags,
  Body,
  Request,
  Get,
  Queries,
} from "tsoa";
import {
  SignUpRequest,
  VerifyUserRequest,
  SignInRequest,
  GoogleCallbackRequest,
} from "./types/auth-request.type";
import AuthService from "../services/auth.service";
import setCookiee from "../utils/cookiee";
import { Request as ExpressRequest, Response } from "express";
import sendResponse from "../utils/send-response";

@Route("v1/auth")
@Tags("Authentication")
export class AuthController extends Controller {
  //sign up
  @Post("/sign-up")
  async registerUser(@Body() requestBody: SignUpRequest) {
    const { email, password } = requestBody;
    try {
      const result = await AuthService.signUp(email, password);
      return {
        message: "Sign up successfully",
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  //verify
  @Post("/verify-email")
  async verifyEmail(@Body() requestBody: VerifyUserRequest) {
    const { email, confirmationCode } = requestBody;
    try {
      const verifyEmail = await AuthService.verify(email, confirmationCode);
      return {
        message: "Email verified successfully",
        data: verifyEmail,
      };
    } catch (error) {
      throw error;
    }
  }

  //sign in
  @Post("/sign-in")
  async loginUser(
    @Request() request: ExpressRequest,
    @Body() requestBody: SignInRequest
  ) {
    try {
      const { email, password } = requestBody;
      const authResult = await AuthService.signIn(email, password);
      const response = (request as any).res as Response;
      // return {
      //   message: "User signed in successfully",
      //   accessToken: authResult.AuthenticationResult?.AccessToken,
      //   idToken: authResult?.AuthenticationResult?.IdToken,
      //   refreshToken: authResult?.AuthenticationResult?.RefreshToken,
      // };
      setCookiee(
        response,
        "id_token",
        authResult.AuthenticationResult?.IdToken || ""
      );
      setCookiee(
        response,
        "access_token",
        authResult.AuthenticationResult?.AccessToken || ""
      );
      setCookiee(
        response,
        "refresh_token",
        authResult.AuthenticationResult?.RefreshToken || "",
        { maxAge: 30 * 24 * 3600 * 100 }
      );
      return sendResponse({ message: "Sign in successfully" });
    } catch (error) {
      throw error;
    }
  }

  //login with google
  @Get("/google/login")
  public loginWithGoogle() {
    const cognitoOAuthURL = AuthService.loginWithGoogle();
    return sendResponse({
      message: "Login with google successfully",
      data: cognitoOAuthURL,
    });
  }

  @Get("/google/callback")
  public async getToken(
    // @Query() code: string,
    // @Query() state: string
    @Request() request: ExpressRequest,
    @Queries() query: GoogleCallbackRequest
  ): Promise<any> {
    try {
      // const code = request.query.code as string;
      // const state = request.query.state as string;
      const { code, state } = query;
      if (!code || !state) {
        return sendResponse({
          message: "Authorization failed",
          data: null,
        });
      }
      // if (!code) {
      //   return sendResponse({
      //     message: "Authorization failed",
      //     data: null,
      //   });
      // }
      const tokenData = await AuthService.getToken(code, state);
      const response = (request as any).res as Response;
      setCookiee(response, "id_token", tokenData.id_token);
      setCookiee(response, "access_token", tokenData.access_token);
      setCookiee(response, "refresh_token", tokenData.refresh_token);
      return sendResponse({
        message: "Access token retrieved successfully",
        data: tokenData,
      });
    } catch (error) {
      console.error("Failed to retrieve access token:", error);
    }
  }
}
