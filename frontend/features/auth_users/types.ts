export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  roles: string[];
}

export interface RegistrationRequest {
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role?: string[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  code: string;
  newPassword: string;
}