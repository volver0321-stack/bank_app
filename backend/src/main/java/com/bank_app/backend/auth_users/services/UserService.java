package com.bank_app.backend.auth_users.services;

import com.bank_app.backend.auth_users.dto.UpdatePasswordRequest;
import com.bank_app.backend.auth_users.dto.UserDTO;
import com.bank_app.backend.auth_users.entity.User;
import com.bank_app.backend.res.Response;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    User getCurrentloggingUser();

    Response<UserDTO> getMyProfiles();

    Response<Page<UserDTO>> getAllUsers(int page, int size);

    Response<?> updatePassword(UpdatePasswordRequest updatePasswordRequest);

    Response<?> uploadProfilePicture(MultipartFile file);
}
