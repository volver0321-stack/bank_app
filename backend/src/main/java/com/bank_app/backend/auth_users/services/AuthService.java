package com.bank_app.backend.auth_users.services;


import com.bank_app.backend.auth_users.dto.LoginRequest;
import com.bank_app.backend.auth_users.dto.LoginResponse;
import com.bank_app.backend.auth_users.dto.RegistrationRequest;
import com.bank_app.backend.auth_users.dto.ResetPasswordRequest;
import com.bank_app.backend.res.Response;

public interface AuthService {
    Response<String> register(RegistrationRequest request);
    Response<LoginResponse> login(LoginRequest loginRequest);
    Response<?> forgetPassword(String email);
    Response<?> updatePasswordViaResetCode(ResetPasswordRequest resetPasswordRequest);

}
