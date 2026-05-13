package com.bank_app.backend.auth_users.services;

import com.bank_app.backend.auth_users.entity.PasswordResetCode;
import com.bank_app.backend.auth_users.repo.PasswordResetCodeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
@RequiredArgsConstructor
public class CodeGenerator {
    private final PasswordResetCodeRepo passwordResetCodeRepo;
    private static final String ALPHA_NUMBER = "ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    private static final int CODE_LENGTH = 5;
    
    public String generateCode() {
        String code;
        do{
            code = generateRandomCode();
            
        }while (passwordResetCodeRepo.findByCode(code).isPresent());
        
        return code;
    }

    private String generateRandomCode() {
        StringBuilder sb = new StringBuilder(ALPHA_NUMBER);
        SecureRandom random = new SecureRandom();

        for(int i = 0; i < CODE_LENGTH; i++){
            int index = random.nextInt(ALPHA_NUMBER.length());
            sb.append(ALPHA_NUMBER.charAt(index));
        }
        return sb.toString();
    }
}
