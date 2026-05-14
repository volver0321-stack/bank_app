package com.bank_app.backend.auth_users.mapper;

import com.bank_app.backend.auth_users.dto.UserDTO;
import com.bank_app.backend.auth_users.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "accounts", ignore = true)
    User toEntity(UserDTO userDTO);

    @Mapping(target = "accounts", ignore = true)
    UserDTO toDto(User user);
}
