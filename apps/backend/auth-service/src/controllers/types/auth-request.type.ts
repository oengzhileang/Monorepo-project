export interface SignUpRequest {
  email: string;
  password: string;
}
export interface VerifyUserRequest {
  email: string;
  confirmationCode: string;
}
export interface SignInRequest {
  email: string;
  password: string;
}
export interface GoogleCallbackRequest {
  code?: string;
  state?: string;
}
