package com.bank_app.backend.auth_users.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.query.sqm.mutation.internal.inline.AbstractInlineHandler;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResetPasswordRequest {

    private String email;

    private String code;
    private String newPassword;
}
