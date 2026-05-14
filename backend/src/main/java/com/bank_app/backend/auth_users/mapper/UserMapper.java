package com.bank_app.backend.auth_users.mapper;

import com.bank_app.backend.auth_users.dto.UserDTO;
import com.bank_app.backend.auth_users.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserDTO userDTO);

    UserDTO toDto(User user);
}
