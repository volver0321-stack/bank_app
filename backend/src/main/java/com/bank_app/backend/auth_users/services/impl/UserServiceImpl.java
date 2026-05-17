package com.bank_app.backend.auth_users.services.impl;

import com.bank_app.backend.auth_users.dto.UpdatePasswordRequest;
import com.bank_app.backend.auth_users.dto.UserDTO;
import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.auth_users.mapper.UserMapper;
import com.bank_app.backend.auth_users.repo.UserRepo;
import com.bank_app.backend.auth_users.services.UserService;
import com.bank_app.backend.aws.S3Service;
import com.bank_app.backend.exceptions.BadRequestException;
import com.bank_app.backend.exceptions.NotFoundException;
import com.bank_app.backend.notification.dto.NotificationDTO;
import com.bank_app.backend.notification.services.NotificationService;
import com.bank_app.backend.res.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final S3Service s3Service;

    @Override
    public User getCurrentloggingUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new NotFoundException("User is not found");
        }

        String email = authentication.getName();

        return userRepo.findByEmail(email).orElseThrow(() -> new NotFoundException("user not found"));
    }

    @Override
    public Response<UserDTO> getMyProfiles() {
        User user = getCurrentloggingUser();
        UserDTO userDTO = userMapper.toDto(user);

        if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().isEmpty()) {
            String presignedUrl = s3Service.generatePresignedUrl(user.getProfilePictureUrl());
            userDTO.setProfilePictureUrl(presignedUrl);
        }

        return Response.<UserDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("User retrieved")
                .data(userDTO)
                .build();
    }

    @Override
    public Response<Page<UserDTO>> getAllUsers(int page, int size) {
        Page<User> users = userRepo.findAll(PageRequest.of(page, size));

        Page<UserDTO> userDTOS = users.map(userMapper::toDto);
        return Response.<Page<UserDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("User retrieved")
                .data(userDTOS)
                .build();
    }

    @Override
    public Response<?> updatePassword(UpdatePasswordRequest updatePasswordRequest) {
        User user = getCurrentloggingUser();

        String newPassword = updatePasswordRequest.getNewPassword();
        String oldPassword = updatePasswordRequest.getOldPassword();
        if (oldPassword == null || newPassword == null) {
            throw new BadRequestException("Old and New password required");
        }

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Old password not correct");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());

        userRepo.save(user);

        Map<String, Object> vars = new HashMap<>();
        vars.put("name", user.getFirstName());

        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(user.getEmail())
                .subject("Your Password was successfully changed")
                .templateName("password-update-confirmation")
                .templateVariables(vars)
                .build();

        notificationService.sendEmail(notificationDTO, user);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Password Changed Successfully")
                .build();
    }

    @Override
    public Response<?> uploadProfilePicture(MultipartFile file) {
        User user = getCurrentloggingUser();

        String oldProfilePictureKey = user.getProfilePictureUrl();

        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String key = "users/" + user.getId() + "/profile-picture/" + UUID.randomUUID() + fileExtension;
        String profilePictureKey = s3Service.uploadFile(file, key);

        user.setProfilePictureUrl(profilePictureKey);
        userRepo.save(user);

        s3Service.deleteFile(oldProfilePictureKey);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Profile Picture Uploaded Successfully")
                .build();
    }
}
