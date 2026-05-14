package com.bank_app.backend.auth_users.services.impl;

import com.bank_app.backend.auth_users.dto.LoginRequest;
import com.bank_app.backend.auth_users.dto.LoginResponse;
import com.bank_app.backend.auth_users.dto.RegistrationRequest;
import com.bank_app.backend.auth_users.dto.ResetPasswordRequest;
import com.bank_app.backend.auth_users.entity.PasswordResetCode;
import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.auth_users.repo.PasswordResetCodeRepo;
import com.bank_app.backend.auth_users.repo.UserRepo;
import com.bank_app.backend.auth_users.services.AuthService;
import com.bank_app.backend.auth_users.services.CodeGenerator;
import com.bank_app.backend.enums.AccountType;
import com.bank_app.backend.enums.Currency;
import com.bank_app.backend.exceptions.BadRequestException;
import com.bank_app.backend.exceptions.NotFoundException;
import com.bank_app.backend.notification.dto.NotificationDTO;
import com.bank_app.backend.notification.services.NotificationService;
import com.bank_app.backend.res.Response;
import com.bank_app.backend.role.entity.Role;
import com.bank_app.backend.role.repo.RoleRepo;
import com.bank_app.backend.security.TokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final NotificationService notificationService;

    private final CodeGenerator codeGenerator;
    private final PasswordResetCodeRepo passwordResetCodeRepo;
    @Value("${password.reset.link}")
    private String resetLink;

    @Override
    public Response<String> register(RegistrationRequest request) {
        List<Role> roles;
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            Role defaultRole = roleRepo.findByName("CUSTOMER")
                    .orElseThrow(() -> new NotFoundException("CUSTOMER ROLE NOT FOUND"));
            roles = Collections.singletonList(defaultRole);
        } else {
            roles = request.getRoles().stream()
                    .map(roleName -> roleRepo.findByName(roleName).orElseThrow(() -> new NotFoundException("ROLE NOT FOUND" + roleName)))
                    .toList();
        }

        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("EMAIL ALREADY EXISTS");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .active(true)
                .build();

        User savedUser = userRepo.save(user);

//         todo auth generate an account number for the user
//        Account savedAccount = accountServise.createAccount(AccountType.SAVINGS, savedUser);

        //send a welcome email
        Map<String, Object> map = new HashMap<>();
        map.put("name", savedUser.getFirstName());

        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(savedUser.getEmail())
                .subject("Welcome to Bank App")
                .templateName("welcome")
                .templateVariables(map)
                .build();

        notificationService.sendEmail(notificationDTO, savedUser);

        //send account creation/detaails email
        Map<String, Object> accountVars = new HashMap<>();
        accountVars.put("name", savedUser.getFirstName());
//        accountVars.put("accountNumber", savedAccount.getAccountNumber());
        accountVars.put("accountType", AccountType.SAVINGS.getLabel());
        accountVars.put("currency", Currency.USD);

        NotificationDTO accountCreatedEmail = NotificationDTO.builder()
                .recipient(savedUser.getEmail())
                .subject("You New Bank Account Has Been Created")
                .templateName("account-created")
                .templateVariables(accountVars)
                .build();

        notificationService.sendEmail(accountCreatedEmail, savedUser);

        return Response.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Your account has been created successfully")
//                .data("Email of your account details has been sent to you. Your account number is :" + savedAccount.getAccountNumber())
                .build();

    }

    @Override
    public Response<LoginResponse> login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        User user = userRepo.findByEmail(email).orElseThrow(() -> new NotFoundException("EMAIL NOT FOUND"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("INVALID PASSWORD");
        }

        String token = tokenService.generateToken(user.getEmail());
        LoginResponse loginResponse = LoginResponse.builder()
                .roles(user.getRoles().stream().map(Role::getName).toList())
                .token(token)
                .build();

        return Response.<LoginResponse>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Login Successful")
                .data(loginResponse)
                .build();
    }

    @Override
    @Transactional
    public Response<?> forgetPassword(String email) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new NotFoundException("EMAIL NOT FOUND"));
        passwordResetCodeRepo.deleteByUserId(user.getId());

        String code = codeGenerator.generateCode();
        PasswordResetCode resetCode = PasswordResetCode.builder()
                .user(user)
                .code(code)
                .expiryDate(calculateExpiryDate())
                .used(false)
                .build();

        passwordResetCodeRepo.save(resetCode);

        // send email reset link out
        Map<String, Object> templateVariables = new HashMap<>();
        templateVariables.put("name", user.getFirstName());
        templateVariables.put("resetLink", resetLink + code);

        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(user.getEmail())
                .subject("Password Reset code")
                .templateName("password-reset")
                .templateVariables(templateVariables)
                .build();

        notificationService.sendEmail(notificationDTO, user);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Password reset code sent to your email")
                .build();

    }

    private LocalDateTime calculateExpiryDate() {
        return LocalDateTime.now().plusMinutes(60);
    }

    @Override
    @Transactional
    public Response<?> updatePasswordViaResetCode(ResetPasswordRequest resetPasswordRequest) {
        String code = resetPasswordRequest.getCode();
        String newPassword = resetPasswordRequest.getNewPassword();

        //find and validate code
        PasswordResetCode resetCode = passwordResetCodeRepo.findByCode(code).orElseThrow(() -> new BadRequestException("Invalid reset code"));

        //check expiration first
        if (resetCode.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetCodeRepo.delete(resetCode);
            throw new BadRequestException("Reset code has expired");
        }

        //update user pass
        User user = resetCode.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        //delete the code
        passwordResetCodeRepo.delete(resetCode);

        Map<String, Object> templateVariables = new HashMap<>();
        templateVariables.put("name", user.getFirstName());

        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(user.getEmail())
                .subject("Password Updated Successfully")
                .templateName("password-update-confirmation")
                .templateVariables(templateVariables)
                .build();

        notificationService.sendEmail(notificationDTO, user);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Password updated successfully")
                .build();


    }
}
