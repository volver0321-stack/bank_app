package com.bank_app.backend.exceptions;

import lombok.RequiredArgsConstructor;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntrypoint implements AuthenticationEntryPoint {

}
