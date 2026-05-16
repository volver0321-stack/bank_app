import { apiClient } from "@/lib/api/client";
import { ForgotPasswordRequest, LoginRequest, LoginResponse, RegistrationRequest, ResetPasswordRequest } from "./types";
import { ApiResponse } from "@/lib/api/type";
import { API_ENDPOINT } from "@/lib/api/endpoints";


export async function login(payload: LoginRequest) {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    API_ENDPOINT.auth.login,
    payload
  );
  return response.data;
}


export async function register(payload: RegistrationRequest) {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    API_ENDPOINT.auth.register,
    payload
  );
  return response.data;
}

export async function forgotPassword(payload: ForgotPasswordRequest) {
  const response = await apiClient.post<ApiResponse<string>>(
    API_ENDPOINT.auth.forgotPassword,
    payload
  );
  return response.data;
}

export async function resetPassword(payload: ResetPasswordRequest) {
  const response = await apiClient.post<ApiResponse<void>>(
    API_ENDPOINT.auth.resetPassword,
    payload
  );
  return response.data;
}

